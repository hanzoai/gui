# `@hanzogui/admin`

Composable admin shell, primitives, and data hooks for every Hanzo admin
surface. Pure Tamagui via the `hanzogui` umbrella. One way to build admin
UI across `tasks`, `kms`, `commerce`, `console`.

## Why this exists

Every Hanzo admin app needs the same chrome:

- a left sidebar with brand mark + nav groups + footer
- a top bar with namespace switcher + clock + theme + account chip
- list / detail / empty / dialog patterns over Tamagui primitives
- a tiny `useFetch` hook + SSE event subscription
- consistent timestamp formatting, retention TTL display, status badge colours

`@hanzo/tasks-ui` shipped these inline. As we add `kms`, `commerce`,
`console`, etc., copy-pasting that chrome would violate the zen of Hanzo
("one and only one way to do everything"). This package factors the
shared surface into one place. Each admin app then owns only its routes
+ page-specific composition.

## Surface map

### `@hanzogui/admin/shell` — chrome

| Export                   | Role                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- |
| `AdminApp`               | Outer layout — sidebar + top bar + scrolling content slot                       |
| `Sidebar`                | Data-driven left chrome (brand row, nav groups, footer)                         |
| `TopBar`                 | Right chrome with `left` + `right` slots                                        |
| `NamespaceSwitcher`      | Generic `{ id, label }[]` dropdown for tenant scoping                           |
| `LocalTimeIndicator`     | UTC / local toggle popover                                                      |
| `ThemeToggle`            | Dark / light toggle, persists in localStorage                                   |
| `AccountChip`            | Round initials button with identity / sign-out popover                          |
| `PageShell`              | 1280-wide centred padded column for non-edge-to-edge routes                     |

### `@hanzogui/admin/primitives` — small UI atoms

| Export                                       | Role                                                  |
| -------------------------------------------- | ----------------------------------------------------- |
| `Badge` (+ `StatusVariant` from `data`)      | Status pill — success / destructive / warning / muted |
| `Empty` / `ErrorState` / `Loading` / `LoadingState` | List page placeholders                          |
| `Alert`                                      | Inline notice block — default / destructive variants  |
| `CopyField`                                  | One-click copy chip for endpoints / IDs               |
| `BrandMark` / `HanzoMark`                    | 28×28 brand chip slot + the canonical Hanzo H mark    |
| `SummaryCard`                                | Stat card for detail pages (count + label + accent)   |

### `@hanzogui/admin/data` — transport-agnostic data layer

| Export                       | Role                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| `useFetch<T>(url)`           | Tiny SWR-shaped hook — `{ data, error, isLoading, mutate }` |
| `useEvents<T>(opts)`         | SSE subscription with kind filter + namespace predicate     |
| `apiPost` / `apiDelete`      | JSON POST / DELETE that throw `ApiError` on non-2xx         |
| `formatTimestamp`            | UTC / local-aware Date formatter (in `data/format`)         |
| `humanTTL`                   | "720h" → "30 days" (in `data/format`)                       |
| `badgeColors`                | Status variant → `{ bg, fg }` token pair (in `data/format`) |
| `getTz` / `setTz` / `TZ_KEY` | Read / write the user's tz preference (in `data/tz`)        |

There is no `patterns/` layer. Lists across our admin surfaces differ
in shape — Workflows has a filter band, Namespaces has Active +
retention badges, TaskQueues has running counts — so a single
`<ListPage>` would always have to widen to fit the next consumer. We
therefore reify nothing; pages compose primitives directly. The unit
of reuse is the primitive (Badge, Empty, SummaryCard, Alert), not the
page.

## Consumption — 5-line example

```tsx
// commerce-ui/src/App.tsx
import { Outlet, useParams } from 'react-router-dom'
import { AdminApp, Sidebar, TopBar, NamespaceSwitcher, HanzoMark } from '@hanzogui/admin'
import { Box, Receipt, Users } from '@hanzogui/lucide-icons-2'

const sidebar = {
  brand: { mark: <HanzoMark />, title: 'Hanzo Commerce', subtitle: 'Self-Hosted' },
  sections: [{ items: [
    { to: '/products', icon: Box, label: 'Products', end: true },
    { to: '/orders', icon: Receipt, label: 'Orders' },
    { to: '/customers', icon: Users, label: 'Customers' },
  ] }],
  footer: { version: 'v1.0.0' },
}

export default function App() {
  const { org } = useParams()
  return (
    <AdminApp
      sidebar={<Sidebar config={sidebar} />}
      topBar={<TopBar themeStorageKey="commerce.theme" left={<NamespaceSwitcher active={org} options={orgs} hrefFor={(id) => `/${id}/products`} />} />}
    >
      <Outlet />
    </AdminApp>
  )
}
```

## Conventions

- Everything ships as TypeScript source. Vite parses it directly. No
  `hanzogui-build` step required because we don't publish prebuilt
  artifacts — each consuming app's bundler handles it.
- Peer dependencies: `hanzogui`, `@hanzogui/lucide-icons-2`, `react`,
  `react-router-dom`. The consumer pins the versions; this package
  doesn't.
- No HTML / CSS DOM primitives. Tamagui only.
- Strict TypeScript. `noUnusedLocals` / `noUnusedParameters` on.
- Same colour palette across surfaces — variants come from
  `badgeColors()` in `data/format.ts`. Do not invent new colour tokens
  at the page level; extend the variant enum here instead.

## When NOT to use this

- For non-admin marketing pages (`hanzo.ai`, `lux.network`) — they have
  their own design system in `gui.hanzo.ai` etc.
- For edge-to-edge layouts (e.g. tasks `Workflows` page with its own
  filter band). Skip `PageShell` and lay out the page directly with
  `XStack` / `YStack` + the primitives.

## Tests

```bash
cd code/ui-admin
bun run typecheck
bun run test
```

`vitest` runs in jsdom against `test/*.test.ts`. We cover the parts
where consumers can't easily verify correctness themselves:
`humanTTL` parsing, `formatTimestamp` UTC + local shape, `useFetch`
generation-counter cancellation + `ApiError` surfacing, and `getTz` /
`setTz` round-trip via `localStorage`.

## Changelog

### 0.2.0

- Removed the `patterns/` layer (`<ListPage>`, `<DetailPage>`). Lists
  are not the unit of reuse; primitives are.
- Split `getTz` / `setTz` out of `data/format` into `data/tz`. The
  shared `TZ_KEY` constant is now exported.
- Consumers must import `SummaryCard` from `@hanzogui/admin` — no
  more inline copies.
- Added vitest harness and 6 unit tests.
