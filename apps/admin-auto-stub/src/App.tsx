// admin-auto-stub — reference consumer for @hanzogui/admin.
//
// Three primitives, one wiring file. The shape is identical for any
// hanzoai/base-backed admin surface:
//   <BaseClientProvider> wraps the typed Base API client
//   <AuthGate>           guards the routes via Hanzo IAM OIDC
//   <AdminApp>           renders the sidebar + top-bar chrome
//   <CollectionCRUD>     schema-driven list/view/create for one collection
//
// In ~40 LOC the entire admin surface for any Base-backed app becomes
// a working SPA. Adding more collections is one route per name.
//
// Dev target is base.hanzo.ai (canonical Base API). Override via
// VITE_API_PREFIX + the dev proxy in vite.config.ts to point at any
// other hanzoai/base instance (auto, commerce, your-org-base, …).

import { useMemo } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { IAM } from '@hanzo/iam/browser'
import {
  AccountChip,
  AdminApp,
  AuthGate,
  BaseClientProvider,
  CollectionCRUD,
  HanzoMark,
  LocalTimeIndicator,
  PageShell,
  Sidebar,
  ThemeToggle,
  TopBar,
  createBaseClient,
  useAuth,
  type SidebarConfig,
} from '@hanzogui/admin'
import { Workflow } from '@hanzogui/lucide-icons-2/icons/Workflow'

const origin = typeof window !== 'undefined' ? window.location.origin : 'https://auto.hanzo.ai'

// One IAM client. Stable across renders so the gate's effect runs once.
const iam = new IAM({
  serverUrl: `${origin}/v1/iam`,
  clientId: 'hanzo-base',
  appName: 'hanzo-base',
  orgName: 'hanzo',
  redirectUri: `${origin}/callback`,
})

// One Base client pointed at /v1 (canonical Base mount). The dev
// proxy in vite.config.ts forwards /v1/* to base.hanzo.ai. To target
// a different Base instance (auto, commerce, your-org-base, …),
// change VITE_API_PREFIX and the proxy target.
const baseClient = createBaseClient({
  apiPrefix: '/v1',
  getToken: () => (iam as unknown as { getAccessToken?: () => string }).getAccessToken?.() ?? '',
})

const sidebar: SidebarConfig = {
  brand: { mark: <HanzoMark />, title: 'Hanzo Base', subtitle: 'Stub' },
  sections: [
    { items: [{ to: '/superusers', icon: Workflow, label: 'Superusers', end: true }] },
  ],
  footer: { version: 'admin-stub v0.1.0' },
}

function Chrome() {
  const { user, signOut } = useAuth()
  const email = user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase() || 'AU'
  return (
    <AdminApp
      sidebar={<Sidebar config={sidebar} />}
      topBar={
        <TopBar
          right={
            <>
              <LocalTimeIndicator />
              <ThemeToggle storageKey="auto-stub.theme" />
              <AccountChip
                initials={initials}
                name={email || 'Anonymous'}
                subtitle="hanzo-auto"
                onSignOut={signOut}
              />
            </>
          }
        />
      }
    >
      <Outlet />
    </AdminApp>
  )
}

export default function App() {
  const stableIam = useMemo(() => iam, [])
  return (
    <BrowserRouter>
      <AuthGate iam={stableIam} appTitle="Hanzo Base" defaultLandingPath="/superusers">
        <BaseClientProvider client={baseClient}>
          <Routes>
            <Route element={<Chrome />}>
              <Route path="/" element={<Navigate to="/superusers" replace />} />
              <Route
                path="/superusers"
                element={
                  <PageShell>
                    <CollectionCRUD collection="_superusers" title="Superusers" />
                  </PageShell>
                }
              />
            </Route>
          </Routes>
        </BaseClientProvider>
      </AuthGate>
    </BrowserRouter>
  )
}
