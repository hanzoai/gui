'use client'

/**
 * HanzoAppHeader — the ONE signed-in application shell header. Once a visitor
 * enters a product the marketing links are GONE; this replaces them with the
 * Organization → Project context, product search / Ask-Hanzo, the product's own
 * action buttons, and the account control. The Org→Project model is identical
 * across Chat / App / Team / Studio / Bot / Cloud, so moving between products
 * preserves context.
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │ [H]  Maxpower ⌄ / Enso ⌄     [ Search or ask Hanzo… ⌘K ]  [actions] ●  │
 *   └──────────────────────────────────────────────────────────────────────┘
 *   or, with a back affordance (App / Bot editors):
 *   │ [← Projects]  Maxpower / Customer Portal  Development ⌄   [actions]    │
 *
 * Self-contained: inline styles + theme.ts tokens, React the only runtime dep.
 * Fully keyboard-accessible (real buttons, Esc-closes switchers, focus return).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HanzoMark } from './mark'
import { type HanzoAppBarAction } from './HanzoAppBar'
import { ACCENT, ACCENT_SOFT, CHROME, FS, Z } from './theme'

const HEADER_H = 56

/** A named context node (org or project) for the breadcrumb switchers. */
export interface HanzoContextNode {
  id: string
  label: string
  href?: string
}

/** An app-header action button; `variant` picks ghost (default) or filled. */
export interface HanzoAppHeaderAction extends HanzoAppBarAction {
  variant?: 'ghost' | 'filled'
  /** Optional trailing chevron (e.g. `Model: Enso ⌄`). */
  chevron?: boolean
}

export interface HanzoAppHeaderProps {
  /** Current product id (drives the H-mark link + labelling). */
  productId: string
  /** Left affordance: the H logo (default) or a `← <label>` back link. */
  mark?: 'logo' | 'back'
  /** Back-link target + label when `mark="back"`. */
  backHref?: string
  backLabel?: string
  /** Current organization (first breadcrumb segment). */
  org?: HanzoContextNode
  /** Selectable orgs — renders a switcher dropdown when provided. */
  orgs?: HanzoContextNode[]
  onOrgChange?: (org: HanzoContextNode) => void
  /** Current project (second breadcrumb segment). */
  project?: HanzoContextNode
  /** Selectable projects — renders a switcher dropdown when provided. */
  projects?: HanzoContextNode[]
  onProjectChange?: (project: HanzoContextNode) => void
  /** Center search / Ask-Hanzo control — a node, or a placeholder to render one. */
  search?: React.ReactNode | { placeholder: string; onClick?: () => void }
  /** Product-specific action buttons (Chat: Share; App: Preview/Publish; …). */
  actions?: HanzoAppHeaderAction[]
  /** Account control at the far right (avatar/menu). */
  account?: React.ReactNode
  className?: string
  logoHref?: string
}

export function HanzoAppHeader({
  productId,
  mark = 'logo',
  backHref = '..',
  backLabel = 'Back',
  org,
  orgs,
  onOrgChange,
  project,
  projects,
  onProjectChange,
  search,
  actions = [],
  account,
  className,
  logoHref = 'https://hanzo.ai',
}: HanzoAppHeaderProps) {
  return (
    <header
      role="banner"
      className={className}
      data-product={productId}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: Z.sticky as unknown as number,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: HEADER_H,
        padding: '0 14px',
        boxSizing: 'border-box',
        borderBottom: `1px solid ${CHROME.border}`,
        background: CHROME.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: CHROME.fg,
        fontFamily: CHROME.font,
      }}
    >
      {/* ── Left: logo or back ── */}
      {mark === 'back' ? (
        <a
          href={backHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            height: 34,
            padding: '0 10px',
            borderRadius: 9,
            textDecoration: 'none',
            fontSize: FS.sm,
            fontWeight: 600,
            color: CHROME.fg,
          }}
        >
          <BackArrow />
          {backLabel}
        </a>
      ) : (
        <a href={logoHref} aria-label="Hanzo" style={{ display: 'inline-flex', flexShrink: 0, color: CHROME.fg }}>
          <HanzoMark size={22} />
        </a>
      )}

      {/* ── Org → Project breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        {org ? <Crumb node={org} options={orgs} onSelect={onOrgChange} label="Organization" /> : null}
        {org && project ? <Sep /> : null}
        {project ? <Crumb node={project} options={projects} onSelect={onProjectChange} label="Project" /> : null}
      </div>

      {/* ── Center search / Ask Hanzo ── */}
      {search ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0, padding: '0 8px' }}>
          {isSearchConfig(search) ? <SearchField {...search} /> : search}
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* ── Product actions + account ── */}
      {actions.map((action, i) => (
        <ActionButton key={`${action.label}-${i}`} action={action} />
      ))}
      {account}
    </header>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function isSearchConfig(v: unknown): v is { placeholder: string; onClick?: () => void } {
  return typeof v === 'object' && v !== null && 'placeholder' in v
}

function SearchField({ placeholder, onClick }: { placeholder: string; onClick?: () => void }) {
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
        height: 34,
        padding: '0 12px',
        border: `1px solid ${CHROME.border}`,
        borderRadius: 9,
        background: 'rgba(255,255,255,0.03)',
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
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
      }}
    >
      <SearchGlyph />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{placeholder}</span>
      <kbd
        style={{
          fontSize: FS.xs,
          fontFamily: 'inherit',
          color: CHROME.fgDim,
          border: `1px solid ${CHROME.border}`,
          borderRadius: 5,
          padding: '1px 5px',
        }}
      >
        ⌘K
      </kbd>
    </button>
  )
}

function Crumb({
  node,
  options,
  onSelect,
  label,
}: {
  node: HanzoContextNode
  options?: HanzoContextNode[]
  onSelect?: (n: HanzoContextNode) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const switchable = !!options && options.length > 0

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const inner = (
    <>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
      {switchable ? <Chevron open={open} /> : null}
    </>
  )

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    maxWidth: 200,
    height: 32,
    padding: '0 9px',
    borderRadius: 8,
    border: 'none',
    background: open ? CHROME.hover : 'transparent',
    color: CHROME.fg,
    fontSize: FS.sm,
    fontWeight: 600,
    fontFamily: 'inherit',
    textDecoration: 'none',
    cursor: switchable ? 'pointer' : 'default',
  }

  if (!switchable) {
    return node.href ? (
      <a href={node.href} style={baseStyle}>
        {inner}
      </a>
    ) : (
      <span style={baseStyle}>{inner}</span>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${node.label}`}
        style={baseStyle}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLElement).style.background = CHROME.hover
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        {inner}
      </button>
      {open ? (
        <div
          ref={menuRef}
          role="listbox"
          aria-label={label}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            minWidth: 220,
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: Z.popover as unknown as number,
            padding: 6,
            borderRadius: 12,
            border: `1px solid ${CHROME.border}`,
            background: CHROME.panel,
            boxShadow: '0 24px 60px -16px rgba(0,0,0,0.7)',
          }}
        >
          {options!.map((opt) => {
            const current = opt.id === node.id
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={current}
                onClick={() => {
                  onSelect?.(opt)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  borderRadius: 8,
                  background: current ? ACCENT_SOFT : 'transparent',
                  color: current ? ACCENT : CHROME.fg,
                  fontSize: FS.sm,
                  fontWeight: current ? 600 : 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!current) (e.currentTarget as HTMLElement).style.background = CHROME.hover
                }}
                onMouseLeave={(e) => {
                  if (!current) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
                {current ? <Check /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function ActionButton({ action }: { action: HanzoAppHeaderAction }) {
  const filled = action.variant === 'filled'
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
    height: 34,
    padding: '0 13px',
    borderRadius: 9,
    textDecoration: 'none',
    fontSize: FS.sm,
    fontWeight: 600,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: filled ? '1px solid transparent' : `1px solid ${CHROME.border}`,
    background: filled ? ACCENT : 'transparent',
    color: filled ? '#0b0b0f' : CHROME.fg,
    transition: 'opacity 120ms ease, background 120ms ease',
  }
  const hoverIn = (el: HTMLElement) => {
    if (filled) el.style.opacity = '0.85'
    else el.style.background = CHROME.hover
  }
  const hoverOut = (el: HTMLElement) => {
    if (filled) el.style.opacity = '1'
    else el.style.background = 'transparent'
  }
  const body = (
    <>
      {action.label}
      {action.chevron ? <Chevron open={false} /> : null}
    </>
  )
  return action.href ? (
    <a
      href={action.href}
      onClick={action.onClick}
      style={style}
      onMouseEnter={(e) => hoverIn(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => hoverOut(e.currentTarget as HTMLElement)}
    >
      {body}
    </a>
  ) : (
    <button
      type="button"
      onClick={action.onClick}
      style={style}
      onMouseEnter={(e) => hoverIn(e.currentTarget as HTMLElement)}
      onMouseLeave={(e) => hoverOut(e.currentTarget as HTMLElement)}
    >
      {body}
    </button>
  )
}

/* ── Glyphs ──────────────────────────────────────────────────────────────── */

function Sep() {
  return (
    <span aria-hidden="true" style={{ color: CHROME.fgDim, fontSize: FS.sm, padding: '0 1px' }}>
      /
    </span>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease', flexShrink: 0 }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function BackArrow() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function Check() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
