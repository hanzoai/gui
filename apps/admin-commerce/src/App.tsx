// App shell — wires the @hanzogui/admin chrome (AdminApp + Sidebar +
// TopBar) with commerce-specific config: nav items + brand + account.

import { useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import {
  AccountChip,
  AdminApp,
  EnvIndicator,
  HanzoMark,
  LocalTimeIndicator,
  type SettingItem,
  SettingsMenu,
  Sidebar,
  ThemeToggle,
  TopBar,
  VersionBadge,
  type SidebarConfig,
} from '@hanzogui/admin'
import { BookOpen } from '@hanzogui/lucide-icons-2/icons/BookOpen'
import { Boxes } from '@hanzogui/lucide-icons-2/icons/Boxes'
import { CreditCard } from '@hanzogui/lucide-icons-2/icons/CreditCard'
import { LayoutDashboard } from '@hanzogui/lucide-icons-2/icons/LayoutDashboard'
import { LogOut } from '@hanzogui/lucide-icons-2/icons/LogOut'
import { Package } from '@hanzogui/lucide-icons-2/icons/Package'
import { Receipt } from '@hanzogui/lucide-icons-2/icons/Receipt'
import { Settings } from '@hanzogui/lucide-icons-2/icons/Settings'
import { ShoppingBag } from '@hanzogui/lucide-icons-2/icons/ShoppingBag'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'

const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION ?? '1.38.0'
const APP_ENV = ((import.meta as any).env?.VITE_APP_ENV ?? 'local') as
  | 'prod'
  | 'staging'
  | 'dev'
  | 'local'

function buildSidebarConfig(): SidebarConfig {
  return {
    brand: {
      mark: <HanzoMark />,
      title: 'Hanzo Commerce',
      subtitle: 'Self-Hosted',
    },
    sections: [
      {
        items: [
          { to: '/overview', icon: LayoutDashboard, label: 'Overview', end: true },
          { to: '/products', icon: Package, label: 'Products' },
          { to: '/collections', icon: Boxes, label: 'Collections' },
          { to: '/orders', icon: ShoppingBag, label: 'Orders' },
          { to: '/customers', icon: Users, label: 'Customers' },
          { to: '/inventory', icon: Receipt, label: 'Inventory' },
          { to: '/billing', icon: CreditCard, label: 'Billing' },
        ],
      },
      {
        items: [
          { to: '/settings', icon: Settings, label: 'Settings' },
          { href: 'https://docs.hanzo.ai/commerce', icon: BookOpen, label: 'Docs' },
        ],
      },
    ],
    footer: {
      version: `v${APP_VERSION}`,
    },
  }
}

function CommerceTopBar() {
  const settingsItems: SettingItem[] = [
    {
      id: 'sign-out',
      label: 'Sign out',
      icon: LogOut,
      destructive: true,
      onSelect: () => {
        // Gateway-trust: sign-out lives at the gateway. Bouncing through
        // /v1/auth/logout clears the session cookie that hanzoai/gateway
        // uses to stamp the X-Org-Id / X-User-Id headers.
        window.location.href = '/v1/auth/logout'
      },
    },
  ]

  return (
    <TopBar
      right={
        <>
          <EnvIndicator label={APP_ENV} kind={APP_ENV} />
          <VersionBadge version={`v${APP_VERSION}`} title={`Hanzo Commerce ${APP_VERSION}`} />
          <LocalTimeIndicator />
          <SettingsMenu items={settingsItems} groupLabel="Commerce settings" />
          <ThemeToggle storageKey="commerce.theme" />
          <AccountChip
            initials="HZ"
            name="Hanzo"
            subtitle="commerce · embedded"
            identityHref="/healthz"
            onSignOut={() => {
              window.location.href = '/v1/auth/logout'
            }}
          />
        </>
      }
    />
  )
}

export default function App() {
  const sidebarConfig = useCallback(() => buildSidebarConfig(), [])
  return (
    <AdminApp sidebar={<Sidebar config={sidebarConfig()} />} topBar={<CommerceTopBar />}>
      <Outlet />
    </AdminApp>
  )
}
