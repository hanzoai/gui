# @hanzogui/shell

Multi-tenant navigation shell for Hanzo-stack apps.

Canonical, single source of truth for the cross-app shell (`TenantHeader`,
`AppSwitcher`, `UserOrgDropdown`, `TenantCommandPalette`, `TenantMark`,
`BeamAvatar`, `UserAvatar`) shared across billing, console, chat, platform,
and downstream-tenant apps.

Auth comes from `@hanzo/iam/react` (the canonical IAM client) — do not
duplicate this hook per-app.

## Usage

```tsx
import { IamProvider, useIam, useOrganizations } from '@hanzo/iam/react'
import { TenantHeader, AppSwitcher, getAppsForOrg } from '@hanzogui/shell'

export function App() {
  return (
    <IamProvider config={{
      serverUrl: 'https://iam.hanzo.ai',
      clientId: 'my-app',
      redirectUri: `${window.location.origin}/auth/callback`,
    }}>
      <Shell />
    </IamProvider>
  )
}

function Shell() {
  const { user, isAuthenticated, login, logout } = useIam()
  const { organizations, currentOrg, switchOrg } = useOrganizations()
  return (
    <TenantHeader
      currentApp="MyApp"
      user={user ?? undefined}
      organizations={organizations}
      currentOrgId={currentOrg?.id}
      onOrgSwitch={switchOrg}
      onSignOut={logout}
    />
  )
}
```

## Public header — rich Products mega-menu (7.5.0+)

`HanzoHeader` is the ONE public/marketing header. By default it renders a flat
`localNav` + the universal "Meet Hanzo" menu. Pass `productsTaxonomy` to opt into
the RICH ten-category cloud Products mega-menu (the flagship hanzo.ai UX) — a
"Products ⌄" trigger appears next to "Meet Hanzo" and opens `<ProductsMegaMenu>`.
Omit it and the header behaves exactly as before (fully backward compatible).

```tsx
import { HanzoHeader, HANZO_PRODUCT_CATEGORIES } from '@hanzogui/shell'

// Shared default taxonomy:
<HanzoHeader surface="ai" productsTaxonomy={HANZO_PRODUCT_CATEGORIES} />

// A surface that owns the taxonomy locally passes its own (mapped to
// ProductCategory[]) so its /products/<slug> pages + routes never drift, and
// supplies its own wordmark + identity control via the slots:
<HanzoHeader
  surface="ai"
  productsTaxonomy={myCategories}     // ProductCategory[]
  currentCategoryId="ai"              // highlight the current category header
  currentHref="/models"              // highlight the current leaf
  brandSlot={<MyAnimatedWordmark />}  // replaces the default mark + name
  identitySlot={<MyAccountMenu />}    // far-right identity control
/>
```

`ProductsMegaMenu` is also exported standalone (controlled `open`/`onClose`/
`anchor`, keyboard-accessible). `HANZO_PRODUCT_CATEGORIES` (+ `productCategorySlug`)
is the shared default taxonomy; `ProductCategory` is the taxonomy type.

## Org switching

`ORG_DOMAINS` provides per-org branded domains; `getAppsForOrg(slug)` returns
the right per-org app URL list. Hanzo / Lux / Zoo / Pars baked in; extend
via `apps={[...getAppsForOrg(slug), ...customApps]}`.

## Exports

- `TenantHeader`, `TenantShellProps` — top header with org switcher + user menu
- `AppSwitcher` — cross-app launcher
- `UserOrgDropdown` — user/org dropdown
- `TenantCommandPalette` — ⌘K palette
- `TenantMark`, `TenantMarkProps` — brand mark
- `BeamAvatar`, `UserAvatar` — avatars
- `useTenantAuth` — **deprecated**, use `useIam` from `@hanzo/iam/react` directly
- `DEFAULT_TENANT_APPS`, `ORG_DOMAINS`, `getAppsForOrg(slug)` — app registry
- `TenantApp`, `TenantOrg` (re-exported as `IamOrganization`), `TenantUser` (re-exported as `IamUser`), `OrgDomains` — types

## Peer dependencies

- `@hanzo/iam ^0.10.0` — for the auth hook + types
- `react`, `react-dom`
