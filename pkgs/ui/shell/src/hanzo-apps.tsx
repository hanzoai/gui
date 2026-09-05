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
import { MARKS } from './glyph.tsx'
import { U } from './hanzo-registry.ts'

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
    icon: MARKS.chat,
    category: 'Products',
    core: true,
  },
  {
    id: 'app',
    label: 'App',
    href: U.app,
    description: 'Build and ship apps',
    icon: MARKS.blocks,
    category: 'Products',
    core: true,
  },
  {
    id: 'team',
    label: 'Team',
    href: U.team,
    description: 'People and AI together',
    icon: MARKS.users,
    category: 'Products',
    core: true,
  },
  {
    id: 'studio',
    label: 'Studio',
    href: U.studio,
    description: 'Models, prompts and agents',
    icon: MARKS.studio,
    category: 'Products',
    core: true,
  },
  {
    id: 'bot',
    label: 'Bot',
    href: U.bot,
    description: 'Publish AI anywhere',
    icon: MARKS.bot,
    category: 'Products',
    core: true,
  },
  {
    id: 'cloud',
    label: 'Cloud',
    href: U.cloud,
    description: 'Operate the platform',
    icon: MARKS.cloud,
    category: 'Products',
    core: true,
  },
  {
    id: 'dev',
    label: 'Dev',
    href: U.dev,
    description: 'Build from editor and terminal',
    icon: MARKS.code,
    category: 'Products',
  },
  {
    id: 'world',
    label: 'World',
    href: U.ai + '/world',
    description: 'Real-time global intelligence',
    icon: MARKS.globe,
    category: 'Products',
  },
  {
    id: 'search',
    label: 'Search',
    href: U.ai + '/search',
    description: 'AI-powered search',
    icon: MARKS.search,
    category: 'Products',
  },

  // ── Platform ──
  {
    id: 'console',
    label: 'Console',
    href: U.console,
    description: 'API keys, projects & products',
    icon: MARKS.terminal,
    category: 'Platform',
    core: true,
  },
  {
    id: 'gateway',
    label: 'Gateway',
    href: U.gateway,
    description: 'Unified AI API gateway',
    icon: MARKS.gateway,
    category: 'Platform',
  },
  {
    id: 'platform',
    label: 'Platform',
    href: U.platform,
    description: 'Deploy & scale services',
    icon: MARKS.layers,
    category: 'Platform',
  },

  // ── Install ──
  {
    id: 'base',
    label: 'Base',
    href: U.base,
    description: 'Data, auth and files',
    icon: MARKS.base,
    category: 'Products',
  },
  {
    id: 'desktop',
    label: 'Desktop',
    href: U.desktop,
    description: 'Desktop app',
    icon: MARKS.monitor,
    category: 'Install',
  },
  {
    id: 'extension',
    label: 'Browser',
    href: U.extension,
    description: 'Browser extension',
    icon: MARKS.puzzle,
    category: 'Install',
  },
  {
    id: 'cli',
    label: 'CLI',
    href: U.cli,
    description: 'Command-line interface',
    icon: MARKS.terminal,
    category: 'Install',
  },
  {
    id: 'sdks',
    label: 'SDKs',
    href: U.sdks,
    description: 'Client libraries',
    icon: MARKS.package,
    category: 'Install',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    href: U.downloads,
    description: 'Every app and client',
    icon: MARKS.download,
    category: 'Install',
  },

  // ── Account ──
  {
    id: 'account',
    label: 'Account',
    href: U.account,
    description: 'Profile, orgs & billing',
    icon: MARKS.user,
    category: 'Account',
  },
  {
    id: 'billing',
    label: 'Billing',
    href: U.billing,
    description: 'Subscriptions & usage',
    icon: MARKS.card,
    category: 'Account',
  },
  {
    id: 'admin',
    label: 'Admin',
    href: U.admin,
    description: 'Platform administration',
    icon: MARKS.shield,
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
