# @hanzogui/shell

Multi-tenant navigation shell for Hanzo-stack apps.

Canonical, single source of truth for the cross-app shell (`TenantHeader`,
`AppSwitcher`, `UserOrgDropdown`, `TenantCommandPalette`, `TenantMark`,
`BeamAvatar`, `UserAvatar`) shared across billing, console, chat, platform,
and downstream-tenant apps.

Auth comes from `@hanzo/iam-ui/hooks/useIAMAuth` (the canonical IAM client
hook) — do not duplicate this hook per-app.

```tsx
import {
  TenantHeader,
  AppSwitcher,
  DEFAULT_TENANT_APPS,
  ORG_DOMAINS,
  getAppsForOrg,
} from '@hanzogui/shell'
import { useIAMAuth } from '@hanzo/iam-ui/hooks/useIAMAuth'

export function MyApp() {
  const { user, organizations, currentOrgId, signOut, switchOrg } = useIAMAuth()
  return (
    <TenantHeader
      currentApp="MyApp"
      user={user}
      organizations={organizations}
      currentOrgId={currentOrgId}
      onOrgSwitch={switchOrg}
      onSignOut={signOut}
    />
  )
}
```

## Org switching

`ORG_DOMAINS` provides per-org branded domains; `getAppsForOrg(slug)` returns
the right per-org app URL list. Hanzo / Lux / Zoo / Pars baked in; extend
via `apps={[...getAppsForOrg(slug), ...customApps]}`.

## Exports

- `TenantHeader`, `TenantHeaderProps` — top header with org switcher + user menu
- `AppSwitcher` — cross-app launcher
- `UserOrgDropdown` — user/org dropdown
- `TenantCommandPalette` — ⌘K palette
- `TenantMark` — brand mark
- `BeamAvatar`, `UserAvatar` — avatars
- `useTenantAuth` — **deprecated**, use `useIAMAuth` from `@hanzo/iam-ui` directly
- `DEFAULT_TENANT_APPS`, `ORG_DOMAINS`, `getAppsForOrg(slug)` — app registry
- `TenantApp`, `TenantOrg` (re-exported as `IAMOrg`), `TenantUser` (re-exported as `IAMUser`), `TenantShellProps`, `TenantMarkProps`, `TenantCommandPaletteProps`, `OrgDomains` — types
