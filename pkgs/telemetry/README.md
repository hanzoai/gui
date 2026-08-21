# @hanzogui/telemetry

Zero-config telemetry for any Hanzo surface. One component, no configuration:

```tsx
import { TelemetryProvider } from '@hanzogui/telemetry'

export default function Root({ children }) {
  return <TelemetryProvider>{children}</TelemetryProvider>
}
```

That is the whole adoption. It is also available from the component layer as
`@hanzo/ui/telemetry`, which re-exports this package unchanged — so an app that
already depends on `@hanzo/ui` adds nothing.

## One door, three lenses

Everything — pageviews, product events, exceptions, interaction capture — is
POSTed as one batched stream to the **one** Hanzo front door:

```
POST https://api.hanzo.ai/v1/event   { batch: [Event, …] }
```

Cloud lenses that single stream into three views:

| Lens | Host | What it shows |
|---|---|---|
| Errors | `sentry.hanzo.ai` | exceptions, stacks, session capture |
| Web analytics | `analytics.hanzo.ai` | pageviews, referrers, campaigns |
| Product insights | `insights.hanzo.ai` | funnels, notebooks, **`analytics_errors`** |

Errors land in insights too, so a funnel drop joins to the exception that caused
it. Those three hosts are **dashboards**. They are never ingest endpoints: there
is exactly one API host, which is why there is nothing to configure.

## What you get for free

- **Pageviews**, including SPA route changes. Pass `path` (Next: `usePathname()`)
  to drive them from your router, or pass nothing and the History API drives them.
- **Errors** — `window.onerror`, unhandled rejections, and React render errors.
  This is the `@sentry` replacement; there is no browser Sentry SDK and no CDN
  script, so a `default-src 'none'` CSP cannot break it.
- **Session capture** — every click/input/submit annotated with a semantic
  hierarchy (`navigation/Dashboard/UserCard/button[save]`), so a replay is
  readable rather than a pixel movie. Loaded with a dynamic `import()` inside an
  idle callback, in its own chunk, so it never costs LCP.
- **First-touch attribution** and cohorts (`channel`, `refCode`, `signupWeek`)
  on every event.
- **Product inference** from the hostname — `console.hanzo.ai` reports as
  `console`, `hanzo.chat` as `chat`, `hanzo.ai` as `site`.

## Privacy

- **Do-Not-Track and Global Privacy Control are honored by default.** With
  either signal set and no explicit in-app choice, nothing is collected and
  nothing is written to storage.
- **Consent-aware.** An explicit choice the person makes in your UI outranks the
  browser default in both directions:

  ```tsx
  import { setConsent, useConsent } from '@hanzogui/telemetry'

  const choice = useConsent()          // 'granted' | 'denied' | undefined
  setConsent('denied')                 // takes effect immediately, everywhere
  setConsent('unset')                  // forget it; DNT/GPC applies again
  ```

  Revocation is prospective: collection stops at once. Events already buffered
  under a live consent may complete their in-flight flush.
- **Input values are withheld** from capture by default. `data-hz-private` on any
  element excludes its whole subtree.

## Anywhere else

Non-React code does not need the provider — the ambient client builds itself
from the environment on first use, and the provider registers its own client
into the same slot, so there is one instance and one stream either way.

```ts
import { track, identify, captureError, EVENTS } from '@hanzogui/telemetry'

identify(user.id)
track(EVENTS.PLAN_CLICKED, { plan: 'pro' })
try { risky() } catch (err) { captureError(err, { properties: { where: 'checkout' } }) }
```

## In components

```tsx
import { useTelemetry, useTrack } from '@hanzogui/telemetry'

const t = useTelemetry()          // total: never null, never throws, SSR-safe
const track = useTrack()          // just the recorder
```

## Configuration (all optional)

Environment, read from `process.env` (Next), `import.meta.env` (Vite/Expo), or a
`window.__HANZO_TELEMETRY__` object for pages with no build step:

| Variable | Default | Meaning |
|---|---|---|
| `NEXT_PUBLIC_HANZO_INGEST_KEY` / `VITE_HANZO_INGEST_KEY` | — | Publishable `pk_…` key. Write-only and safe in a bundle; it is what lets a logged-out marketing page light up all three lenses. |
| `NEXT_PUBLIC_HANZO_API_URL` / `VITE_HANZO_API_URL` | `https://api.hanzo.ai` | The one front door. |
| `NEXT_PUBLIC_HANZO_PRODUCT` / `VITE_HANZO_PRODUCT` | inferred from hostname | Emitting surface. |
| `NEXT_PUBLIC_HANZO_TELEMETRY` / `VITE_HANZO_TELEMETRY` | on | `0`/`false`/`off` is a build-time kill switch. |

Props, when you want them:

```tsx
<TelemetryProvider
  path={usePathname()}        // drive pageviews from your router
  product="console"           // override the inferred surface
  host=""                     // same-origin, cookie-auth apps
  getToken={() => token}      // bearer-auth apps
  replay={false}              // no interaction capture
  errors={false}              // no error capture
  pageviews={false}           // no pageviews
  consent="granted"           // your own consent gate decided
  enabled={false}             // hard kill switch, wins over everything
  fallback={(err, reset) => <Crash error={err} onReset={reset} />}
/>
```

With no `fallback`, a render error is reported and then **re-thrown** so your own
error UI still runs. Observing must not change behavior.

## Guarantees

- **SSR-safe.** Importing does nothing; rendering on the server does nothing. A
  DOM is required before anything is collected — React Native hosts stay silent
  rather than emit half an event.
- **Fail-soft.** Every public method swallows its own errors, network loss is
  ignored, and a failed capture-engine chunk simply means no capture.
- **Tree-shakable.** `sideEffects: false`, ESM, one export per concern.
- **No CDN.** Nothing is loaded from a third-party origin, ever.

## Composition

```
@hanzo/event      the ONE client — batching, attribution, the wire, the door
@hanzo/observe    the capture engine — semantics, redaction, playback stream
@hanzogui/telemetry  ← this: the zero-config policy that wires them together
@hanzo/ui/telemetry   re-export, so the component layer needs no new dependency
```

Mechanism lives below, policy lives here, and there is exactly one of each.
