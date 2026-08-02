// Pageviews, exactly once each, in exactly one place.
//
// Two shapes of app, one behavior:
//
//   • CONTROLLED — the app hands us the current path (Next: `usePathname()`,
//     a router: its location). We fire on mount and on every change.
//   • UNCONTROLLED — the app hands us nothing. We watch the History API
//     ourselves (pushState/replaceState/popstate/hashchange), so a SPA route
//     change is counted with zero app code. This is the zero-config path.
//
// Interaction capture is deliberately NOT allowed to also report navigations
// (`nav: false` in useReplay) — two sources would double-count every view.

import { useEffect, useRef } from 'react'
import type { Telemetry } from './types.js'

const location = (): string => {
  try {
    return window.location.pathname + window.location.search + window.location.hash
  } catch {
    return ''
  }
}

const pathname = (): string | undefined => {
  try {
    return window.location.pathname
  } catch {
    return undefined
  }
}

/** useRouteTracking records one pageview per navigation. Pass `path` to drive it
 *  from the app's router, or omit it to let the History API drive it. */
export function useRouteTracking(
  telemetry: Telemetry,
  active: boolean,
  path?: string | null
): void {
  const last = useRef<string | null>(null)
  const controlled = path !== undefined

  // Controlled: the app's router is the clock.
  useEffect(() => {
    if (!active || !controlled || typeof window === 'undefined') return
    const next = path ?? pathname() ?? ''
    if (last.current === next) return
    last.current = next
    telemetry.pageview(next)
  }, [telemetry, active, controlled, path])

  // Uncontrolled: the History API is the clock.
  useEffect(() => {
    if (!active || controlled || typeof window === 'undefined') return

    const fire = (): void => {
      const key = location()
      if (last.current === key) return
      last.current = key
      telemetry.pageview(pathname())
    }

    fire() // the initial load counts

    const history = window.history
    const push = history.pushState
    const replace = history.replaceState
    history.pushState = function (
      this: History,
      ...args: Parameters<History['pushState']>
    ) {
      const result = push.apply(this, args)
      fire()
      return result
    }
    history.replaceState = function (
      this: History,
      ...args: Parameters<History['replaceState']>
    ) {
      const result = replace.apply(this, args)
      fire()
      return result
    }
    window.addEventListener('popstate', fire)
    window.addEventListener('hashchange', fire)

    return () => {
      history.pushState = push
      history.replaceState = replace
      window.removeEventListener('popstate', fire)
      window.removeEventListener('hashchange', fire)
    }
  }, [telemetry, active, controlled])
}
