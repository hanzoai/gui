'use client'

import React, { useState, useCallback } from 'react'
import { HanzoWordmark } from './mark'
import { HanzoAppLauncher } from './HanzoAppLauncher'
import { UserOrgDropdown, type UserOrgDropdownProps } from './UserOrgDropdown'
import { type HanzoApp } from './hanzo-apps'
import { ORG_DOMAINS, type HanzoOrg, type HanzoUser } from './types'
import { BAR, CHROME, CTRL_H, FS, R, Z, control, ghostHover } from './theme'
import { SPIN, useShellStyles } from './shellStyles'

/**
 * One bar, one height. 60 is what the audited hanzo.ai bar measures, and the
 * signed-in bar is the same chrome with different contents — 56 here made the
 * public and signed-in halves of one product read as two.
 */
const HEADER_H = 60

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

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

/**
 * The centre search field.
 *
 * The shell draws it and the app owns only what it opens, so every signed-in
 * bar carries the SAME affordance — the alternative, a free `ReactNode` slot,
 * is how each app ends up with its own search box. It is not
 * `HanzoCommandTrigger`: that is the compact glyph the MARKETING header wears,
 * where there is no room for a placeholder. This one is a field, so it can say
 * what it searches.
 */
function SearchField({ placeholder, onClick }: OrgSearch) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        maxWidth: 420,
        height: CTRL_H,
        padding: '0 12px',
        border: `1px solid ${CHROME.border}`,
        borderRadius: R.pill,
        background: CHROME.raised,
        color: CHROME.fgMuted,
        fontSize: FS.sm,
        fontFamily: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = CHROME.raised
      }}
    >
      <SearchIcon />
      <span
        style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {placeholder}
      </span>
      <kbd
        style={{
          fontSize: FS.xs,
          fontFamily: 'inherit',
          color: CHROME.fgDim,
          border: `1px solid ${CHROME.border}`,
          borderRadius: R.row,
          padding: '1px 5px',
        }}
      >
        ⌘K
      </kbd>
    </button>
  )
}

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

/** What the centre search field says, and what pressing it opens. */
export interface OrgSearch {
  placeholder: string
  onClick: () => void
}

export interface OrgHeaderProps {
  /** Current app name shown in the breadcrumb. */
  currentApp: string
  /** Current app id — highlights its launcher tile. */
  currentAppId?: string
  /** Centre search field. Omitted, the bar carries none. */
  search?: OrgSearch
  /** Signed-in user (mapped from IAM at the host's boundary). */
  user?: HanzoUser
  /** Orgs the user belongs to. */
  organizations?: HanzoOrg[]
  /** Currently active org id. */
  currentOrgId?: string
  /** Called when the user selects a different org. */
  onOrgSwitch?: (orgId: string) => void
  /**
   * Ask the server for organizations — see <UserOrgDropdown>. Supplying it
   * makes the switcher search-driven; the reach beyond the caller's own
   * memberships appears only if the server answers with one.
   */
  findOrgs?: UserOrgDropdownProps['findOrgs']
  /** Act as an org the caller does not belong to (server-authorized). */
  onMasquerade?: (orgId: string) => void
  /** The org being acted as, while a masquerade is running. */
  masquerade?: HanzoOrg
  /** Return to your own identity. */
  onMasqueradeStop?: () => void
  /** Called when the user signs out. */
  onSignOut?: () => void
  /** Override the launcher's app list (defaults to the canonical HANZO_APPS). */
  apps?: HanzoApp[]
  /** Extra content rendered at the left of the header's right-hand controls. */
  headerRight?: React.ReactNode
  /**
   * The surface's OWN leading controls, rendered before the mark.
   *
   * Composed WITH the left cluster, never replacing it: an app whose layout has
   * a rail to collapse or a drawer to open has to put those at the leading
   * edge, and without a seat here the only way to keep them was to not mount
   * this bar — which is how a surface ends up with no navigation at all on a
   * phone.
   */
  headerLeft?: React.ReactNode
  /**
   * Replaces the built-in `UserOrgDropdown` at the far right.
   *
   * For an app that owns its own auth port: the dropdown assumes a signed-in
   * `user` and has no signed-out state, so an app whose bar must also greet
   * anonymous visitors hands its own control in here. The shell cannot own an
   * app's session — only the seat it sits in.
   */
  account?: React.ReactNode
  /** Settings URL (defaults to the org's IAM /account). */
  settingsHref?: string
  /** Called when the settings cog is clicked (overrides href navigation). */
  onSettingsClick?: () => void
  /** Hide the hard-refresh button. */
  hideHardRefresh?: boolean
  /** Hide the settings button. */
  hideSettings?: boolean
  /**
   * Hide the leading brand wordmark, breadcrumb slash and current app label.
   */
  hideBrandCrumb?: boolean
  /**
   * Hide the cross-app launcher.
   *
   * For a surface that IS one product rather than a way into all of them: a
   * checkout, an identity screen, a chat. The grid offers twenty-odd
   * destinations, and on a surface someone reached to do ONE thing it is a way
   * out of the thing they came to do.
   *
   * `apps` cannot express this. It overrides the LIST, and an empty list still
   * draws the button — a grid that opens onto nothing, which is worse than the
   * full one. So the choice is whether the launcher exists here at all, and it
   * belongs beside the other two controls a surface can decline.
   */
  hideLauncher?: boolean
}

/**
 * OrgHeader — the signed-in top bar for an app the viewer reaches AS an org.
 *
 * Style: monochrome true-black / white, same as hanzo.ai docs & console.
 *
 * This is the ONE signed-in bar. It absorbed two others that drew the same
 * 56px of chrome with different props: `HanzoAppBar`, which had no consumer at
 * all, and `HanzoAppHeader`, whose one consumer needed exactly two things this
 * lacked — `search` and `account`. Both are gone; do not add a third.
 *
 * Features:
 * - Official Hanzo H-mark (animates on hover, brand menu on right-click)
 * - Current app breadcrumb
 * - The ONE cross-app switcher, `HanzoAppLauncher` (declinable: `hideLauncher`)
 * - Centre search field, opening whatever the app hands it
 * - Hard refresh button (clears ALL storage/cookies/caches and reloads)
 * - Settings cog (links to IAM account or custom settings page)
 * - User + org dropdown (orgs from IAM, sign-out), or the app's own control
 */
export function OrgHeader({
  currentApp,
  currentAppId,
  search,
  user,
  organizations,
  currentOrgId,
  onOrgSwitch,
  onSignOut,
  findOrgs,
  onMasquerade,
  masquerade,
  onMasqueradeStop,
  apps,
  headerRight,
  headerLeft,
  account,
  settingsHref,
  onSettingsClick,
  hideHardRefresh,
  hideSettings,
  hideBrandCrumb,
  hideLauncher,
}: OrgHeaderProps) {
  useShellStyles()
  const [refreshing, setRefreshing] = useState(false)

  // Resolve the current org slug for white-label domain routing.
  const currentOrg = organizations?.find((o) => o.id === currentOrgId)
  const orgSlug = currentOrg?.slug || 'hanzo'
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
        // No hairline — see HanzoHeader: a white line over the boundary reads as
        // a seam between two surfaces rather than the edge of one. The 1px stays
        // so the 60px box and everything measured against it do not move.
        borderBottom: '1px solid transparent',
        // The signed-in bar and the signed-out one are the same bar, so they
        // wear the same material — and it is the one the menus wear. See `BAR`.
        ...BAR,
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      {/* ── Left: the surface's own controls · logo · breadcrumb · switcher ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {headerLeft}
        {!hideBrandCrumb && (
          <>
            {/*
              The color is stated HERE because the mark is `currentColor` and this
              is an anchor: the UA sheet paints
              anchors link-blue and that beats the header's inherited color. The
              mark this replaced hardcoded white and so never noticed.
            */}
            <a
              href={`${domains.iam}/account`}
              aria-label="Account"
              style={{
                display: 'inline-flex',
                flexShrink: 0,
                borderRadius: 4,
                color: CHROME.fg,
              }}
            >
              <HanzoWordmark size={22} brandMenu />
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

            {/*
              The chord is OFF here. An app that mounts this header owns its own ⌘K
              (the OrgCommandPalette), and the switcher this replaced had no chord at
              all — so claiming one would be a new key grab, not a port.
            */}
            {hideLauncher ? null : (
              <HanzoAppLauncher currentApp={currentAppId} apps={apps} quickSwitchKey={false} />
            )}
          </>
        )}
      </div>

      {/* ── Centre: search ── */}
      {search ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            minWidth: 0,
            padding: '0 8px',
          }}
        >
          <SearchField {...search} />
        </div>
      ) : null}

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

        {account ?? (
          <UserOrgDropdown
            user={user}
            organizations={organizations}
            currentOrgId={currentOrgId}
            onOrgSwitch={onOrgSwitch}
            onSignOut={onSignOut}
            findOrgs={findOrgs}
            onMasquerade={onMasquerade}
            masquerade={masquerade}
            onMasqueradeStop={onMasqueradeStop}
          />
        )}
      </div>
    </header>
  )
}
