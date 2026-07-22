'use client'

/**
 * HANZO_APPS — the ONE canonical cross-app list for the Hanzo app-launcher.
 *
 * Single source of truth: add an app here (icon + label + href) and it appears
 * in every Hanzo app's launcher everywhere. Consumed by <HanzoAppLauncher> and
 * <HanzoAppBar>. Do NOT hardcode a second app list anywhere — import from here.
 *
 * Ordering IS the launcher order. `pinned` floats an app to the prominent top
 * row (Zach's personal portal); `core` marks the owner's primary surfaces vs the
 * secondary first-party ones (Platform, Account) shown after.
 */
import React from 'react'

export type HanzoApp = {
  /** Stable id — also the `currentApp` value that highlights this tile. */
  id: string
  /** Short display label under the icon. */
  label: string
  /** Absolute destination URL. */
  href: string
  /** One-line description shown in the pinned row / tooltips. */
  description?: string
  /** Monochrome line icon (inherits `currentColor`). */
  icon: (props: { size?: number }) => React.ReactElement
  /** Float to the prominent pinned row at the top of the launcher. */
  pinned?: boolean
  /** Owner's primary cross-app surface (vs. secondary first-party). */
  core?: boolean
}

/* ── Inline line-icons (no icon-lib dependency; inherit currentColor) ──────── */

const svg = (children: React.ReactNode) =>
  function Icon({ size = 20 }: { size?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    )
  }

const SparkIcon = svg(
  <>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5 13.2 11l2.5 1-2.5 1L12 15.5 10.8 13l-2.5-1 2.5-1z" />
  </>,
)
const GlobeIcon = svg(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18" />
  </>,
)
const TerminalIcon = svg(
  <>
    <path d="m5 8 4 4-4 4" />
    <path d="M13 16h6" />
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
  </>,
)
const CloudIcon = svg(<path d="M17.5 19H8a5 5 0 1 1 1.2-9.86A6 6 0 0 1 21 11a4 4 0 0 1-3.5 8Z" />)
const ChatIcon = svg(<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />)
const BotIcon = svg(
  <>
    <path d="M12 4V2" />
    <rect x="4" y="7" width="16" height="12" rx="2.5" />
    <path d="M2 13h2M20 13h2M9 12v1M15 12v1" />
    <path d="M9.5 16.5h5" />
  </>,
)
const ShieldIcon = svg(
  <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />,
)
const GatewayIcon = svg(
  <>
    <rect x="9" y="3" width="6" height="6" rx="1.2" />
    <rect x="3" y="15" width="6" height="6" rx="1.2" />
    <rect x="15" y="15" width="6" height="6" rx="1.2" />
    <path d="M12 9v3M6 15v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </>,
)
const LayersIcon = svg(
  <>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </>,
)
const UserIcon = svg(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
  </>,
)

/** The 3×3 grid glyph used for the launcher trigger itself. */
export const HanzoGridIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    {[1, 6, 11].flatMap((y) =>
      [1, 6, 11].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1.2" />),
    )}
  </svg>
)

/**
 * The canonical Hanzo app list. ONE edit here adds an app to every launcher.
 * Order = launcher order. Gateway → the console Gateway module (the bare
 * gateway.hanzo.ai edge proxy has no UI; api.hanzo.ai is JSON-only).
 */
export const HANZO_APPS: HanzoApp[] = [
  {
    id: 'zach',
    label: 'Zach',
    href: 'https://console.hanzo.ai/zach',
    description: 'Your personal command center',
    icon: SparkIcon,
    pinned: true,
    core: true,
  },
  {
    id: 'world',
    label: 'World',
    href: 'https://world.hanzo.ai',
    description: 'Real-Time Global Intelligence',
    icon: GlobeIcon,
    core: true,
  },
  {
    id: 'console',
    label: 'Console',
    href: 'https://console.hanzo.ai',
    description: 'API keys, projects & products',
    icon: TerminalIcon,
    core: true,
  },
  {
    id: 'cloud',
    label: 'Cloud',
    href: 'https://cloud.hanzo.ai',
    description: 'AI cloud & inference',
    icon: CloudIcon,
    core: true,
  },
  {
    id: 'chat',
    label: 'Chat',
    href: 'https://hanzo.chat',
    description: 'AI chat & models',
    icon: ChatIcon,
    core: true,
  },
  {
    id: 'app',
    label: 'Bots',
    href: 'https://hanzo.app',
    description: 'All your bots & agents',
    icon: BotIcon,
    core: true,
  },
  {
    id: 'admin',
    label: 'Admin',
    href: 'https://admin.hanzo.ai',
    description: 'Platform administration',
    icon: ShieldIcon,
    core: true,
  },
  {
    id: 'gateway',
    label: 'Gateway',
    href: 'https://console.hanzo.ai/gateway',
    description: 'Unified AI API gateway',
    icon: GatewayIcon,
    core: true,
  },
  {
    id: 'platform',
    label: 'Platform',
    href: 'https://platform.hanzo.ai',
    description: 'Deploy & scale services',
    icon: LayersIcon,
  },
  {
    id: 'account',
    label: 'Account',
    href: 'https://hanzo.id/account',
    description: 'Profile, orgs & billing',
    icon: UserIcon,
  },
]

/** Convenience accessors (never mutate HANZO_APPS in place). */
export const getHanzoApps = (): HanzoApp[] => HANZO_APPS
export const findHanzoApp = (id?: string): HanzoApp | undefined =>
  id ? HANZO_APPS.find((a) => a.id === id) : undefined
