// The framework-agnostic half: build a Telemetry, or reach for the ambient one.
//
//   import { track } from '@hanzogui/telemetry'
//   track('checkout_started', { plan: 'pro' })
//
// No provider, no config, no init call. The first `track` lazily builds the
// ambient client from the environment; `<TelemetryProvider/>` registers its own
// client into the same slot, so React and non-React code emit through ONE
// instance and one stream.

import { createAnalytics } from '@hanzo/event'
import type { Analytics } from '@hanzo/event'
import { resolveEnabled } from './consent'
import { productFromHost, resolveEnv, runtimeProduct } from './env'
import type {
  Telemetry,
  TelemetryCommerce,
  TelemetryConfig,
  TelemetryErrorContext,
} from './types'

/** A DOM — not merely a `window`. React Native defines a global `window` with
 *  no `location`/`document`, and SSR defines neither; both must stay silent. */
export const hasDom = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

/** Never let a telemetry call throw into the caller. This is the ONLY error
 *  policy in the package: every public method funnels through it. */
function soft(fn: () => void, debug?: boolean): void {
  try {
    fn()
  } catch (err) {
    if (debug) console.debug('[telemetry] swallowed', err)
  }
}

/** The fully-resolved settings behind a Telemetry — useful in tests and in a
 *  debug overlay; returned by `describeTelemetry`. */
export interface ResolvedTelemetry {
  host: string
  product: string
  enabled: boolean
  replay: boolean
  errors: boolean
  pageviews: boolean
  hasIngestKey: boolean
  debug: boolean
}

const resolved = new WeakMap<object, ResolvedTelemetry>()

/** describeTelemetry exposes what a client actually resolved to. */
export function describeTelemetry(t: Telemetry): ResolvedTelemetry | undefined {
  return resolved.get(t)
}

/** createTelemetry builds an isolated client. Most surfaces never call this —
 *  they mount `<TelemetryProvider/>` or just `track()`. It is pure: no DOM
 *  access beyond reading `location.hostname`, no listeners, no requests. */
export function createTelemetry(config: TelemetryConfig = {}): Telemetry {
  const env = resolveEnv()
  const debug = config.debug ?? env.debug

  // Runtime before hostname: a desktop shell serves the SAME bundle from three
  // different origins (tauri://localhost, http://tauri.localhost, the Vite dev
  // server), so the URL is the one thing that cannot name that surface.
  const product =
    config.product ??
    env.product ??
    runtimeProduct() ??
    (hasDom() ? productFromHost(window.location?.hostname) : undefined) ??
    'unknown'

  // A DOM is a precondition: the client reads location/referrer and buffers to
  // an unload beacon. Server and native hosts stay silent rather than emit half
  // an event. `enabled` (a build-time kill switch) still wins over consent.
  const permitted =
    hasDom() &&
    resolveEnabled({ enabled: config.enabled ?? env.enabled, consent: config.consent })
  const errors = config.errors ?? true
  const replay = config.replay ?? true
  const pageviews = config.pageviews ?? true

  const client: Analytics = createAnalytics({
    host: config.host !== undefined ? config.host : env.host,
    product,
    ingestKey: config.ingestKey ?? env.ingestKey,
    getToken: config.getToken,
    enabled: permitted,
    // The provider owns pageviews; @hanzo/event owns global error capture.
    captureErrors: permitted && errors,
    debug,
  })

  const telemetry: Telemetry = {
    enabled: permitted,
    product,
    client,
    track: (event, properties, commerce?: TelemetryCommerce) =>
      soft(() => client.capture(event, properties, commerce), debug),
    pageview: (path, properties) => soft(() => client.pageview(path, properties), debug),
    identify: (personId, traits) => soft(() => client.identify(personId, traits), debug),
    group: (groupId, traits) => soft(() => client.group(groupId, traits), debug),
    captureError: (err, context?: TelemetryErrorContext) =>
      soft(() => client.captureError(err, context), debug),
    captureException: (err, context?: TelemetryErrorContext) =>
      soft(() => client.captureError(err, context), debug),
    setCohort: (patch) => soft(() => client.setCohort(patch), debug),
    flush: () => soft(() => client.flush(), debug),
  }

  resolved.set(telemetry, {
    host: config.host !== undefined ? config.host : env.host,
    product,
    enabled: permitted,
    replay,
    errors,
    pageviews,
    hasIngestKey: Boolean(config.ingestKey ?? env.ingestKey),
    debug,
  })

  return telemetry
}

let ambient: Telemetry | undefined

/** True while an APP-owned client holds the ambient slot. A client installed by
 *  `GuiProvider`'s fallback provider deliberately does NOT set this: it is the
 *  owner of last resort and must yield the moment the app claims the stream. */
let appOwned = false

type OwnerListener = () => void
const ownerListeners = new Set<OwnerListener>()

/** getTelemetry returns the ambient client, building it from the environment on
 *  first use. This is what makes `track()` work with zero setup. */
export function getTelemetry(): Telemetry {
  if (!ambient) ambient = createTelemetry()
  return ambient
}

/** setTelemetry installs a client as the ambient one. `<TelemetryProvider/>`
 *  calls this so module-scope `track()` and the React tree share one stream.
 *
 *  `app: false` installs it as the FALLBACK owner — the posture `GuiProvider`
 *  uses. A fallback owner is a real client in every other respect; it simply
 *  does not claim the stream, so an app that mounts its own provider (before or
 *  after, above or below) takes over and there is never a second one emitting. */
export function setTelemetry(t: Telemetry | undefined, opts?: { app?: boolean }): void {
  ambient = t
  appOwned = t !== undefined && (opts?.app ?? true)
  for (const fn of ownerListeners) {
    try {
      fn()
    } catch {
      /* a listener must never break the caller */
    }
  }
}

/** isTelemetryOwned reports whether the APP has claimed the stream. This is what
 *  a fallback provider consults before collecting anything. */
export function isTelemetryOwned(): boolean {
  return appOwned
}

/** onTelemetryOwnerChange subscribes to claims and releases; returns the
 *  unsubscribe. A fallback owner uses it to yield when an app-owned provider
 *  mounts late (a lazy route) and to resume if that provider unmounts. */
export function onTelemetryOwnerChange(fn: OwnerListener): () => void {
  ownerListeners.add(fn)
  return () => {
    ownerListeners.delete(fn)
  }
}

// ── The ambient API. Import and call; nothing to wire. ────────────────────────

/** Record a named product event → insights.hanzo.ai. */
export const track = (
  event: string,
  properties?: Record<string, unknown>,
  commerce?: TelemetryCommerce
): void => getTelemetry().track(event, properties, commerce)

/** Record a pageview → analytics.hanzo.ai. */
export const pageview = (path?: string, properties?: Record<string, unknown>): void =>
  getTelemetry().pageview(path, properties)

/** Bind the visitor to a stable person id. */
export const identify = (personId: string, traits?: Record<string, unknown>): void =>
  getTelemetry().identify(personId, traits)

/** Associate the visitor with an org/team. */
export const group = (groupId: string, traits?: Record<string, unknown>): void =>
  getTelemetry().group(groupId, traits)

/** Report an exception → sentry.hanzo.ai (and `analytics_errors` in insights). */
export const captureError = (err: unknown, context?: TelemetryErrorContext): void =>
  getTelemetry().captureError(err, context)

/** Alias of `captureError`. */
export const captureException = captureError

/** Drain the buffer now. */
export const flush = (): void => getTelemetry().flush()
