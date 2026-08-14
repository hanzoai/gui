// Public types for @hanzogui/telemetry.
//
// One vocabulary for the whole thing: a Telemetry is what you call, a
// TelemetryConfig is how you (optionally) shape it. Everything is optional —
// with no config at all the provider resolves a working setup from the
// environment (see env.ts) and the current host.

import type { Analytics, Exception } from '@hanzo/event'
import type { RedactionPolicy } from '@hanzo/observe'

export type { RedactionPolicy }

/** Consent posture.
 *
 *  - `auto`    — honor Do-Not-Track / Global-Privacy-Control and any stored
 *                in-app choice. The default; correct for almost every surface.
 *  - `granted` — the app has its own consent gate and it said yes.
 *  - `denied`  — the app has its own consent gate and it said no.
 */
export type TelemetryConsent = 'auto' | 'granted' | 'denied'

/** A user's explicit, persisted choice — set by `setConsent`, cleared with
 *  `'unset'` so the `auto` policy applies again. */
export type StoredConsent = 'granted' | 'denied'

/** Commerce dimensions carried on a revenue event. */
export interface TelemetryCommerce {
  productId?: string
  quantity?: number
  revenue?: number
  currency?: string
}

/** Extra context for a reported exception. */
export interface TelemetryErrorContext {
  /** false = an unhandled/global error; true = one the app caught and reported. */
  handled?: boolean
  properties?: Record<string, unknown>
}

/** Everything you may override. Every field has a working default. */
export interface TelemetryConfig {
  /** The ONE Hanzo API front door. Defaults to `https://api.hanzo.ai` (or
   *  `''` for same-origin cookie apps served behind the same edge). There is
   *  exactly one ingest host — the three lenses are views on the one stream,
   *  never three endpoints. */
  host?: string
  /** Emitting surface (`site` | `app` | `chat` | `console` | `cloud` | …).
   *  Inferred from the hostname when omitted. */
  product?: string
  /** Publishable ingest key (`pk_…`, write-only, safe in a bundle). Read from
   *  the environment when omitted — this is what lights up all three lenses on
   *  a logged-out marketing page. */
  ingestKey?: string
  /** Bearer provider for token-auth apps. Omit for cookie/session apps. */
  getToken?: () => string | undefined | null
  /** Hard on/off override. Wins over consent and DNT — use it for a build-time
   *  kill switch, not for user choice. */
  enabled?: boolean
  /** Consent posture (default `auto` = honor DNT/GPC + stored choice). */
  consent?: TelemetryConsent
  /** Capture interactions for session playback (default true). The engine is
   *  imported lazily, off the critical path, so it never costs LCP. */
  replay?: boolean
  /** Auto-capture unhandled errors, rejections and React render errors
   *  (default true). */
  errors?: boolean
  /** Record pageviews, including SPA route changes (default true). */
  pageviews?: boolean
  /** Privacy policy for interaction capture. Input values are withheld by
   *  default; `data-hz-private` excludes a whole subtree. */
  redaction?: RedactionPolicy
  /** Log what the client is doing to the console. */
  debug?: boolean
}

/** The one thing you call. Total and fail-soft: every method swallows its own
 *  errors, so telemetry can never break the host app. */
export interface Telemetry {
  /** Whether anything is actually being sent right now (consent/DNT applied). */
  readonly enabled: boolean
  /** The resolved emitting surface. */
  readonly product: string
  /** Record a named product event. */
  track(
    event: string,
    properties?: Record<string, unknown>,
    commerce?: TelemetryCommerce
  ): void
  /** Record a pageview. The provider does this for you on every route change. */
  pageview(path?: string, properties?: Record<string, unknown>): void
  /** Bind the visitor to a stable person id (post-login). */
  identify(personId: string, traits?: Record<string, unknown>): void
  /** Associate the visitor with an org/team. */
  group(groupId: string, traits?: Record<string, unknown>): void
  /** Report an exception. Unhandled ones are captured automatically. */
  captureError(err: unknown, context?: TelemetryErrorContext): void
  /** Alias of `captureError`, for muscle memory. */
  captureException(err: unknown, context?: TelemetryErrorContext): void
  /** Persist cohort dimensions so they ride every subsequent event. */
  setCohort(patch: { signupWeek?: string; channel?: string; refCode?: string }): void
  /** Drain the buffer now. */
  flush(): void
  /** The underlying @hanzo/event client — the escape hatch, rarely needed. */
  readonly client: Analytics
}

export type { Analytics, Exception }
