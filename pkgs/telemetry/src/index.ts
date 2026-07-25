// @hanzogui/telemetry — the ONE telemetry surface for Hanzo apps.
//
//   <TelemetryProvider>{children}</TelemetryProvider>     // zero config
//   const t = useTelemetry(); t.track('plan_clicked')     // in components
//   import { track } from '@hanzogui/telemetry'           // anywhere else
//
// One provider, one client, one stream to the ONE front door
// (POST api.hanzo.ai/v1/event), lensed server-side into three views:
// sentry.hanzo.ai (errors + session capture), analytics.hanzo.ai (pageviews),
// insights.hanzo.ai (product events + analytics_errors).
//
// Honors Do-Not-Track and Global Privacy Control, consent-aware, SSR-safe,
// side-effect-free on import, and fail-soft: it can never break the host app.

export { TelemetryProvider, TelemetryBoundary, useTelemetry, useTrack, useConsent } from './TelemetryProvider.js'
export type { TelemetryProviderProps } from './TelemetryProvider.js'

export {
  createTelemetry,
  describeTelemetry,
  getTelemetry,
  setTelemetry,
  hasDom,
  track,
  pageview,
  identify,
  group,
  captureError,
  captureException,
  flush,
} from './telemetry.js'
export type { ResolvedTelemetry } from './telemetry.js'

export { doNotTrack, getConsent, setConsent, onConsentChange, resolveEnabled } from './consent.js'

export { productFromHost, resolveEnv, DEFAULT_HOST } from './env.js'
export type { ResolvedEnv, TelemetryGlobal } from './env.js'

export { useRouteTracking } from './useRouteTracking.js'
export { useReplay } from './useReplay.js'

export type {
  Analytics,
  Exception,
  RedactionPolicy,
  StoredConsent,
  Telemetry,
  TelemetryCommerce,
  TelemetryConfig,
  TelemetryConsent,
  TelemetryErrorContext,
} from './types.js'

// The shared event + goal vocabulary, so a surface never invents its own names
// for a signup or a sale. One import for the whole telemetry story.
export { EVENTS, GOALS, COHORTS, PAGEVIEW } from '@hanzo/event'
export type { EventName, GoalDef, CohortDef } from '@hanzo/event'
