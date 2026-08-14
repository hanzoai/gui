// Screen views on React Native, exactly once each — the mobile counterpart to
// useRouteTracking.
//
// The web counts pageviews from the History API; React Native has no History
// and no URL, so a screen change is only visible through the navigator. This is
// the ONE binding a mobile app adds: hand it your NavigationContainer ref and
// every screen becomes a pageview named by its route.
//
//   import { useNavigationContainerRef } from '@react-navigation/native'
//   const navRef = useNavigationContainerRef()
//   useScreenTracking(navRef)
//   return <NavigationContainer ref={navRef}>…</NavigationContainer>
//
// It is duck-typed against the two members it reads, so the package takes no
// dependency on @react-navigation and stays framework-agnostic. Reporting stays
// single-sourced: the web counts from History, native counts from here, and the
// two runtimes are mutually exclusive — no view is ever counted twice.

import { useEffect, useRef } from 'react'
import { useTelemetry } from './TelemetryProvider'

/** The two members of a React Navigation container ref that screen tracking
 *  reads. `addListener('state', …)` returns its own unsubscribe, exactly as
 *  React Navigation's does, so the cleanup wiring is theirs and not ours. */
export interface NavigationRefLike {
  addListener: (type: 'state', callback: () => void) => () => void
  getCurrentRoute: () =>
    | { name?: string; params?: Record<string, unknown> }
    | undefined
}

/** useScreenTracking records one pageview per screen change from a React
 *  Navigation container ref. A no-op while telemetry is disabled or the ref is
 *  not ready (both common on the first render), so it is safe to call
 *  unconditionally at the app root — it starts counting the moment both hold. */
export function useScreenTracking(
  navigationRef: NavigationRefLike | null | undefined,
  active = true
): void {
  const telemetry = useTelemetry()
  const last = useRef<string | null>(null)
  useEffect(() => {
    if (!active || !navigationRef || !telemetry.enabled) return
    const fire = (): void => {
      const name = navigationRef.getCurrentRoute()?.name
      if (!name || last.current === name) return
      last.current = name
      telemetry.pageview(name)
    }
    fire() // the screen already mounted at wiring time counts
    return navigationRef.addListener('state', fire)
  }, [navigationRef, active, telemetry])
}
