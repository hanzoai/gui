# @hanzogui/telemetry

Zero-config telemetry for any Hanzo surface — web, desktop and native.

**If you mount `<GuiProvider>` from `@hanzo/gui`, you already have it.** There is
nothing to install, import or wire: pageviews, unhandled errors, React render
errors and interaction capture reach the one Hanzo front door, with the product
name resolved from the runtime and the ingest key read from the environment.

```tsx
import { GuiProvider } from '@hanzo/gui'

<GuiProvider config={config}>{children}</GuiProvider>   // telemetry included
<GuiProvider config={config} telemetry={false}>…        // opt out
<GuiProvider config={config} telemetry={{ product: 'studio' }}>…
```

Mount it yourself only when you are not a gui app, or when you need to drive
pageviews from your router:

```tsx
import { TelemetryProvider } from '@hanzogui/telemetry'

export default function Root({ children }) {
  return <TelemetryProvider path={usePathname()}>{children}</TelemetryProvider>
}
```

It is also available from the component layer as `@hanzo/ui/telemetry`, which
re-exports this package unchanged — so an app that already depends on
`@hanzo/ui` adds nothing.

## One stream, never two

`GuiProvider` mounts `<TelemetryProvider owner="gui">`, and that posture is the
whole reason it is safe to turn on for every app at once: **a gui-owned provider
collects only while nothing else is collecting.**

| The app mounts | Where | What gui does |
|---|---|---|
| nothing | — | collects — this is the free case |
| `<AnalyticsProvider>` / `<TelemetryProvider>` | above `GuiProvider` | goes inert, and passes the app's client straight through |
| `<TelemetryProvider>` | below `GuiProvider` | goes inert; the app owns the stream |
| a second `<GuiProvider>` | anywhere | one client, one stream |

Ownership is a claim on a module-scope slot, not a render-time guess, so it
survives late mounts (a lazy route takes the stream) and unmounts (gui takes it
back). `owner="app"` is the default for a provider you mount yourself and always
wins.

**The one shape gui cannot see** is a raw `@hanzo/event` `<AnalyticsProvider>`
*below* `GuiProvider`: React context does not look down, and unlike
`<TelemetryProvider>` a raw one claims nothing. Those apps pass
`telemetry={false}` until they drop their own wiring.

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
| `NEXT_PUBLIC_EVENT_INGEST_KEY` / `VITE_EVENT_INGEST_KEY` / `EXPO_PUBLIC_EVENT_INGEST_KEY` | — | Publishable `pk-…` key — **the one name**, the one KMS carries at `deploy/EVENT_INGEST_KEY` and the one `@hanzo/event` reads. Write-only and safe in a bundle. Without it a beacon is unattributed and the door refuses it. (The older `…_HANZO_INGEST_KEY` spelling is still read, second, and is being retired.) |
| `NEXT_PUBLIC_HANZO_API_URL` / `VITE_HANZO_API_URL` | `https://api.hanzo.ai` | The one front door. |
| `NEXT_PUBLIC_HANZO_PRODUCT` / `VITE_HANZO_PRODUCT` | resolved from the runtime, then the hostname | Emitting surface. A Tauri window reports as `desktop` — it serves one bundle from three origins (`tauri://localhost`, `http://tauri.localhost`, the dev server), so the URL is the one thing that cannot name it. |
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

- **SSR-safe.** Importing does nothing; rendering on the server does nothing.
- **Native mounts, and stays silent for now.** `GuiProvider` wires telemetry
  identically on React Native, but a DOM is still the precondition for
  collecting: `@hanzo/event`'s `init()` reads `window.location.search` and
  `document.referrer` behind a `typeof window` check, and React Native defines a
  `window` with neither. Emitting on native needs that check to require a
  `document` — an `@hanzo/event` fix, not a gui one. Until then native is wired
  and inert rather than crashing.
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
