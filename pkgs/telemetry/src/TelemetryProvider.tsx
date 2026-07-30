'use client'

// The one-liner.
//
//   import { TelemetryProvider } from '@hanzo/gui/telemetry'
//   <TelemetryProvider>{children}</TelemetryProvider>
//
// That mounts all three planes with no configuration:
//
//   errors + session capture → sentry.hanzo.ai
//   pageviews                → analytics.hanzo.ai
//   product events + errors  → insights.hanzo.ai  (analytics_errors, so a funnel
//                              drop joins to the exception behind it)
//
// One stream reaches all three: every event is POSTed to the ONE front door
// (api.hanzo.ai/v1/event) and lensed server-side. Three views, one datastore,
// one thing to configure — and by default, nothing to configure.

import {
  Component,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { AnalyticsProvider } from '@hanzo/event/react'
import { getConsent, onConsentChange } from './consent.js'
import { createTelemetry, getTelemetry, setTelemetry } from './telemetry.js'
import { useReplay } from './useReplay.js'
import { useRouteTracking } from './useRouteTracking.js'
import type { Telemetry, TelemetryConfig } from './types.js'

const TelemetryContext = createContext<Telemetry | null>(null)

export interface TelemetryProviderProps extends TelemetryConfig {
  /** The current route. Pass `usePathname()` (Next) or your router's location to
   *  drive pageviews from the app; omit it and the History API drives them. */
  path?: string | null
  /** Rendered instead of the crashed subtree. With no fallback the error is
   *  re-thrown after being reported, so the app's own error UI still runs — this
   *  provider observes crashes, it never swallows them. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  /** A pre-built client. Rarely needed; the provider builds one for you. */
  client?: Telemetry
  children: ReactNode
}

/** TelemetryProvider wires the whole telemetry surface for its subtree. Safe to
 *  render on the server (it does nothing there) and safe to render twice. */
export function TelemetryProvider(props: TelemetryProviderProps): ReactNode {
  const {
    path,
    fallback,
    client,
    children,
    host,
    product,
    ingestKey,
    getToken,
    enabled,
    consent,
    replay,
    errors,
    pageviews,
    redaction,
    debug,
  } = props

  // A caller's `getToken` is usually an inline closure; keep the identity we
  // hand the client stable so the client is not rebuilt on every render.
  const tokenRef = useRef(getToken)
  tokenRef.current = getToken
  const redactionRef = useRef(redaction)
  redactionRef.current = redaction

  // Consent can change at runtime (a banner, a settings toggle, another tab).
  // Re-resolving means the client stops or starts collecting immediately.
  const [consentEpoch, setConsentEpoch] = useState(0)
  useEffect(() => {
    const bump = (): void => setConsentEpoch((n) => n + 1)
    const off = onConsentChange(bump)
    const onStorage = (e: StorageEvent): void => {
      if (e.key === null || e.key === 'hz_consent') bump()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      off()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const telemetry = useMemo<Telemetry>(
    () =>
      client ??
      createTelemetry({
        host,
        product,
        ingestKey,
        getToken: tokenRef.current ? () => tokenRef.current?.() : undefined,
        enabled,
        consent,
        replay,
        errors,
        pageviews,
        debug,
      }),
    [
      client,
      host,
      product,
      ingestKey,
      enabled,
      consent,
      replay,
      errors,
      pageviews,
      debug,
      // Rebuilding on a consent change is the point: `enabled` is baked into the
      // client, and a fresh one collects (or refuses to collect) accordingly.
      consentEpoch,
    ],
  )

  // Module-scope `track()` and this tree share one client and one stream.
  useEffect(() => {
    setTelemetry(telemetry)
    telemetry.client.init()
    return () => {
      if (getTelemetry() === telemetry) setTelemetry(undefined)
    }
  }, [telemetry])

  const active = telemetry.enabled
  useRouteTracking(telemetry, active && (pageviews ?? true), path)
  useReplay(telemetry, active && (replay ?? true), redactionRef.current)

  return (
    <TelemetryContext.Provider value={telemetry}>
      {/* Interop: any @hanzo/* component that reads `useAnalytics()` gets THIS
          client. Pageviews are ours, so the built-in one is turned off. */}
      <AnalyticsProvider client={telemetry.client} autoPageview={false}>
        <TelemetryBoundary
          telemetry={telemetry}
          enabled={active && (errors ?? true)}
          fallback={fallback}
        >
          {children}
        </TelemetryBoundary>
      </AnalyticsProvider>
    </TelemetryContext.Provider>
  )
}

/** useTelemetry returns the client for the current tree. Outside a provider it
 *  returns the ambient one, so it is total — it never throws and never returns
 *  null, in a test, on the server, or in a component rendered standalone. */
export function useTelemetry(): Telemetry {
  const fromTree = useContext(TelemetryContext)
  const ambient = useMemo(() => getTelemetry(), [])
  return fromTree ?? ambient
}

/** useTrack is the narrow hook: just the event recorder, stable across renders. */
export function useTrack(): Telemetry['track'] {
  return useTelemetry().track
}

interface BoundaryProps {
  telemetry: Telemetry
  enabled: boolean
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  children: ReactNode
}

interface BoundaryState {
  error: Error | null
}

/** TelemetryBoundary reports React render errors — the ONE class of error that
 *  `window.onerror` never sees, so a boundary is the only way to observe them.
 *
 *  It reports and then gets out of the way: with no `fallback` the error is
 *  re-thrown so the app's own boundary (Next's `error.tsx`, an outer boundary)
 *  still decides what the user sees. Observing must not change behavior. */
export class TelemetryBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (this.props.enabled) {
      this.props.telemetry.captureError(error, {
        handled: false,
        properties: { componentStack: info.componentStack, react: true },
      })
    }
    // Re-throw HERE, not from render(), when the app supplied no fallback.
    //
    // React's order is: getDerivedStateFromError → re-render → commit →
    // componentDidCatch. Throwing from render() aborts that sequence before the
    // commit, so componentDidCatch never runs and the error is never reported —
    // silently, and only for the apps that (correctly) let their own boundary
    // own the UI. Throwing from componentDidCatch propagates to the next
    // boundary up exactly the same way, but AFTER the error has been observed.
    if (this.props.fallback === undefined) throw error
  }

  private reset = (): void => this.setState({ error: null })

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    const { fallback } = this.props
    // Nothing, for the one commit it takes componentDidCatch to re-throw; the
    // app's own boundary decides what the user actually sees.
    if (fallback === undefined) return null
    return typeof fallback === 'function' ? fallback(error, this.reset) : fallback
  }
}

/** useConsent reads the person's stored choice and re-reads it on change — the
 *  state a consent banner renders from. */
export function useConsent(): 'granted' | 'denied' | undefined {
  const [value, setValue] = useState<'granted' | 'denied' | undefined>(undefined)
  useEffect(() => {
    setValue(getConsent())
    return onConsentChange(setValue)
  }, [])
  return value
}
