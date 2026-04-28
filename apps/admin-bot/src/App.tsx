// App shell — wires the @hanzogui/admin chrome (AdminApp + Sidebar +
// TopBar) with bot-specific config: the nav items, brand mark, and
// a Settings menu.
//
// The route tree lives in main.tsx so this file only owns config.

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
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { BookOpen } from '@hanzogui/lucide-icons-2/icons/BookOpen'
import { Bot } from '@hanzogui/lucide-icons-2/icons/Bot'
import { Boxes } from '@hanzogui/lucide-icons-2/icons/Boxes'
import { Bug } from '@hanzogui/lucide-icons-2/icons/Bug'
import { Code } from '@hanzogui/lucide-icons-2/icons/Code'
import { Heart } from '@hanzogui/lucide-icons-2/icons/Heart'
import { LayoutDashboard } from '@hanzogui/lucide-icons-2/icons/LayoutDashboard'
import { LogOut } from '@hanzogui/lucide-icons-2/icons/LogOut'
import { MessageSquare } from '@hanzogui/lucide-icons-2/icons/MessageSquare'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Plug } from '@hanzogui/lucide-icons-2/icons/Plug'
import { ScrollText } from '@hanzogui/lucide-icons-2/icons/ScrollText'
import { Settings } from '@hanzogui/lucide-icons-2/icons/Settings'
import { Sparkles } from '@hanzogui/lucide-icons-2/icons/Sparkles'
import { Timer } from '@hanzogui/lucide-icons-2/icons/Timer'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'

const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION ?? '0.1.0'
const APP_ENV = ((import.meta as any).env?.VITE_APP_ENV ?? 'local') as
  | 'prod'
  | 'staging'
  | 'dev'
  | 'local'

function buildSidebarConfig(): SidebarConfig {
  return {
    brand: {
      mark: <HanzoMark />,
      title: 'Hanzo Bot',
      subtitle: 'Self-Hosted',
    },
    sections: [
      {
        items: [
          { to: '/chat', icon: MessageSquare, label: 'Chat' },
        ],
      },
      {
        items: [
          { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
          { to: '/channels', icon: Plug, label: 'Channels' },
          { to: '/instances', icon: Boxes, label: 'Instances' },
          { to: '/sessions', icon: Users, label: 'Sessions' },
          { to: '/usage', icon: Activity, label: 'Usage' },
          { to: '/cron', icon: Timer, label: 'Cron' },
        ],
      },
      {
        items: [
          { to: '/agents', icon: Bot, label: 'Agents' },
          { to: '/skills', icon: Sparkles, label: 'Skills' },
          { to: '/nodes', icon: Network, label: 'Nodes' },
        ],
      },
      {
        items: [
          { to: '/config', icon: Settings, label: 'Config' },
          { to: '/debug', icon: Bug, label: 'Debug' },
          { to: '/logs', icon: ScrollText, label: 'Logs' },
          { href: 'https://docs.hanzo.ai/bot', icon: BookOpen, label: 'Docs' },
        ],
      },
    ],
    footer: {
      feedback: {
        href: 'https://github.com/hanzoai/bot/issues/new',
        label: 'Feedback',
        icon: Heart,
      },
      version: `v${APP_VERSION}`,
    },
  }
}

function BotTopBar() {
  // Settings menu items — developer mode, sign out. Each is a callback
  // because the live wiring (IAM session, dev-mode toggle) is owned
  // by the page or hanzoai/gateway, not the chrome.
  const settingsItems: SettingItem[] = [
    {
      id: 'developer-mode',
      label: 'Developer mode',
      subtitle: 'Show internal IDs',
      icon: Code,
      onSelect: () => alert('Developer mode toggle is wired in bot/settings/developer.'),
    },
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
          <VersionBadge version={`v${APP_VERSION}`} title={`Hanzo Bot ${APP_VERSION}`} />
          <LocalTimeIndicator />
          <SettingsMenu items={settingsItems} groupLabel="Bot settings" />
          <ThemeToggle storageKey="bot.theme" />
          <AccountChip
            initials="HZ"
            name="Hanzo"
            subtitle="local · embedded"
            identityHref="/v1/bot/health"
            onSignOut={() => alert('Sign out is wired through hanzoai/gateway IAM session.')}
          />
        </>
      }
    />
  )
}

export default function App() {
  const sidebarConfig = useCallback(() => buildSidebarConfig(), [])
  return (
    <AdminApp sidebar={<Sidebar config={sidebarConfig()} />} topBar={<BotTopBar />}>
      <Outlet />
    </AdminApp>
  )
}
