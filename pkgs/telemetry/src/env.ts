// Zero-config resolution: where telemetry goes and what it calls itself, with
// nobody having configured anything.
//
// THE ONE FRONT DOOR. Everything a Hanzo surface emits — pageviews, product
// events, exceptions, interaction capture — is POSTed to
//
//     POST https://api.hanzo.ai/v1/event   { batch: [Event, …] }
//
// and Cloud lenses that single stream into the three views:
//
//     sentry.hanzo.ai     errors + stacks + session capture
//     analytics.hanzo.ai  web analytics (pageviews, referrers, campaigns)
//     insights.hanzo.ai   product insights + notebooks (incl. analytics_errors,
//                         so a funnel drop joins to the exception that caused it)
//
// Those are dashboards — FRONTENDS. They are never ingest endpoints. There is
// exactly one API host, so there is exactly one thing to configure, and by
// default you configure nothing.

const DEFAULT_HOST = 'https://api.hanzo.ai'

// Declared locally rather than pulling @types/node into a browser package: the
// only thing this package wants from Node is `process.env`, and only when a
// bundler has inlined it.
declare const process: { env?: Record<string, string | undefined> } | undefined

/** The keys this package understands, sans prefix. */
interface RawEnv {
  apiUrl?: string
  ingestKey?: string
  product?: string
  /** "0" | "false" | "off" disables telemetry entirely. */
  telemetry?: string
  debug?: string
}

/** A runtime override for hosts with no build step (a static page can set
 *  `window.__HANZO_TELEMETRY__ = { ingestKey: 'pk_…' }` from a script tag). */
export interface TelemetryGlobal {
  apiUrl?: string
  host?: string
  ingestKey?: string
  product?: string
  enabled?: boolean
  debug?: boolean
}

const first = (...vals: Array<string | undefined>): string | undefined => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim() !== '') return v.trim()
  }
  return undefined
}

/** `process.env.X` and `import.meta.env.X` must be written as LITERAL member
 *  expressions or no bundler will inline them — hence the explicit table. This
 *  is the only place in the package that reads the environment. */
function processEnv(): RawEnv {
  try {
    if (typeof process === 'undefined' || !process.env) return {}
    const e = process.env
    return {
      apiUrl: first(e.NEXT_PUBLIC_HANZO_API_URL, e.PUBLIC_HANZO_API_URL, e.HANZO_API_URL),
      ingestKey: first(e.NEXT_PUBLIC_HANZO_INGEST_KEY, e.PUBLIC_HANZO_INGEST_KEY, e.HANZO_INGEST_KEY),
      product: first(e.NEXT_PUBLIC_HANZO_PRODUCT, e.PUBLIC_HANZO_PRODUCT, e.HANZO_PRODUCT),
      telemetry: first(e.NEXT_PUBLIC_HANZO_TELEMETRY, e.PUBLIC_HANZO_TELEMETRY, e.HANZO_TELEMETRY),
      debug: first(e.NEXT_PUBLIC_HANZO_TELEMETRY_DEBUG, e.PUBLIC_HANZO_TELEMETRY_DEBUG),
    }
  } catch {
    return {}
  }
}

function metaEnv(): RawEnv {
  try {
    // MEMBER form, deliberately. Aliasing a bare `import.meta` first
    // (`const m = import.meta`) is a parse-time SyntaxError in a CommonJS
    // consumer: every babel plugin that rewrites `import.meta` for a CJS target
    // matches only the member expression, so a bare one survives the transform
    // and takes the whole module down. Jest is the one that finds this.
    const e = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env
    if (!e) return {}
    return {
      apiUrl: first(e.VITE_HANZO_API_URL, e.EXPO_PUBLIC_HANZO_API_URL, e.PUBLIC_HANZO_API_URL),
      ingestKey: first(e.VITE_HANZO_INGEST_KEY, e.EXPO_PUBLIC_HANZO_INGEST_KEY, e.PUBLIC_HANZO_INGEST_KEY),
      product: first(e.VITE_HANZO_PRODUCT, e.EXPO_PUBLIC_HANZO_PRODUCT, e.PUBLIC_HANZO_PRODUCT),
      telemetry: first(e.VITE_HANZO_TELEMETRY, e.EXPO_PUBLIC_HANZO_TELEMETRY, e.PUBLIC_HANZO_TELEMETRY),
      debug: first(e.VITE_HANZO_TELEMETRY_DEBUG, e.EXPO_PUBLIC_HANZO_TELEMETRY_DEBUG),
    }
  } catch {
    return {}
  }
}

function globalEnv(): TelemetryGlobal {
  try {
    const g = globalThis as unknown as { __HANZO_TELEMETRY__?: TelemetryGlobal }
    return g.__HANZO_TELEMETRY__ ?? {}
  } catch {
    return {}
  }
}

/** Surfaces whose product name is not simply their first hostname label. */
const PRODUCT_BY_HOST: Readonly<Record<string, string>> = {
  'hanzo.ai': 'site',
  'hanzo.chat': 'chat',
  'hanzo.app': 'app',
  'hanzo.id': 'iam',
  'hanzo.industries': 'industries',
  'hanzo.network': 'network',
}

/** Product inferred from where the page is served — the reason you can ship
 *  `<TelemetryProvider/>` with no props and still get correctly-labelled data. */
export function productFromHost(hostname: string | undefined): string | undefined {
  if (!hostname) return undefined
  const h = hostname.toLowerCase().replace(/^www\./, '')
  if (h === 'localhost' || h === '::1' || h === '[::1]' || /^127\./.test(h)) return 'dev'
  const mapped = PRODUCT_BY_HOST[h]
  if (mapped) return mapped
  // `console.hanzo.ai` → console, `cloud.hanzo.ai` → cloud, `zoo.ngo` → zoo.
  const label = h.split('.')[0]
  return label && label !== '' ? label : undefined
}

const isOff = (v: string | undefined): boolean =>
  v === '0' || v === 'false' || v === 'off' || v === 'no'

const isOn = (v: string | undefined): boolean =>
  v === '1' || v === 'true' || v === 'on' || v === 'yes'

/** What the environment says, already merged and normalized. */
export interface ResolvedEnv {
  host: string
  product?: string
  ingestKey?: string
  /** Present only when the environment explicitly turned telemetry on or off. */
  enabled?: boolean
  debug: boolean
}

/** resolveEnv merges, in increasing precedence: built-in defaults, the build
 *  environment (`process.env` / `import.meta.env`), and a runtime global. It
 *  never throws and never touches the DOM. */
export function resolveEnv(): ResolvedEnv {
  const p = processEnv()
  const m = metaEnv()
  const g = globalEnv()

  const telemetryFlag = first(m.telemetry, p.telemetry)
  const enabled =
    typeof g.enabled === 'boolean'
      ? g.enabled
      : isOff(telemetryFlag)
        ? false
        : isOn(telemetryFlag)
          ? true
          : undefined

  return {
    host: first(g.host, g.apiUrl, m.apiUrl, p.apiUrl) ?? DEFAULT_HOST,
    product: first(g.product, m.product, p.product),
    ingestKey: first(g.ingestKey, m.ingestKey, p.ingestKey),
    enabled,
    debug: g.debug === true || isOn(first(m.debug, p.debug)),
  }
}

export { DEFAULT_HOST }
