// Cross-component event bus. Used by feature pages to notify each
// other of side effects (e.g. workflow detail emits
// 'workflow-action-completed' so the namespace workflows list
// auto-refreshes).
//
// Single global instance because that is the contract — events are
// inherently global. The shape is a typed pub/sub.

export type AppEvent =
  | { kind: 'workflow-action-completed'; namespace: string; workflowId: string; runId?: string; action: string }
  | { kind: 'schedule-action-completed'; namespace: string; scheduleId: string; action: string }
  | { kind: 'batch-started'; namespace: string; batchId: string }
  | { kind: 'namespace-changed'; namespace: string }
  | { kind: 'codec-config-changed' }

export type AppEventKind = AppEvent['kind']

type Handler<E extends AppEvent = AppEvent> = (event: E) => void

const handlers = new Map<AppEventKind | '*', Set<Handler>>()

function bucket(kind: AppEventKind | '*') {
  let set = handlers.get(kind)
  if (!set) {
    set = new Set()
    handlers.set(kind, set)
  }
  return set
}

export const eventBus = {
  emit(event: AppEvent): void {
    const k = bucket(event.kind)
    for (const h of k) h(event)
    const star = handlers.get('*')
    if (star) for (const h of star) h(event)
  },
  on<K extends AppEventKind>(kind: K, h: Handler<Extract<AppEvent, { kind: K }>>): () => void {
    const set = bucket(kind)
    set.add(h as Handler)
    return () => {
      set.delete(h as Handler)
    }
  },
  onAny(h: Handler): () => void {
    const set = bucket('*')
    set.add(h)
    return () => {
      set.delete(h)
    }
  },
  clear(): void {
    handlers.clear()
  },
}

// React hook — auto-unsubscribes on unmount.
import { useEffect } from 'react'

export function useAppEvent<K extends AppEventKind>(
  kind: K,
  handler: (event: Extract<AppEvent, { kind: K }>) => void,
): void {
  useEffect(() => eventBus.on(kind, handler), [kind, handler])
}
