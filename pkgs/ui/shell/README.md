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
