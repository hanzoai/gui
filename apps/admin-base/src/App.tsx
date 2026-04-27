// App shell — wires the @hanzogui/admin chrome (AdminApp + Sidebar +
// TopBar) with base-specific config: nav items, brand mark, account
// chip backed by the local auth store.
//
// The route tree lives in main.tsx so this file only owns config.

import { Outlet } from 'react-router-dom'
import {
  AccountChip,
  AdminApp,
  HanzoMark,
  LocalTimeIndicator,
  Sidebar,
  ThemeToggle,
  TopBar,
  type SidebarConfig,
} from '@hanzogui/admin'
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { BookOpen } from '@hanzogui/lucide-icons-2/icons/BookOpen'
import { Database } from '@hanzogui/lucide-icons-2/icons/Database'
import { Heart } from '@hanzogui/lucide-icons-2/icons/Heart'
import { Settings as SettingsIcon } from '@hanzogui/lucide-icons-2/icons/Settings'
import { useAuth } from './hooks/useAuth'

const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION ?? '0.4.0'

function buildSidebarConfig(): SidebarConfig {
  return {
    brand: {
      mark: <HanzoMark />,
      title: 'Hanzo Base',
      subtitle: 'Self-Hosted',
    },
    sections: [
      {
        items: [
          { to: '/collections', icon: Database, label: 'Collections' },
          { to: '/logs', icon: Activity, label: 'Logs' },
          { to: '/settings', icon: SettingsIcon, label: 'Settings' },
        ],
      },
      {
        items: [
          { href: 'https://docs.hanzo.ai/base', icon: BookOpen, label: 'Docs' },
        ],
      },
    ],
    footer: {
      feedback: {
        href: 'https://github.com/hanzoai/base/issues/new',
        label: 'Feedback',
        icon: Heart,
      },
      version: `v${APP_VERSION}`,
    },
  }
}

function BaseTopBar() {
  const { record, signOut } = useAuth()
  const email = (record?.email as string) ?? ''
  const initials = email.slice(0, 2).toUpperCase() || 'BA'
  return (
    <TopBar
      right={
        <>
          <LocalTimeIndicator />
          <ThemeToggle storageKey="base.theme" />
          <AccountChip
            initials={initials}
            name={email || 'Superuser'}
            subtitle="local · embedded"
            onSignOut={signOut}
          />
        </>
      }
    />
  )
}

export default function App() {
  return (
    <AdminApp sidebar={<Sidebar config={buildSidebarConfig()} />} topBar={<BaseTopBar />}>
      <Outlet />
    </AdminApp>
  )
}
