# @hanzo/ai — one app surface, every platform

The Hanzo / Zoo / Lux AI app is **one** thing: `@hanzo/ai`. Web, desktop and
mobile are not three apps — they are the same app with two axes injected.

```
         ┌──────────────────────────  @hanzo/ai  ──────────────────────────┐
         │  src/app/  (the migrated shinkai-fork app — ONE copy, one place) │
         │  + net-* libs (ui, state, i18n, message-ts, brand-config, logo,  │
         │    artifacts)  + src/host/* (the @tauri-apps shim surface)       │
         └──────────────────────────────────────────────────────────────────┘
                    ▲                    ▲                      ▲
        host = web (default)   host = tauriHost        host = expoHost
        brand = getBrand()     brand = getBrand()      brand = getBrand()
                    │                    │                      │
            hanzo.app / .chat     hanzoai/desktop          @hanzo/gui
            zoo.cloud / lux.cloud  zooai/app · luxfi/app    (Expo mobile)
```

## The two orthogonal axes (decomplected)

| Axis | What it is | How it's injected | Default |
|---|---|---|---|
| **Brand** | hanzo / zoo / lux identity, cloud endpoints, chain, IAM | `getBrand()` (driven by `VITE_BRAND` or hostname) **or** spread as props `<HanzoAI {...brand}/>` | `getBrand()` → hostname → HANZO |
| **Platform** | how native calls (`invoke`, `listen`, fs, window…) resolve | `host` prop — a `HostAdapter` | web no-ops |

Everything else — the entire app — is shared. A new app is a ~10-line shim:

```tsx
import HanzoAI, { getBrand } from '@hanzo/ai';
import { tauriHost } from './tauri-host';            // desktop only; web omits it
createRoot(root).render(
  <HanzoAI {...getBrand()} host={tauriHost} features={{ chat, wallet, agents }} />
);
```

## Web ⇄ desktop parity

The web shim and the desktop shim are **byte-identical except one prop**
(`host={tauriHost}`). They import the same `@hanzo/ai`, which is the same
`src/app`. So the rendered React tree — every screen, route and component — is
identical. The only runtime difference is what `HostAdapter` does:

| Call | web (default host) | desktop (tauriHost) |
|---|---|---|
| `invoke(cmd, args)` | no-op, returns `undefined` (logs in dev) | Tauri IPC → Rust |
| `listen(event, cb)` | no-op unlisten | Tauri event bus |
| `getCurrentWindow()` | no-op Window (emit/listen/geometry) | real Tauri window |
| fs / shell / process / updater | no-op / empty | Tauri plugins |

So on the web the app renders 1:1 with desktop; native-only actions (open a
folder, auto-update, tray) simply do nothing instead of crashing. Cloud
inference + chat work on both (they go over HTTP to the brand's
`inferenceEndpoint`, not through `invoke`).

## Verification (2026-06-04)

| Surface | Build | Render |
|---|---|---|
| web dev server (`pkgs/ai/web`, imports `src`) | ✅ | ✅ Hanzo onboarding |
| web prod (unminified, 55M) | ✅ 40s | ✅ |
| web prod (minified, 13M / gzip 3.75M) | ✅ 44s | ✅ |
| library `dist` (self-contained, react external) | ✅ | — |
| **external shim** (`examples/web`, only react provided, app from `dist`) | ✅ | ✅ — proves SDK consumption |

The render blocker that had to be cleared first: app modules imported
`useBrand` from the **`@hanzo/ai` package name**, which resolved to the built
`dist` — pulling a second React + a second app copy into the source graph (a
cycle → `useContext` of null). Fix: the brand store lives in
`@hanzo_network/brand-config` (plain getters, not hooks), aliased to `src`;
app code never imports the `@hanzo/ai` package by name.

## Turning the real repos into shims

`luxfi/app`, `zooai/app`, `hanzoai/desktop`, `hanzoai/app` each become the
shim above. Per repo: depend on `@hanzo/ai` (+ `react`, `react-dom`, and for
desktop `@tauri-apps/api`), set `VITE_BRAND`, drop all app source. The
Dockerfile/Tauri config builds from the pinned SDK — exactly how
`zooai/exchange` builds from `@luxfi/exchange`. (`@hanzo/ai` is not yet
published to npm; until then the shims consume it via the workspace.)
