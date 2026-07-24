'use client'

/**
 * HanzoAppLauncher — the cross-app "9-dot grid" product switcher (Google-apps
 * pattern) shared by every Hanzo surface.
 *
 * Self-contained by design: inline styles + inline SVG, React the only runtime
 * dependency, ZERO CSS-framework coupling — so it drops into any Hanzo app
 * (Next 15/16, Vite, React 18/19) and renders identically regardless of the
 * host's Tailwind/Tamagui/none setup.
 *
 * - Click (or ⌘K / Ctrl-K) opens a grid of every Hanzo app (icon + label).
 * - The current app is highlighted (monochrome brand accent ring, `aria-current`).
 * - Fully keyboard-accessible: trigger is a real button; the panel autofocuses
 *   the filter; ↑/↓/←/→/Home/End rove the tiles; Enter opens; Esc closes and
 *   returns focus to the trigger.
 * - Any `pinned` apps float to a prominent top row above the grid.
 *
 * Source of truth for the app list is `HANZO_APPS` (./hanzo-apps).
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { HANZO_APPS, HanzoGridIcon, type HanzoApp } from './hanzo-apps'
import { U } from './hanzo-registry'
import { isEntitled as planEntitles, normalizeTier } from './entitlements'
import { useEntitlement } from './useEntitlement'
import { ACCENT, ACCENT_SOFT, ACCENT_SOFTER, CHROME } from './theme'
import { useShellFocusRing } from './focusRing'

const PANEL_BG = CHROME.panel
const BORDER = CHROME.border
const FG = CHROME.fg
const FG_DIM = CHROME.fgDim
const HOVER_BG = CHROME.hover

export interface HanzoAppLauncherProps {
  /** Highlights the matching tile + marks it `aria-current`. */
  currentApp?: string
  /** Override the app list (defaults to the canonical HANZO_APPS). */
  apps?: HanzoApp[]
  /** Panel edge alignment relative to the trigger. */
  align?: 'left' | 'right'
  /**
   * Global quick-switch key used with ⌘/Ctrl (default `'k'`). Pass `false` to
   * disable the global listener (e.g. in Console, where ⌘K already opens the
   * command palette).
   */
  quickSwitchKey?: string | false
  /** Accessible label for the trigger. */
  label?: string
  /** Size of the trigger glyph. */
  size?: number
  /** Render with the panel already open (storybook / embedding / tests). */
  defaultOpen?: boolean
  /**
   * Current viewer's plan tier slug. When set, tiles for apps the tier does NOT
   * grant render LOCKED (dimmed + lock badge, click → `upgradeHref`). Omit to
   * keep every tile an unconditional link (backward compatible).
   */
  userPlan?: string
  /**
   * Override the per-app access check (defaults to the registry
   * `isEntitled(userPlan, appId)`). Pass a resolver — e.g. from a shared
   * `useEntitlement()` — to gate without also passing `userPlan`.
   */
  isEntitled?: (appId: string) => boolean
  /**
   * Resolve the viewer's plan HERE via `useEntitlement` and lock tiles above it.
   * Pass `true` for the default billing endpoint, or `{ endpoint }` to point it
   * elsewhere. Ignored when `userPlan` or `isEntitled` is supplied.
   */
  entitlement?: boolean | { endpoint?: string; fallbackTier?: string }
  /** Where a locked tile sends the viewer to upgrade (default the plans surface). */
  upgradeHref?: string
}

export function HanzoAppLauncher({
  currentApp,
  apps = HANZO_APPS,
  align = 'left',
  quickSwitchKey = 'k',
  label = 'Hanzo apps',
  size = 18,
  defaultOpen = false,
  userPlan,
  isEntitled: providedIsEntitled,
  entitlement,
  upgradeHref = U.pricing,
}: HanzoAppLauncherProps) {
  useShellFocusRing()

  // Resolve the viewer's plan ourselves only when asked to AND no check/tier was
  // supplied; the `enabled` flag keeps the hook a no-op (no fetch) otherwise.
  const auto = useEntitlement({
    enabled: !!entitlement && providedIsEntitled == null && userPlan == null,
    endpoint: typeof entitlement === 'object' ? entitlement.endpoint : undefined,
    fallbackTier: typeof entitlement === 'object' ? entitlement.fallbackTier : undefined,
  })

  // The effective access check, or `null` when no entitlement context is provided
  // (in which case every tile stays an unconditional link — backward compatible).
  const check = useMemo<((appId: string) => boolean) | null>(() => {
    if (providedIsEntitled) return providedIsEntitled
    if (userPlan != null) return (id: string) => planEntitles(id, normalizeTier(userPlan))
    if (entitlement) return auto.isEntitled
    return null
  }, [providedIsEntitled, userPlan, entitlement, auto.isEntitled])
  const [open, setOpen] = useState(defaultOpen)
  const [hover, setHover] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const tileRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const panelId = useId()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    // Return focus to the trigger for a clean keyboard loop.
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  // ── Global ⌘K / Ctrl-K quick-switch (opt-out via quickSwitchKey={false}) ──
  useEffect(() => {
    if (!quickSwitchKey) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === quickSwitchKey.toLowerCase()) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [quickSwitchKey])

  // ── Dismiss on outside click ──
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // ── Autofocus the filter when the panel opens ──
  useEffect(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  const q = query.trim().toLowerCase()
  const filtering = q.length > 0
  const visible = useMemo(() => {
    if (!filtering) return apps
    return apps.filter(
      (a) => a.label.toLowerCase().includes(q) || (a.description ?? '').toLowerCase().includes(q),
    )
  }, [apps, filtering, q])

  // When not filtering, pinned apps get their own prominent row above the grid.
  const pinned = filtering ? [] : visible.filter((a) => a.pinned)
  const grid = filtering ? visible : visible.filter((a) => !a.pinned)
  // Flat, in-render-order list for roving focus (pinned rows, then grid tiles).
  const order = useMemo(() => [...pinned, ...grid], [pinned, grid])

  const focusTile = useCallback((i: number) => {
    const n = tileRefs.current.length
    if (n === 0) return
    const idx = ((i % n) + n) % n
    tileRefs.current[idx]?.focus()
  }, [])

  const onPanelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      const active = document.activeElement
      const cur = tileRefs.current.findIndex((t) => t === active)
      if (e.key === 'ArrowDown' && active === searchRef.current) {
        e.preventDefault()
        focusTile(0)
        return
      }
      if (cur < 0) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusTile(cur + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusTile(cur - 1)
          break
        case 'Home':
          e.preventDefault()
          focusTile(0)
          break
        case 'End':
          e.preventDefault()
          focusTile(tileRefs.current.length - 1)
          break
      }
    },
    [close, focusTile],
  )

  // Reset the ref array each render so indices track `order`.
  tileRefs.current = []
  const registerTile = (el: HTMLAnchorElement | null) => {
    if (el) tileRefs.current.push(el)
  }

  const Tile = (app: HanzoApp, wide: boolean) => {
    const isCurrent = app.id === currentApp
    // Locked = an entitlement context is active AND the viewer's tier does not
    // grant this app. Locked tiles stay real links (keyboard + roving focus),
    // but point at the upgrade surface instead of the app.
    const locked = check ? !check(app.id) : false
    const Icon = app.icon
    return (
      <a
        key={app.id}
        ref={registerTile}
        href={locked ? upgradeHref : app.href}
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={
          locked
            ? `${app.label} — locked, upgrade to unlock`
            : app.description
              ? `${app.label} — ${app.description}`
              : app.label
        }
        onClick={() => setOpen(false)}
        style={{
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          alignItems: 'center',
          gap: wide ? 12 : 8,
          textAlign: wide ? 'left' : 'center',
          textDecoration: 'none',
          padding: wide ? '10px 12px' : '12px 8px',
          borderRadius: 12,
          border: `1px solid ${isCurrent ? ACCENT : 'transparent'}`,
          background: isCurrent ? ACCENT_SOFT : 'transparent',
          color: FG,
          opacity: locked ? 0.55 : 1,
          outlineColor: ACCENT,
          transition: 'background 120ms ease, border-color 120ms ease, opacity 120ms ease',
          justifyContent: wide ? 'flex-start' : 'center',
        }}
        onMouseEnter={(e) => {
          if (!isCurrent) (e.currentTarget as HTMLElement).style.background = HOVER_BG
        }}
        onMouseLeave={(e) => {
          if (!isCurrent) (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: wide ? 40 : 44,
            height: wide ? 40 : 44,
            flexShrink: 0,
            borderRadius: 12,
            background: isCurrent ? ACCENT_SOFTER : 'rgba(255,255,255,0.05)',
            color: isCurrent ? ACCENT : FG,
          }}
        >
          <Icon size={wide ? 20 : 22} />
          {locked ? (
            <span
              style={{
                position: 'absolute',
                right: -3,
                bottom: -3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: PANEL_BG,
                border: `1px solid ${BORDER}`,
                color: FG_DIM,
              }}
            >
              <LockGlyph size={9} />
            </span>
          ) : null}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.2,
              color: isCurrent ? ACCENT : FG,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: wide ? undefined : 92,
            }}
          >
            {app.label}
          </span>
          {wide && app.description ? (
            <span style={{ fontSize: 11.5, color: FG_DIM, lineHeight: 1.25 }}>{app.description}</span>
          ) : null}
        </span>
      </a>
    )
  }

  // Resting color sits at the nav-link tier (not `currentColor`, which can
  // resolve near-invisible on some hosts); hover/open lifts it to the accent.
  const triggerColor = open || hover ? ACCENT : CHROME.fgMuted

  return (
    <div ref={rootRef} data-hanzo-shell="" style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        title={label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          padding: 0,
          border: 'none',
          borderRadius: 9,
          background: open ? ACCENT_SOFT : 'transparent',
          color: triggerColor,
          cursor: 'pointer',
          transition: 'background 120ms ease, color 120ms ease',
        }}
      >
        <HanzoGridIcon size={size} />
      </button>

      {open ? (
        <div
          id={panelId}
          aria-label="Hanzo apps"
          onKeyDown={onPanelKeyDown}
          style={{
            position: 'absolute',
            top: 44,
            left: align === 'left' ? 0 : undefined,
            right: align === 'right' ? 0 : undefined,
            zIndex: 1000,
            width: 340,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: 12,
            borderRadius: 16,
            border: `1px solid ${BORDER}`,
            background: PANEL_BG,
            boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)',
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px 10px' }}>
            <HanzoWordmark />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: FG_DIM, textTransform: 'uppercase' }}>
              Apps
            </span>
          </div>

          {/* Filter */}
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter apps…"
            aria-label="Filter apps"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              marginBottom: 10,
              borderRadius: 10,
              border: `1px solid ${BORDER}`,
              background: 'rgba(255,255,255,0.03)',
              color: FG,
              fontSize: 13,
              outline: 'none',
            }}
          />

          {/* Pinned row(s) — the personal portal floats to the top. */}
          {pinned.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
              {pinned.map((a) => Tile(a, true))}
            </div>
          ) : null}

          {/* Grid */}
          {grid.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {grid.map((a) => Tile(a, false))}
            </div>
          ) : (
            <div style={{ padding: '18px 8px', textAlign: 'center', color: FG_DIM, fontSize: 13 }}>
              No apps match “{query.trim()}”.
            </div>
          )}

          {/* Footer hint */}
          {quickSwitchKey ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, color: FG_DIM, fontSize: 11 }}>
              <kbd
                style={{
                  fontFamily: 'inherit',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  padding: '1px 6px',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                ⌘{quickSwitchKey.toUpperCase()}
              </kbd>
              <span style={{ marginLeft: 6 }}>to switch</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/** Padlock badge shown on tiles the viewer's plan does not grant. */
function LockGlyph({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

/** Small Hanzo H-mark + wordmark used in the panel header (orange dot accent). */
function HanzoWordmark() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <svg width={16} height={16} viewBox="0 0 67 67" aria-hidden="true">
        <path d="M22.21 67V44.6369H0V67H22.21Z" fill="#fff" />
        <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="#fff" />
        <path d="M22.21 0H0V22.3184H22.21V0Z" fill="#fff" />
        <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="#fff" />
        <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="#fff" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>Hanzo</span>
    </span>
  )
}
