// SSE subscription hook — keeps a persistent EventSource and forwards
// matching events to the caller. Generic over event kind so kms can
// subscribe to `secret.rotated` while tasks subscribes to
// `workflow.started`.
//
// Each call to `useEvents` opens its own EventSource. That's the same
// trade-off `useFetch` makes: no shared connection cache, in exchange
// for orthogonality. If you have many subscribers on one route,
// hoist the subscription to the route component and dispatch
// downward.

import { useEffect, useRef } from 'react'

export interface UseEventsOptions<TEvent extends { kind: string }> {
  // SSE endpoint URL. Caller controls the path — e.g. `/v1/tasks/events`,
  // `/v1/kms/events`.
  url: string
  // Event kind names to subscribe to. Each becomes a named-event
  // listener on the EventSource. Empty array means "all".
  kinds: ReadonlyArray<TEvent['kind']>
  // Optional predicate — return true to forward the event to onEvent.
  // Use this for namespace / org scoping.
  filter?: (event: TEvent) => boolean
  // Callback invoked for each matching event.
  onEvent: (event: TEvent) => void
}

export function useEvents<TEvent extends { kind: string }>(opts: UseEventsOptions<TEvent>) {
  const { url, kinds, filter, onEvent } = opts

  // Hold the latest filter / onEvent / kinds in refs so the effect can
  // read them without listing them as deps. Without this, an inline
  // `onEvent={(e) => …}` (every render a new identity) would tear the
  // EventSource down and back up, leaking TCP, churning server resources,
  // and dropping events during the gap.
  const filterRef = useRef(filter)
  const onEventRef = useRef(onEvent)
  const kindsRef = useRef(kinds)
  useEffect(() => {
    filterRef.current = filter
    onEventRef.current = onEvent
    kindsRef.current = kinds
  })

  // `kinds.join('|')` is a stable string fingerprint — when the *set* of
  // kinds actually changes the effect re-runs and re-binds named-event
  // listeners; identity-only changes (new array, same contents) don't.
  const kindsKey = kinds.join('|')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const es = new EventSource(url)
    const handle = (e: MessageEvent) => {
      let event: TEvent
      try {
        event = JSON.parse(e.data) as TEvent
      } catch {
        return
      }
      const f = filterRef.current
      if (f && !f(event)) return
      onEventRef.current(event)
    }
    const boundKinds = kindsRef.current
    boundKinds.forEach((k) => es.addEventListener(k as string, handle as EventListener))
    es.onmessage = handle
    es.onerror = () => {
      // Browser auto-reconnects. Surface as a banner in the consumer
      // if/when we want explicit "lost connection" UI.
    }
    return () => {
      boundKinds.forEach((k) => es.removeEventListener(k as string, handle as EventListener))
      es.close()
    }
  }, [url, kindsKey])
}
