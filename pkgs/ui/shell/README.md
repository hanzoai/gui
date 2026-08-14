# @hanzogui/shell

The navigation shell for Hanzo-stack apps — one public header, one signed-in
header, one cross-app switcher.

Canonical, single source of truth for the shared chrome (`HanzoHeader`,
`OrgHeader`, `HanzoAppLauncher`, `UserOrgDropdown`, `OrgCommandPalette`,
`HanzoMark`, `BeamAvatar`, `UserAvatar`) across billing, console, chat and
platform.

Auth comes from `@hanzo/iam/react` (the canonical IAM client) — never a second
session scheme here.

## Usage

```tsx
import { IamProvider, useIam, useOrganizations } from '@hanzo/iam/react'
import { OrgHeader } from '@hanzogui/shell'

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
  const { user, logout } = useIam()
  const { organizations, currentOrg, switchOrg } = useOrganizations()
  return (
    <OrgHeader
      currentApp="MyApp"
      currentAppId="myapp"
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

`ORG_DOMAINS` maps each org to its branded domains — Hanzo / Lux / Zoo / Pars
baked in — and the signed-in chrome reads it for the account and billing links.

## One app list

`HANZO_APPS` is the only app registry. `HanzoAppLauncher` renders it; `OrgHeader`
mounts that launcher; `OrgCommandPalette` derives its cross-app commands from
it. Pass `apps` to any of the three to override.

## Exports

- `HanzoHeader` — public/marketing header
- `OrgHeader`, `OrgHeaderProps`, `OrgSearch` — THE signed-in bar: launcher,
  breadcrumb, centre search, org switcher + user menu
- `HanzoAppLauncher` — the cross-app switcher
- `UserOrgDropdown` — user/org dropdown
- `OrgCommandPalette`, `OrgCommandItem` — ⌘K palette
- `HanzoMark`, `HanzoWordmark` — brand mark (`brandMenu` opts into the
  right-click brand menu)
- `BeamAvatar`, `UserAvatar` — avatars
- `HANZO_APPS`, `ORG_DOMAINS` — the app registry and the per-org domain map
- `HanzoApp`, `HanzoUser`, `HanzoOrg`, `OrgDomains` — types

## Peer dependencies

- `react`, `react-dom`
