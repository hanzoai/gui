'use client'

/**
 * HANZO_APPS — the ONE canonical cross-app list for the 9-dot launcher.
 *
 * The product/URL data is single-sourced from `hanzo-registry.ts` (the `U` URL
 * table + `HANZO_PRODUCTS`); this module decorates the launcher entries with
 * monochrome line-icons and launcher-friendly short labels. Consumed by
 * <HanzoAppLauncher> and <OrgHeader>. Do NOT hardcode a second app list —
 * import from here (or read the richer registry directly).
 *
 * Ordering IS the launcher order. `category` groups the tiles; `core` marks the
 * primary cross-app surfaces.
 */
import React from 'react'
import { U } from './hanzo-registry'

export type HanzoAppCategory = 'Products' | 'Platform' | 'Install' | 'Account'

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
  /** Launcher grouping. */
  category: HanzoAppCategory
  /** Float to the prominent pinned row at the top of the launcher. */
  pinned?: boolean
  /** Primary cross-app surface. */
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

const ChatIcon = svg(
  <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
)
const AppIcon = svg(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.4" />
    <rect x="14" y="3" width="7" height="7" rx="1.4" />
    <rect x="3" y="14" width="7" height="7" rx="1.4" />
    <rect x="14" y="14" width="7" height="7" rx="1.4" />
  </>
)
const UsersIcon = svg(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
  </>
)
const StudioIcon = svg(
  <>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    <path d="M12 8.2 13.4 11l2.8 1-2.8 1L12 15.8 10.6 13l-2.8-1 2.8-1z" />
  </>
)
const BotIcon = svg(
  <>
    <path d="M12 4V2" />
    <rect x="4" y="7" width="16" height="12" rx="2.5" />
    <path d="M2 13h2M20 13h2M9 12v1M15 12v1" />
    <path d="M9.5 16.5h5" />
  </>
)
const CloudIcon = svg(
  <path d="M17.5 19H8a5 5 0 1 1 1.2-9.86A6 6 0 0 1 21 11a4 4 0 0 1-3.5 8Z" />
)
const CodeIcon = svg(
  <>
    <path d="m9 8-4 4 4 4" />
    <path d="m15 8 4 4-4 4" />
  </>
)
const GlobeIcon = svg(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18" />
  </>
)
const SearchIcon = svg(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </>
)
const TerminalIcon = svg(
  <>
    <path d="m5 8 4 4-4 4" />
    <path d="M13 16h6" />
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
  </>
)
const GatewayIcon = svg(
  <>
    <rect x="9" y="3" width="6" height="6" rx="1.2" />
    <rect x="3" y="15" width="6" height="6" rx="1.2" />
    <rect x="15" y="15" width="6" height="6" rx="1.2" />
    <path d="M12 9v3M6 15v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </>
)
const LayersIcon = svg(
  <>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </>
)
const MonitorIcon = svg(
  <>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </>
)
const PuzzleIcon = svg(
  <path d="M9 4.5a1.5 1.5 0 0 1 3 0V6h3a1 1 0 0 1 1 1v3h1.5a1.5 1.5 0 0 1 0 3H16v3a1 1 0 0 1-1 1h-3v-1.5a1.5 1.5 0 0 0-3 0V20H6a1 1 0 0 1-1-1v-3H3.5a1.5 1.5 0 0 1 0-3H5V7a1 1 0 0 1 1-1h3z" />
)
const UserIcon = svg(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
  </>
)
const CardIcon = svg(
  <>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19M6 15h4" />
  </>
)
const ShieldIcon = svg(<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />)

/** The 3×3 grid glyph used for the launcher trigger itself. */
export const HanzoGridIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    {[1, 6, 11].flatMap((y) =>
      [1, 6, 11].map((x) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1.2" />
      ))
    )}
  </svg>
)

/**
 * The canonical Hanzo app list. ONE edit here adds an app to every launcher.
 * Order = launcher order. URLs come from the registry `U` table (single source).
 */
export const HANZO_APPS: HanzoApp[] = [
  // ── Products ──
  {
    id: 'chat',
    label: 'Chat',
    href: U.chat,
    description: 'Use AI — ask anything',
    icon: ChatIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'app',
    label: 'App',
    href: U.app,
    description: 'Build and ship apps',
    icon: AppIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'team',
    label: 'Team',
    href: U.team,
    description: 'People and AI together',
    icon: UsersIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'studio',
    label: 'Studio',
    href: U.studio,
    description: 'Models, prompts and agents',
    icon: StudioIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'bot',
    label: 'Bot',
    href: U.bot,
    description: 'Publish AI anywhere',
    icon: BotIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'cloud',
    label: 'Cloud',
    href: U.cloud,
    description: 'Operate the platform',
    icon: CloudIcon,
    category: 'Products',
    core: true,
  },
  {
    id: 'dev',
    label: 'Dev',
    href: U.dev,
    description: 'Build from editor and terminal',
    icon: CodeIcon,
    category: 'Products',
  },
  {
    id: 'world',
    label: 'World',
    href: U.ai + '/world',
    description: 'Real-time global intelligence',
    icon: GlobeIcon,
    category: 'Products',
  },
  {
    id: 'search',
    label: 'Search',
    href: U.ai + '/search',
    description: 'AI-powered search',
    icon: SearchIcon,
    category: 'Products',
  },

  // ── Platform ──
  {
    id: 'console',
    label: 'Console',
    href: U.console,
    description: 'API keys, projects & products',
    icon: TerminalIcon,
    category: 'Platform',
    core: true,
  },
  {
    id: 'gateway',
    label: 'Gateway',
    href: U.gateway,
    description: 'Unified AI API gateway',
    icon: GatewayIcon,
    category: 'Platform',
  },
  {
    id: 'platform',
    label: 'Platform',
    href: U.platform,
    description: 'Deploy & scale services',
    icon: LayersIcon,
    category: 'Platform',
  },

  // ── Install ──
  {
    id: 'desktop',
    label: 'Desktop',
    href: U.desktop,
    description: 'Desktop app',
    icon: MonitorIcon,
    category: 'Install',
  },
  {
    id: 'extension',
    label: 'Browser',
    href: U.extension,
    description: 'Browser extension',
    icon: PuzzleIcon,
    category: 'Install',
  },
  {
    id: 'cli',
    label: 'CLI',
    href: U.cli,
    description: 'Command-line interface',
    icon: TerminalIcon,
    category: 'Install',
  },

  // ── Account ──
  {
    id: 'account',
    label: 'Account',
    href: U.account,
    description: 'Profile, orgs & billing',
    icon: UserIcon,
    category: 'Account',
  },
  {
    id: 'billing',
    label: 'Billing',
    href: U.billing,
    description: 'Subscriptions & usage',
    icon: CardIcon,
    category: 'Account',
  },
  {
    id: 'admin',
    label: 'Admin',
    href: U.admin,
    description: 'Platform administration',
    icon: ShieldIcon,
    category: 'Account',
  },
]

/** The category order used by grouped launchers / menus. */
export const HANZO_APP_CATEGORIES: HanzoAppCategory[] = [
  'Products',
  'Platform',
  'Install',
  'Account',
]

/** Convenience accessors (never mutate HANZO_APPS in place). */
export const getHanzoApps = (): HanzoApp[] => HANZO_APPS
export const findHanzoApp = (id?: string): HanzoApp | undefined =>
  id ? HANZO_APPS.find((a) => a.id === id) : undefined

/** Group the app list by category, preserving `HANZO_APP_CATEGORIES` order. */
export const groupHanzoApps = (
  apps: HanzoApp[] = HANZO_APPS
): Array<{ category: HanzoAppCategory; apps: HanzoApp[] }> =>
  HANZO_APP_CATEGORIES.map((category) => ({
    category,
    apps: apps.filter((a) => a.category === category),
  })).filter((g) => g.apps.length > 0)
