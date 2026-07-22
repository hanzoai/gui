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
 * Self-contained (inline styles + inline SVG, React-only) so it drops into any
 * Hanzo app and renders identically — Hanzo white-label (dark, orange accent).
 * For apps that already own a header, mount <HanzoAppLauncher> alone instead.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HanzoAppLauncher } from './HanzoAppLauncher'
import { HANZO_APPS, type HanzoApp } from './hanzo-apps'

const ORANGE = '#f97316'
const BAR_BG = 'rgba(9,9,11,0.85)'
const BORDER = 'rgba(255,255,255,0.08)'
const FG = 'rgba(255,255,255,0.92)'
const FG_DIM = 'rgba(255,255,255,0.42)'
const HOVER_BG = 'rgba(255,255,255,0.06)'

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
  const current = apps.find((a) => a.id === currentApp)
  const label = currentAppLabel ?? current?.label ?? titleCase(currentApp)

  return (
    <header
      role="banner"
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        padding: '0 16px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${BORDER}`,
        background: BAR_BG,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: FG,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* ── Left: mark · app · launcher ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <a
          href={logoHref}
          aria-label="Hanzo"
          style={{ display: 'inline-flex', flexShrink: 0, borderRadius: 6 }}
        >
          <HMark size={22} />
        </a>
        <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.18)', fontSize: 16 }}>
          /
        </span>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
        <HanzoAppLauncher currentApp={currentApp} apps={apps} quickSwitchKey={quickSwitchKey} />
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 34,
          padding: user ? '0 6px 0 6px' : 0,
          width: user ? undefined : 34,
          justifyContent: 'center',
          border: 'none',
          borderRadius: 9,
          background: open ? HOVER_BG : 'transparent',
          color: FG,
          cursor: 'pointer',
          transition: 'background 120ms ease',
        }}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLElement).style.background = HOVER_BG
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        <Avatar user={user} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          style={{
            position: 'absolute',
            top: 42,
            right: 0,
            zIndex: 1000,
            width: 248,
            padding: 8,
            borderRadius: 14,
            border: `1px solid ${BORDER}`,
            background: '#0b0b0f',
            boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 10px' }}>
            <Avatar user={user} size={34} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: FG, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name}
              </div>
              {email ? (
                <div style={{ fontSize: 11.5, color: FG_DIM, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
              <div style={{ height: 1, background: BORDER, margin: '6px 4px' }} />
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
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 10px',
        border: 'none',
        borderRadius: 9,
        background: 'transparent',
        color: FG,
        fontSize: 13,
        textAlign: 'left',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = HOVER_BG)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
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
        style={{ width: size, height: size, borderRadius: 8, objectFit: 'cover', display: 'block', flexShrink: 0 }}
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
          borderRadius: 8,
          background: 'rgba(249,115,22,0.18)',
          color: ORANGE,
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

/** Official Hanzo H-mark (white paths). */
function HMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" aria-label="Hanzo">
      <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#fff" />
      <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#fff" />
      <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#fff" />
      <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#fff" />
      <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#fff" />
    </svg>
  )
}

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
