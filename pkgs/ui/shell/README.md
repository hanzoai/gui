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
    <IamProvider
      config={{
        serverUrl: 'https://iam.hanzo.ai',
        clientId: 'my-app',
        redirectUri: `${window.location.origin}/auth/callback`,
      }}
    >
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

## A nav entry that holds links (8.1.14+)

A `localNav` entry (`HanzoNav`) with `items` opens them instead of navigating —
a card under the label on the desktop, the sheet's own disclosure on a phone.
It keeps its `href`, so the label is a real link before hydration and without
JavaScript, and the ⌘K palette indexes what it holds rather than the entry.

```tsx
localNav: [
  { id: 'solutions', label: 'Solutions', href: '/solutions' },
  {
    id: 'resources',
    label: 'Resources',
    href: '/learn',
    items: [
      { id: 'learn', label: 'Learn', href: '/learn', hint: 'Guides and documentation' },
      { id: 'blog', label: 'Blog', href: '/blog', hint: 'News and deep dives' },
    ],
  },
]
```

## The one header, and what each surface passes

`HanzoHeader` is the ONE public bar. It renders the chrome; a surface passes only
its own data. The brand trigger says **Hanzo** and opens the same mega-menu
everywhere — Flagship products · Platform · Install · Resources, projected from
`HANZO_PRODUCTS` in `hanzo-registry.ts`. That menu is identical on every surface
by construction; nothing about it is per-surface.

```tsx
<HanzoHeader
  surface="ai" // id · hostname · or a HanzoSurface object
  productsTaxonomy={HANZO_PRODUCT_CATEGORIES} // opt into the rich Products menu
  tryMenu // primary action opens the menu
  auth={{ user, onSignIn, onSignOut }} // the identity cluster
  commands={myPages} // what ⌘K should also find
/>
```

| Surface          | `surface`   | secondary nav (its data)                                        | primary pill      |
| ---------------- | ----------- | --------------------------------------------------------------- | ----------------- |
| hanzo.ai         | `"ai"`      | Models · Agents · Solutions · Developers · Pricing · Enterprise | **Try Hanzo**     |
| hanzo.app        | `"app"`     | Features · Templates · Pricing · Business                       | **+ New project** |
| docs.hanzo.ai    | `"docs"`    | API · CLI · MCP · SDKs                                          | **Get API key**   |
| console.hanzo.ai | `"console"` | Docs · API · Status                                             | none (signed in)  |

A surface that owns its nav passes a `HanzoSurface` object instead of an id. The
LABEL of the primary action is the surface's; its STYLE never varies — one white
pill, radius 999, `rgb(250,250,250)`, 34 tall, 13px/600, from `cta(true)`.

## Identity — one action, one provider

Hanzo IAM is the only identity provider, and this package never runs a session.
Pass the mapped user and your `@hanzo/iam` client's calls; the cluster renders
one sign-in action when signed out and the account menu when signed in. There is
no password field, no provider buttons and no email fallback here on purpose —
every method lives on the IAM login page, which is the only place that knows
which are enabled.

```tsx
const { user, startLogin, logout } = useIam()
<HanzoHeader surface="docs" auth={{ user, onSignIn: startLogin, onSignOut: logout }} />
```

## The visitor chat

One chat, two docks. `corner` mounts the small launcher in the bottom-right;
without it the same chat is a right-side drawer. Model defaults to `enso-free`.

```tsx
<AskHanzo corner authToken={bearer} />          // signed in — meters to the user
<AskHanzo corner auth={{ onSignIn }} />         // signed out — invites sign-in
<AskHanzo corner onSubmit={myTransport} />      // the host owns the transport
```

**There is no signed-out credential, by design.** A publishable key (`pk-`) is
read-only and refuses completions; a secret key (`sk-`) is spendable, so putting
one in shared chrome would ship a spendable secret to every page that mounts it.
Anonymous inference needs a SERVER holding the key — never the browser.

So with no `authToken` and no `onSubmit`, the card does not render a composer
that would be refused: it shows one sign-in action against the same provider as
the header. Give it `auth` (the `HanzoAuth` shape the header takes) and that
action runs the host's IAM login; omit it and the action links to hanzo.id.

## Org switching, and reaching past your own orgs

`UserOrgDropdown` is the ONE switcher (OrgHeader mounts it). Your own orgs render
immediately and switching them is unchanged. Supply `findOrgs` and it gains a
search field: the server filters, sorts and pages; the client only asks.

```tsx
<OrgHeader
  organizations={mine} // instant, no round trip
  onOrgSwitch={switchOrg}
  findOrgs={({ q, cursor }) => api.orgs({ q, cursor })}
  onMasquerade={startMasquerade} // only reachable for reach rows
  masquerade={actingAs} // renders the persistent sign
  onMasqueradeStop={stopMasquerade}
/>
```

A page the server marks `reach: true` lists orgs beyond the caller's
memberships — the SuperAdmin reach. The client never computes a privilege: no
reach page, no section, no way to ask for one. Switching your own org calls
`onOrgSwitch`; acting as someone else's calls `onMasquerade`, because they are
different acts. While one runs, `<Masquerade>` names the org in the bar with a
one-click exit, and it rides with the switcher — you get it by mounting.

`ORG_DOMAINS` maps each org to its branded domains — Hanzo / Lux / Zoo / Pars
baked in — and the signed-in chrome reads it for the account and billing links.

## Chrome is dark, everywhere

The bar, its menus, the launcher and the palette are one material: 60px of glass
(`rgba(9,9,11,0.72)` over `blur(20px) saturate(1.8)`, no hairline) with dark
menus hanging off it — on every surface, in every host theme. A menu attached to
the chrome wears `PANEL` and stays dark under a light theme; a menu inside the
page body is content and follows the theme. No ground here reads `--background`
or any other inverting token, which is what keeps that true. Get it by MOUNTING
the component; if you must build a chrome-attached menu we do not ship, spread
`PANEL` rather than matching a colour by hand.

## One app list

`HANZO_APPS` is the only app registry. `HanzoAppLauncher` renders it; `OrgHeader`
mounts that launcher; `OrgCommandPalette` derives its cross-app commands from
it. Pass `apps` to any of the three to override.

## Exports

- `HanzoHeader` — the ONE public header
- `HanzoIdentity`, `HanzoAuth` — the identity cluster (IAM, one action)
- `AskHanzo` — the visitor chat (`corner` for the bottom-right launcher)
- `Masquerade` — the sign that a masquerade is running, and its exit
- `OrgHeader`, `OrgHeaderProps`, `OrgSearch` — THE signed-in bar: launcher,
  breadcrumb, centre search, org switcher + user menu, `headerLeft` for the
  surface's own leading controls
- `HanzoAppLauncher` — the cross-app switcher
- `UserOrgDropdown`, `UserOrgDropdownProps` — the ONE org switcher
- `OrgQuery`, `OrgPage` — what the switcher asks the server, and its answer
- `OrgCommandPalette`, `OrgCommandItem` — ⌘K palette
- `HanzoMark`, `HanzoWordmark` — brand mark (`brandMenu` opts into the
  right-click brand menu)
- `BeamAvatar`, `UserAvatar` — avatars
- `HANZO_APPS`, `ORG_DOMAINS` — the app registry and the per-org domain map
- `HanzoApp`, `HanzoUser`, `HanzoOrg`, `OrgDomains` — types

## Peer dependencies

- `react`, `react-dom`
