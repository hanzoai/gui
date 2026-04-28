// App shell — wires the @hanzogui/admin chrome (AdminApp + Sidebar +
// TopBar) with agents-specific config. Operator chrome only — the
// product UI (workflow viz, react-flow editor) keeps mounting at '/'.

import { useCallback } from 'react'
import { Outlet, useParams } from 'react-router-dom'
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
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { BookOpen } from '@hanzogui/lucide-icons-2/icons/BookOpen'
import { CreditCard } from '@hanzogui/lucide-icons-2/icons/CreditCard'
import { Heart } from '@hanzogui/lucide-icons-2/icons/Heart'
import { Key } from '@hanzogui/lucide-icons-2/icons/Key'
import { LogOut } from '@hanzogui/lucide-icons-2/icons/LogOut'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'
import { Building } from '@hanzogui/lucide-icons-2/icons/Building'

const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION ?? '0.1.0'
const APP_ENV = ((import.meta as any).env?.VITE_APP_ENV ?? 'local') as
  | 'prod'
  | 'staging'
  | 'dev'
  | 'local'

function buildSidebarConfig(orgSlug?: string): SidebarConfig {
  const orgRoot = orgSlug ? `/orgs/${encodeURIComponent(orgSlug)}` : ''
  return {
    brand: {
      mark: <HanzoMark />,
      title: 'Hanzo Agents',
      subtitle: 'Admin',
    },
    sections: [
      {
        items: [
          { to: '/orgs', icon: Building, label: 'Organizations', end: true },
          {
            to: orgRoot ? `${orgRoot}/members` : '/orgs',
            icon: Users,
            label: 'Members',
            disabled: !orgSlug,
          },
          {
            to: orgRoot ? `${orgRoot}/api-keys` : '/orgs',
            icon: Key,
            label: 'API Keys',
            disabled: !orgSlug,
          },
          {
            to: orgRoot ? `${orgRoot}/billing` : '/orgs',
            icon: CreditCard,
            label: 'Billing',
            disabled: !orgSlug,
          },
          { to: '/observability', icon: Activity, label: 'Observability' },
        ],
      },
      {
        items: [
          { href: 'https://docs.hanzo.ai/agents', icon: BookOpen, label: 'Docs' },
          { href: 'https://hanzo.ai', icon: Network, label: 'Hanzo' },
        ],
      },
    ],
    footer: {
      feedback: {
        href: 'https://github.com/hanzoai/agent/issues/new',
        label: 'Feedback',
        icon: Heart,
      },
      version: `v${APP_VERSION}`,
    },
  }
}

function AgentsTopBar() {
  const settingsItems: SettingItem[] = [
    {
      id: 'sign-out',
      label: 'Sign out',
      icon: LogOut,
      destructive: true,
      onSelect: () => alert('Sign out is wired through hanzoai/gateway IAM session.'),
    },
  ]

  return (
    <TopBar
      right={
        <>
          <EnvIndicator label={APP_ENV} kind={APP_ENV} />
          <VersionBadge version={`v${APP_VERSION}`} title={`Hanzo Agents ${APP_VERSION}`} />
          <LocalTimeIndicator />
          <SettingsMenu items={settingsItems} groupLabel="Agents settings" />
          <ThemeToggle storageKey="agents.theme" />
          <AccountChip
            initials="HZ"
            name="Hanzo"
            subtitle="agents"
            identityHref="/v1/agents/health"
            onSignOut={() => alert('Sign out is wired through hanzoai/gateway IAM session.')}
          />
        </>
      }
    />
  )
}

export default function App() {
  const { org } = useParams()
  const sidebarConfig = useCallback(() => buildSidebarConfig(org), [org])
  return (
    <AdminApp sidebar={<Sidebar config={sidebarConfig()} />} topBar={<AgentsTopBar />}>
      <Outlet />
    </AdminApp>
  )
}
