'use client'

/**
 * HanzoAppBar — the ONE consistent top bar for every Hanzo app.
 *
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ [H] · <App>  [⋮⋮⋮ launcher]              {right slot} ⚙ (you) │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * Left  — Hanzo H-mark (→ logoHref) + current-app label + the 9-dot
 *         <HanzoAppLauncher> (cross-app switch, one-click, ⌘K).
 * Right — an optional per-app `children` slot + a settings/account menu
 *         (profile · settings · sign out · app-specific items).
 *
 * Self-contained (inline styles + theme.ts tokens, React-only) so it drops into
 * any Hanzo app and renders identically — dark, monochrome Hanzo chrome.
 * For apps that already own a header, mount <HanzoAppLauncher> alone instead.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HanzoAppLauncher } from './HanzoAppLauncher'
import { HanzoMark } from './mark'
import { HANZO_APPS, type HanzoApp } from './hanzo-apps'
import { ACCENT, ACCENT_TINT, CHROME, FS, PANEL, R, Z, control, ghostHover, row } from './theme'
import { useShellStyles } from './shellStyles'

export interface HanzoUser {
  name?: string
  email?: string
  avatarUrl?: string
}

export interface HanzoAppBarAction {
  label: string
  href?: string
  onClick?: () => void
}

export interface HanzoAppBarProps {
  /** Current app id — highlights its launcher tile and labels the breadcrumb. */
  currentApp: string
  /** Override the breadcrumb label (defaults to the app's canonical label). */
  currentAppLabel?: string
  /** Override the app list (defaults to canonical HANZO_APPS). */
  apps?: HanzoApp[]
  /** Where the H-mark links (default https://hanzo.ai). */
  logoHref?: string
  /** Signed-in user for the account menu (optional). */
  user?: HanzoUser
  /** Settings link/handler (a gear entry in the account menu). */
  settingsHref?: string
  onSettingsClick?: () => void
  /** Profile link/handler. */
  accountHref?: string
  onProfileClick?: () => void
  /** Sign-out handler (renders the sign-out entry when provided). */
  onSignOut?: () => void
  /** Extra app-specific entries appended to the account menu. */
  accountItems?: HanzoAppBarAction[]
  /** Extra content rendered on the right, before the account menu. */
  children?: React.ReactNode
  /** Global quick-switch key for the launcher (⌘/Ctrl + key). `false` disables. */
  quickSwitchKey?: string | false
  /** Stick to the top of the viewport (default true). */
  sticky?: boolean
}

export function HanzoAppBar({
  currentApp,
  currentAppLabel,
  apps = HANZO_APPS,
  logoHref = 'https://hanzo.ai',
  user,
  settingsHref,
  onSettingsClick,
  accountHref,
  onProfileClick,
  onSignOut,
  accountItems,
  children,
  quickSwitchKey = 'k',
  sticky = true,
}: HanzoAppBarProps) {
  useShellStyles()
  const current = apps.find((a) => a.id === currentApp)
  const label = currentAppLabel ?? current?.label ?? titleCase(currentApp)

  return (
    <header
      role="banner"
      data-hanzo-shell=""
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: Z.sticky as unknown as number,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        padding: '0 16px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${CHROME.border}`,
        background: CHROME.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      {/* ── Left: logo IS the product switcher (⌘K / click), then current-app
             context. One affordance — no separate grid button on the right. ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <HanzoAppLauncher
          currentApp={currentApp}
          apps={apps}
          quickSwitchKey={quickSwitchKey}
          label="Switch Hanzo apps (⌘K)"
          trigger={({ open, hover }) => (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 5px',
                borderRadius: R.pill,
                background: open ? CHROME.hover : 'transparent',
                color: open || hover ? CHROME.fg : CHROME.fgMuted,
                transition: 'background 120ms ease, color 120ms ease',
              }}
            >
              <HanzoMark size={22} />
            </span>
          )}
        />
        <span aria-hidden="true" style={{ color: CHROME.fgDim, fontSize: FS.base }}>
          /
        </span>
        <span
          style={{
            fontSize: FS.sm,
            fontWeight: 600,
            color: CHROME.fgMuted,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
      </div>

      {/* ── Right: app slot · account menu ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {children}
        <AccountMenu
          user={user}
          settingsHref={settingsHref}
          onSettingsClick={onSettingsClick}
          accountHref={accountHref}
          onProfileClick={onProfileClick}
          onSignOut={onSignOut}
          accountItems={accountItems}
        />
      </div>
    </header>
  )
}

/* ── Account / settings menu ─────────────────────────────────────────────── */

function AccountMenu({
  user,
  settingsHref,
  onSettingsClick,
  accountHref,
  onProfileClick,
  onSignOut,
  accountItems,
}: {
  user?: HanzoUser
  settingsHref?: string
  onSettingsClick?: () => void
  accountHref?: string
  onProfileClick?: () => void
  onSignOut?: () => void
  accountItems?: HanzoAppBarAction[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = useCallback((action: HanzoAppBarAction | { href?: string; onClick?: () => void }) => {
    setOpen(false)
    if (action.onClick) action.onClick()
    else if (action.href) window.location.href = action.href
  }, [])

  const rows: HanzoAppBarAction[] = []
  if (accountHref || onProfileClick) rows.push({ label: 'Profile', href: accountHref, onClick: onProfileClick })
  if (settingsHref || onSettingsClick) rows.push({ label: 'Settings', href: settingsHref, onClick: onSettingsClick })
  if (accountItems) rows.push(...accountItems)

  const name = user?.name?.trim() || 'Account'
  const email = user?.email

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account and settings"
        style={{ ...control(open), gap: 8, padding: user ? '0 6px' : 0, width: user ? undefined : 34 }}
        {...ghostHover(open)}
      >
        <Avatar user={user} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          style={{
            ...PANEL,
            position: 'absolute',
            top: 42,
            right: 0,
            zIndex: Z.popover as unknown as number,
            width: 248,
            padding: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 10px' }}>
            <Avatar user={user} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: CHROME.fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name}
              </div>
              {email ? (
                <div style={{ fontSize: FS.xs, color: CHROME.fgDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email}
                </div>
              ) : null}
            </div>
          </div>

          {rows.map((r) => (
            <MenuRow key={r.label} label={r.label} onClick={() => go(r)} />
          ))}

          {onSignOut ? (
            <>
              <div style={{ height: 1, background: CHROME.border, margin: '6px 4px' }} />
              <MenuRow label="Sign out" onClick={() => go({ onClick: onSignOut })} />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function MenuRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{ ...row(), display: 'flex', alignItems: 'center', width: '100%', margin: 0, padding: '8px 10px', border: 'none', fontFamily: 'inherit', textAlign: 'left' }}
      {...ghostHover()}
    >
      {label}
    </button>
  )
}

function Avatar({ user, size = 26 }: { user?: HanzoUser; size?: number }) {
  if (user?.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={user.avatarUrl}
        alt=""
        style={{ width: size, height: size, borderRadius: R.pill, objectFit: 'cover', display: 'block', flexShrink: 0 }}
      />
    )
  }
  const initials =
    (user?.name?.trim() || '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || null
  if (initials) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: R.pill,
          background: ACCENT_TINT,
          color: ACCENT,
          fontSize: Math.round(size * 0.42),
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {initials}
      </span>
    )
  }
  // No user → a neutral account glyph.
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  )
}

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
