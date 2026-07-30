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

/** Where we are, as `{key, path}` — `key` is the full location (so a query-only
 *  change still counts as a view) and `path` is what gets reported.
 *
 *  `url` is the third argument the app just handed `pushState`/`replaceState`.
 *  Preferring it over reading `window.location` back is not a workaround: it is
 *  the navigation the app actually requested, resolved against the current
 *  document. Reading `location` instead assumes the host reflects a pushState
 *  into `location` synchronously — every real browser does, but that makes the
 *  behavior untestable in a DOM shim, and an assumption nothing verifies is one
 *  that silently rots. With no `url` argument (popstate, hashchange, the initial
 *  load) `location` is the only source, and it is read exactly as before. */
const where = (url?: string | URL | null): { key: string; path: string | undefined } => {
  try {
    const loc = window.location
    const u = url == null || url === '' ? loc : new URL(String(url), loc.href)
    return { key: u.pathname + u.search + u.hash, path: u.pathname }
  } catch {
    return { key: '', path: undefined }
  }
}

/** useRouteTracking records one pageview per navigation. Pass `path` to drive it
 *  from the app's router, or omit it to let the History API drive it. */
export function useRouteTracking(
  telemetry: Telemetry,
  active: boolean,
  path?: string | null,
): void {
  const last = useRef<string | null>(null)
  const controlled = path !== undefined

  // Controlled: the app's router is the clock.
  useEffect(() => {
    if (!active || !controlled || typeof window === 'undefined') return
    const next = path ?? where().path ?? ''
    if (last.current === next) return
    last.current = next
    telemetry.pageview(next)
  }, [telemetry, active, controlled, path])

  // Uncontrolled: the History API is the clock.
  useEffect(() => {
    if (!active || controlled || typeof window === 'undefined') return

    const fire = (url?: string | URL | null): void => {
      const { key, path: next } = where(url)
      if (last.current === key) return
      last.current = key
      telemetry.pageview(next)
    }

    fire() // the initial load counts

    const history = window.history
    const push = history.pushState
    const replace = history.replaceState
    history.pushState = function (this: History, ...args: Parameters<History['pushState']>) {
      const result = push.apply(this, args)
      fire(args[2])
      return result
    }
    history.replaceState = function (this: History, ...args: Parameters<History['replaceState']>) {
      const result = replace.apply(this, args)
      fire(args[2])
      return result
    }
    const onPop = (): void => fire()
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)

    return () => {
      history.pushState = push
      history.replaceState = replace
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [telemetry, active, controlled])
}
