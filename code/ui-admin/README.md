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

| Export                  | Role                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `useFetch<T>(url)`      | Tiny SWR-shaped hook — `{ data, error, isLoading, mutate }` |
| `useEvents<T>(opts)`    | SSE subscription with kind filter + namespace predicate     |
| `apiPost` / `apiDelete` | JSON POST / DELETE that throw `ApiError` on non-2xx         |
| `formatTimestamp`       | UTC / local-aware Date formatter                            |
| `humanTTL`              | "720h" → "30 days"                                          |
| `badgeColors`           | Status variant → `{ bg, fg }` token pair                    |
| `getTz` / `setTz`       | Read / write the user's tz preference                       |

### `@hanzogui/admin/patterns` — high-level pages

| Export       | Role                                                                |
| ------------ | ------------------------------------------------------------------- |
| `ListPage`   | Title + count + body. Auto-resolves loading / error / empty branches |
| `DetailPage` | Back link + eyebrow + title + summary cards + body                  |

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
  filter band). Skip `PageShell` and `ListPage`, use the primitives
  directly. Don't fight the abstraction.
