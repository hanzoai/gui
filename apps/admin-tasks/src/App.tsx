// App shell — wires the @hanzogui/admin chrome (AdminApp + Sidebar +
// TopBar) with tasks-specific config: the nav items, the brand mark,
// and the namespace switcher backed by /v1/tasks/namespaces.
//
// The route tree lives in main.tsx so this file only owns config.

import { useCallback, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import {
  AccountChip,
  AdminApp,
  EnvIndicator,
  HanzoMark,
  LocalTimeIndicator,
  NamespaceSwitcher,
  type SettingItem,
  SettingsMenu,
  Sidebar,
  ThemeToggle,
  TopBar,
  VersionBadge,
  useFetch,
  type SidebarConfig,
} from '@hanzogui/admin'
import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { Archive } from '@hanzogui/lucide-icons-2/icons/Archive'
import { BookOpen } from '@hanzogui/lucide-icons-2/icons/BookOpen'
import { Code } from '@hanzogui/lucide-icons-2/icons/Code'
import { FileJson } from '@hanzogui/lucide-icons-2/icons/FileJson'
import { Heart } from '@hanzogui/lucide-icons-2/icons/Heart'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { ListChecks } from '@hanzogui/lucide-icons-2/icons/ListChecks'
import { LogOut } from '@hanzogui/lucide-icons-2/icons/LogOut'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Rocket } from '@hanzogui/lucide-icons-2/icons/Rocket'
import { Server } from '@hanzogui/lucide-icons-2/icons/Server'
import { Timer } from '@hanzogui/lucide-icons-2/icons/Timer'
import { Upload } from '@hanzogui/lucide-icons-2/icons/Upload'
import { Users } from '@hanzogui/lucide-icons-2/icons/Users'
import { Workflow } from '@hanzogui/lucide-icons-2/icons/Workflow'
import { Zap } from '@hanzogui/lucide-icons-2/icons/Zap'
import type { Namespace } from './lib/api'

const APP_VERSION = (import.meta as any).env?.VITE_APP_VERSION ?? '2.45.3'
const APP_ENV = ((import.meta as any).env?.VITE_APP_ENV ?? 'local') as
  | 'prod'
  | 'staging'
  | 'dev'
  | 'local'
const RECENTS_KEY = 'tasks.recent-namespaces'

// LRU of last-visited namespaces. Keep recents ≤5 (chip cap inside
// NamespaceSwitcher), persist via localStorage so reloads remember the
// user's recent activity. SSR-safe: guard `localStorage` access.
function useRecentNamespaces(active?: string): string[] {
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    if (!active) return
    setRecents((prev) => {
      const next = [active, ...prev.filter((id) => id !== active)].slice(0, 5)
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
        } catch {
          // ignore quota / disabled storage
        }
      }
      return next
    })
  }, [active])
  return recents
}

function buildSidebarConfig(ns?: string): SidebarConfig {
  const ent = ns ? `/namespaces/${encodeURIComponent(ns)}` : ''
  return {
    brand: {
      mark: <HanzoMark />,
      title: 'Hanzo Tasks',
      subtitle: 'Self-Hosted',
    },
    sections: [
      {
        items: [
          { to: '/namespaces', icon: Layers, label: 'Namespaces', end: true },
          { to: ent ? `${ent}/workflows` : '/namespaces', icon: Workflow, label: 'Workflows', disabled: !ns },
          { to: ent ? `${ent}/schedules` : '/namespaces', icon: Timer, label: 'Schedules', disabled: !ns },
          { to: ent ? `${ent}/batches` : '/namespaces', icon: Activity, label: 'Batch', disabled: !ns },
          { to: ent ? `${ent}/deployments` : '/namespaces', icon: Rocket, label: 'Deployments', disabled: !ns },
          { to: ent ? `${ent}/task-queues` : '/namespaces', icon: ListChecks, label: 'Task Queues', disabled: !ns },
          { to: ent ? `${ent}/activities` : '/namespaces', icon: Zap, label: 'Activities', disabled: !ns },
          { to: ent ? `${ent}/workers` : '/namespaces', icon: Users, label: 'Workers', disabled: !ns },
          { to: ent ? `${ent}/nexus` : '/namespaces', icon: Network, label: 'Nexus', disabled: !ns },
        ],
      },
      {
        items: [
          { to: '/archive', icon: Archive, label: 'Archive' },
          { to: '/import', icon: Upload, label: 'Import', disabled: true },
          { href: 'https://docs.hanzo.ai/tasks', icon: BookOpen, label: 'Docs' },
        ],
      },
    ],
    footer: {
      feedback: {
        href: 'https://github.com/hanzoai/tasks/issues/new',
        label: 'Feedback',
        icon: Heart,
      },
      version: `v${APP_VERSION}`,
    },
  }
}

function TasksTopBar({ ns }: { ns?: string }) {
  const { data } = useFetch<{ namespaces: Namespace[] }>('/v1/tasks/namespaces?pageSize=200')
  const recents = useRecentNamespaces(ns)
  const options = (data?.namespaces ?? []).map((n) => ({
    id: n.namespaceInfo.name,
    label: n.namespaceInfo.name,
    // Wire ownerEmail-derived role once the namespace ACL endpoint
    // exists; until then surface no chip rather than a fake one.
  }))

  // Settings menu items — codec server, data converter, theme, sign
  // out. Each is a callback because the live wiring (codec endpoint
  // form, IAM session) is owned by the page, not the chrome.
  const settingsItems: SettingItem[] = [
    {
      id: 'codec-server',
      label: 'Codec server',
      subtitle: 'Decode encrypted payloads',
      icon: Server,
      onSelect: () =>
        alert('Codec server endpoint configuration is wired in tasks/settings/codec.'),
    },
    {
      id: 'data-converter',
      label: 'Data converter',
      subtitle: 'JSON · raw · encrypted',
      icon: FileJson,
      onSelect: () =>
        alert('Data converter selection is wired in tasks/settings/converter.'),
    },
    {
      id: 'developer-mode',
      label: 'Developer mode',
      subtitle: 'Show internal IDs',
      icon: Code,
      onSelect: () => alert('Toggle wired in tasks/settings/developer.'),
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
      left={
        <NamespaceSwitcher
          active={ns}
          options={options}
          hrefFor={(id) => `/namespaces/${encodeURIComponent(id)}/workflows`}
          allHref="/namespaces"
          docsHref="https://docs.hanzo.ai/tasks#namespaces"
          groupLabel="Switch namespace"
          recents={recents}
        />
      }
      right={
        <>
          <EnvIndicator label={APP_ENV} kind={APP_ENV} />
          <VersionBadge version={`v${APP_VERSION}`} title={`Hanzo Tasks ${APP_VERSION}`} />
          <LocalTimeIndicator />
          <SettingsMenu items={settingsItems} groupLabel="Tasks settings" />
          <ThemeToggle storageKey="tasks.theme" />
          <AccountChip
            initials="HZ"
            name="Hanzo"
            subtitle="local · embedded"
            identityHref="/v1/tasks/health"
            onSignOut={() => alert('Sign out is wired through hanzoai/gateway IAM session.')}
          />
        </>
      }
    />
  )
}

export default function App() {
  const { ns } = useParams()
  const sidebarConfig = useCallback(() => buildSidebarConfig(ns), [ns])
  return (
    <AdminApp sidebar={<Sidebar config={sidebarConfig()} />} topBar={<TasksTopBar ns={ns} />}>
      <Outlet />
    </AdminApp>
  )
}
