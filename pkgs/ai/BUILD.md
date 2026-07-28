# @hanzo/app — build / migration plan

Goal: the Hanzo AI app as **one declarative SDK component** (`<HanzoAI {...brand} />`),
so `hanzo/zoo/lux` desktop+mobile apps become ~80-line shims — exactly how
`zooai/exchange` / `luxfi/exchange` consume `@luxfi/exchange`.

```
@hanzo/app  (this pkg — the app)            @luxfi/exchange  (the analog)
   ▲                                          ▲
hanzoai/desktop · zooai/app · luxfi/app    zooai/exchange · luxfi/exchange
   <HanzoAI {...brand}/>                      <Exchange {...brand}/>
```

## Status
- [x] Props contract — `BrandConfig` lifted from `hanzoai/desktop/libs/brand-config` → `src/types.ts`.
- [x] `<HanzoAI>` component + `BrandProvider`/`useBrand` (prop-driven; replaces `getBrand()` env lookup).
- [ ] **Move the app in** (the big rock).
- [ ] **Decouple Tauri** (44 files).
- [ ] **Bundle + publish** `@hanzo/app` and its libs.
- [ ] **Shims**: rewrite `hanzoai/desktop`, `zooai/app`, `luxfi/app` to the shim.

## The move (~955 source files)
From `hanzoai/desktop`:
| Source | Files | Destination |
|---|---|---|
| `apps/hanzo-desktop/src/**` | 263 | `pkgs/ai/src/app/**` (App.tsx → `./app/App`) |
| `libs/hanzo-node-state/src` | 460 | `pkgs/state` → `@hanzo_network/hanzo-node-state` |
| `libs/hanzo-ui/src` | 192 | `pkgs/hanzo-ui` → `@hanzo_network/hanzo-ui` |
| `libs/hanzo-message-ts/src` | 32 | `pkgs/message-ts` → `@hanzo_network/hanzo-message-ts` |
| `libs/hanzo-i18n/src` | 8 | `pkgs/hanzo-i18n` → `@hanzo_network/hanzo-i18n` |

Mechanical, but two rewrites are required during the move:
1. `getBrand()` / `import.meta.env.VITE_BRAND` → `useBrand()` (from `./brand-context`).
2. The **44** `@tauri-apps/*` import sites → the injected `host: HostAdapter` prop
   (`host.invoke` / `host.listen`), so the SDK runs on plain web *and* Tauri *and* Expo.
   On web with no `host`, those features degrade gracefully.

## Then the shim (per app) — the whole app:
```tsx
// luxfi/app — apps/web/src/main.tsx
import HanzoAI from '@hanzo/app'
import brand   from '@luxfi/brand'
import { tauriHost } from './host'   // desktop adapter
createRoot(root).render(
  <HanzoAI {...brand} host={tauriHost}
    features={{ chat:true, wallet:true, mining:true }} />)
```
Mobile = `apps/mobile` (Expo) with the same `<HanzoAI {...brand} host={expoHost} />`.
Build via Dockerfile from the pinned `@hanzo/app`, brand overlaid — like the exchanges.
