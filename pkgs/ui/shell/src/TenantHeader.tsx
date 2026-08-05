'use client'

import React, { useState, useCallback } from 'react'
import { TenantMark } from './TenantMark'
import { AppSwitcher } from './AppSwitcher'
import { UserOrgDropdown } from './UserOrgDropdown'
import {
  DEFAULT_TENANT_APPS,
  ORG_DOMAINS,
  getAppsForOrg,
  type TenantShellProps,
} from './types'
import { CHROME, CTRL_H, FS, GLASS, Z, control, ghostHover } from './theme'
import { SPIN, useShellStyles } from './shellStyles'

const HEADER_H = 56

/* ── Inline SVG icons (no deps) ── */

function HardRefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={spinning ? { animation: SPIN } : undefined}
    >
      {/* Rotate-cw with an "x" feel — two arrows forming a circle */}
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

/** The header's two icon buttons are one control, twice. */
const ICON_BTN: React.CSSProperties = { ...control(), width: CTRL_H, padding: 0 }

/**
 * Nuclear hard-refresh: clears localStorage, sessionStorage, cookies,
 * caches (Service Worker Cache API), unregisters service workers, then reloads.
 */
async function hardRefresh() {
  try {
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()

    // Clear cookies for current domain
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim()
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${location.hostname}`
        // Also clear parent domain cookies (e.g. .hanzo.ai)
        const parts = location.hostname.split('.')
        if (parts.length > 2) {
          const parent = '.' + parts.slice(-2).join('.')
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parent}`
        }
      }
    })

    // Clear Cache API (service worker caches)
    if ('caches' in window) {
      const names = await caches.keys()
      await Promise.all(names.map((n) => caches.delete(n)))
    }

    // Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((r) => r.unregister()))
    }

    // Clear IndexedDB databases (best-effort, async)
    if ('indexedDB' in window && indexedDB.databases) {
      try {
        const dbs = await indexedDB.databases()
        dbs.forEach((db) => {
          if (db.name) indexedDB.deleteDatabase(db.name)
        })
      } catch {
        // databases() not supported in all browsers
      }
    }
  } catch {
    // Swallow — we're reloading anyway
  }

  // Hard reload bypassing cache
  location.reload()
}

/**
 * TenantHeader — shared top navigation bar for all Hanzo properties.
 *
 * Style: monochrome true-black / white, same as hanzo.ai docs & console.
 *
 * Features:
 * - Official Hanzo H-mark (animates on hover, brand context menu on right-click)
 * - Current app breadcrumb
 * - App switcher (billing, console, chat, platform, account)
 * - Hard refresh button (clears ALL storage/cookies/caches and reloads)
 * - Settings cog (links to IAM account or custom settings page)
 * - User + org dropdown (orgs from IAM, sign-out)
 */
export function TenantHeader({
  currentApp,
  currentAppId,
  user,
  organizations,
  currentOrgId,
  onOrgSwitch,
  onSignOut,
  apps,
  headerRight,
  settingsHref,
  onSettingsClick,
  hideHardRefresh,
  hideSettings,
}: Omit<TenantShellProps, 'children'>) {
  useShellStyles()
  const [refreshing, setRefreshing] = useState(false)

  // Resolve current org slug for per-tenant domain routing
  const currentOrg = organizations?.find((o) => o.id === currentOrgId)
  const orgSlug = currentOrg?.slug || 'hanzo'
  const resolvedApps = apps || getAppsForOrg(orgSlug)
  const domains = ORG_DOMAINS[orgSlug] || ORG_DOMAINS.hanzo

  const handleHardRefresh = useCallback(() => {
    setRefreshing(true)
    hardRefresh()
  }, [])

  const handleSettings = useCallback(() => {
    if (onSettingsClick) {
      onSettingsClick()
    } else {
      window.location.href = settingsHref || `${domains.iam}/account`
    }
  }, [onSettingsClick, settingsHref, domains.iam])

  return (
    <header
      role="banner"
      data-hanzo-shell=""
      style={{
        position: 'sticky',
        top: 0,
        zIndex: Z.sticky as unknown as number,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        height: HEADER_H,
        padding: '0 14px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${CHROME.border}`,
        // The header IS the shell's glass — spread the recipe rather than
        // restate it. All three bars had these three lines copied out, so the
        // "ONE recipe" in theme.ts governed the two mega-menu drapes and
        // nothing else: moving GLASS moved the drapes and left every bar behind.
        ...GLASS,
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      {/* ── Left: logo · breadcrumb · app switcher ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <a
          href={`${domains.iam}/account`}
          aria-label="Account"
          style={{ display: 'inline-flex', flexShrink: 0, borderRadius: 4 }}
        >
          <TenantMark size={22} brandMenu animate />
        </a>

        <span
          aria-hidden="true"
          style={{ color: CHROME.fgDim, fontSize: FS.sm, userSelect: 'none' }}
        >
          /
        </span>

        <span
          style={{
            fontSize: FS.sm,
            fontWeight: 600,
            color: CHROME.fgMuted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {currentApp}
        </span>

        <AppSwitcher apps={resolvedApps} currentAppId={currentAppId} />
      </div>

      {/* ── Right: extra slot + actions + user/org ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        {headerRight}

        {/* Hard refresh — nuke all storage/cookies/cache */}
        {!hideHardRefresh && (
          <button
            type="button"
            onClick={handleHardRefresh}
            style={ICON_BTN}
            aria-label="Hard refresh — clear all storage, cookies, cache and reload"
            title="Hard refresh"
            {...ghostHover()}
          >
            <HardRefreshIcon spinning={refreshing} />
          </button>
        )}

        {/* Settings */}
        {!hideSettings && (
          <button
            type="button"
            onClick={handleSettings}
            style={ICON_BTN}
            aria-label="Settings"
            title="Settings"
            {...ghostHover()}
          >
            <SettingsIcon />
          </button>
        )}

        <UserOrgDropdown
          user={user}
          organizations={organizations}
          currentOrgId={currentOrgId}
          onOrgSwitch={onOrgSwitch}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  )
}
