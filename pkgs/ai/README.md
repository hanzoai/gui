<p align="center">
  <img src=".github/hero.svg" alt="@hanzo/ai" width="100%" />
</p>

# @hanzo/ai

The AI app as one declarative, brand-neutral component. Render the full
chat / agents / tools / settings experience for **web, desktop (Tauri), or
mobile (Expo)** from a single surface — the brand is a prop, the platform is an
injected host.

```tsx
import AI from '@hanzo/ai/desktop';   // or '@hanzo/ai' for web
import '@hanzo/ai/ai.css';
import { brandConfig } from './brand.config';

createRoot(document.querySelector('#root')!).render(
  <AI {...brandConfig} features={{ chat: true, tools: true, agents: true }} />,
);
```

There are no brands compiled in. Each consumer supplies its own `BrandConfig`;
the same build renders Hanzo, Lux, Zoo, or any white-label brand.

## Entry points

| Import | For | Bundles |
|---|---|---|
| `@hanzo/ai` | web | everything except React |
| `@hanzo/ai/desktop` | Tauri desktop | everything except React + `@tauri-apps/*` (host is injected) |
| `@hanzo/ai/ai.css` | styles | — |

## Brand configuration

`BrandConfig` is the single source of brand identity — name, logo, colors,
hosts, store URLs, on-device node ports, inference endpoint, and IAM (OAuth)
settings. Pass it as props to `<AI>`; read it anywhere via the getters.

```ts
import { getBrand, useBrand, setBrand, registerBrands, getBrandFromHostname } from '@hanzo/ai';

getBrand();                       // active brand (injected, else env/hostname, else throws)
useBrand();                       // same value — a plain getter, callable outside React too
registerBrands([hanzo, lux, zoo]); // web multi-tenant: resolve brand by hostname
getBrandFromHostname(location.hostname);
```

`<AI>` injects the brand via `setBrand` before mount, so every descendant —
i18n `{{appName}}` interpolation, engine/identity labels, node ports — resolves
to the active brand at runtime. No brand string is hardcoded in the tree.

## Host adapter

The desktop/mobile host (Tauri / Expo) is injected, not imported, so the same
component runs on any platform:

```tsx
<AI {...brandConfig} host={{ invoke, listen, platform: 'tauri' }} />
```

## Feature flags

```ts
features?: { chat, wallet, mining, tools, agents, vectorFs, machines }
```

`machines` (containers / k8s / VMs) is config-driven via
`BrandConfig.machinesEnabled` / `isMachinesEnabled(cfg)`.

## Public API

`AI` (default), `BrandProvider`, `useBrand`, `getBrand`, `getBrandFromHostname`,
`setBrand`, `registerBrands`, `isMachinesEnabled`, and the `BrandConfig` /
`AIProps` types. See `types/public.d.ts` for the full surface.
