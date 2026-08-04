'use client'

/**
 * MeetHanzoMenu — the universal "Meet Hanzo" mega-menu, IDENTICAL on every
 * Hanzo property. It is the one place a visitor discovers the whole ecosystem,
 * so it renders the SAME data (`MEET_HANZO_GROUPS`) everywhere:
 *
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │ Flagship products                                                  │
 *   │  ┌───────────┐ ┌───────────┐ ┌───────────┐                         │
 *   │  │ Hanzo Chat│ │ Hanzo App │ │ Hanzo Team│  … rich product cards    │
 *   │  │ Ask …     │ │ Build …   │ │ People …  │                         │
 *   │  └───────────┘ └───────────┘ └───────────┘                         │
 *   │  Platform          Install            Resources                     │
 *   │  · Models          · Desktop app      · Documentation   … columns   │
 *   ├──────────────────────────────────────────────────────────────────┤
 *
 * It is the SAME FULL-BLEED DRAPE the Products mega-menu is: edge-to-edge under
 * the header, no gutters, no radius, no outline box, closed by one hairline —
 * and its content carries the header's own 16px gutter, so the first card sits
 * under the brand mark. The two menus hang off adjacent triggers in one header
 * row; when one was a floating rounded card and the other a drape, opening them
 * in turn looked like two different products' navigation.
 *
 * Controlled-open (props `open`/`onClose`/`anchor`) so a header can drive it;
 * also usable standalone. Self-contained: inline styles + theme.ts tokens,
 * React the only runtime dep — drops into any host with zero setup. Fully
 * keyboard-accessible: Esc closes and returns focus to the previously-focused
 * element; ↑/↓/←/→/Home/End rove the items; the current product is highlighted
 * with an accent ring + `aria-current`.
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  HANZO_FLAGSHIP,
  MEET_HANZO_GROUPS,
  type HanzoLink,
  type HanzoProduct,
} from './hanzo-registry'
import {
  ACCENT,
  ACCENT_SOFT,
  CHROME,
  FS,
  LABEL,
  R,
  SHADOW,
  Z,
  ghostHover,
  row,
} from './theme'
import { useShellStyles } from './shellStyles'
import { useMediaQuery } from './useMediaQuery'

/** Matches the header's own `padding: 0 16px`, so the two align edge for edge. */
const GUTTER = 16

export interface MeetHanzoMenuProps {
  /** Controlled visibility. When false/undefined the menu renders nothing. */
  open?: boolean
  /** Called on Esc, backdrop click, or item activation. */
  onClose?: () => void
  /** px from the viewport top where the panel drops (under the header row). */
  anchor?: number
  /** Highlights the current product (accent ring + `aria-current`). */
  currentProductId?: string
  /** id for the panel (wire the trigger's `aria-controls` to it). */
  id?: string
  className?: string
  /**
   * Optional per-link href rewriter. The menu renders the SAME registry data
   * everywhere by default (product homes on hanzo.ai); a host can pass this to
   * point items at a local equivalent instead — e.g. the docs site maps
   * `hanzo.ai/models` → `/docs/services/models` so its own nav keeps users in
   * the docs. Called once per link with (href, id); return the href to use.
   * Omit it (the default on every marketing property) to keep the canonical
   * ecosystem links unchanged.
   */
  resolveHref?: (href: string, id: string) => string
}

export function MeetHanzoMenu({
  open,
  onClose,
  anchor = 60,
  currentProductId,
  id,
  className,
  resolveHref,
}: MeetHanzoMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const restoreRef = useRef<HTMLElement | null>(null)
  useShellStyles()
  // ONE track count for the whole drape — the cards AND the link columns sit on
  // it, so a column of links is the same width as the tile above it and as a
  // Products category beside it. Six divides the six flagship cards evenly at
  // every step, so no row ever ends in empty cells.
  const narrow = useMediaQuery('(max-width: 720px)')
  const mid = useMediaQuery('(max-width: 1080px)')
  const cols = narrow ? 2 : mid ? 3 : 6
  const grid = `repeat(${cols}, minmax(0, 1fr))`

  const close = useCallback(() => onClose?.(), [onClose])

  // Save focus on open, restore it on close (clean keyboard loop).
  useEffect(() => {
    if (!open) return
    restoreRef.current = (document.activeElement as HTMLElement) ?? null
    const first = itemRefs.current.find(Boolean)
    requestAnimationFrame(() => first?.focus())
    return () => {
      restoreRef.current?.focus?.()
    }
  }, [open])

  const focusItem = useCallback((i: number) => {
    const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[]
    if (els.length === 0) return
    const idx = ((i % els.length) + els.length) % els.length
    els[idx]?.focus()
  }, [])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[]
      const cur = els.indexOf(document.activeElement as HTMLAnchorElement)
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusItem((cur < 0 ? -1 : cur) + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusItem((cur < 0 ? els.length : cur) - 1)
          break
        case 'Home':
          e.preventDefault()
          focusItem(0)
          break
        case 'End':
          e.preventDefault()
          focusItem(els.length - 1)
          break
      }
    },
    [close, focusItem]
  )

  // Apply the optional host href rewriter (docs-aware nav, etc.). Identity by
  // default, so marketing properties render the canonical ecosystem links.
  const resolve = resolveHref ?? ((h: string) => h)
  const flagship = useMemo(
    () => HANZO_FLAGSHIP.map((p) => ({ ...p, href: resolve(p.href, p.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolveHref]
  )
  // Column groups = every group except the rich flagship grid, hrefs resolved.
  const columnGroups = useMemo(
    () =>
      MEET_HANZO_GROUPS.filter((g) => g.id !== 'products').map((g) => ({
        ...g,
        items: g.items.map((it) => ({ ...it, href: resolve(it.href, it.id) })),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolveHref]
  )

  // Reset the ref list each render so indices track render order.
  itemRefs.current = []
  const register = (el: HTMLAnchorElement | null) => {
    if (el) itemRefs.current.push(el)
  }

  if (!open) return null

  return (
    <>
      {/* Click-away backdrop (transparent). */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: Z.overlay as unknown as number,
          background: 'transparent',
        }}
      />
      <div
        ref={panelRef}
        id={id}
        data-hanzo-shell=""
        role="dialog"
        aria-modal="false"
        aria-label="Meet Hanzo"
        className={className}
        onKeyDown={onKeyDown}
        style={{
          position: 'fixed',
          top: anchor,
          left: 0,
          right: 0,
          zIndex: Z.modal as unknown as number,
          boxSizing: 'border-box',
          // Flush under the header, and never taller than what is left of the
          // viewport — the panel scrolls internally rather than off the bottom.
          maxHeight: `calc(100vh - ${anchor}px)`,
          overflowY: 'auto',
          // A drape, not a card: the ONLY edge is the hairline that closes it.
          // The header already draws the hairline above.
          borderBottom: `1px solid ${CHROME.border}`,
          background: `radial-gradient(720px 260px at 50% -40%, rgba(255,255,255,0.05), transparent 70%), ${CHROME.panel}`,
          boxShadow: SHADOW,
          fontFamily: CHROME.font,
          color: CHROME.fg,
        }}
      >
        <div style={{ padding: `18px ${GUTTER}px 28px` }}>
          {/* ── Flagship products — rich cards ── */}
          <SectionLabel>Flagship products</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              gap: 10,
              marginBottom: 24,
            }}
          >
            {flagship.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                current={p.id === currentProductId}
                register={register}
                onNavigate={close}
              />
            ))}
          </div>

          {/* ── Platform / Install / Resources — link columns ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: grid,
              gap: '24px 10px',
            }}
          >
            {columnGroups.map((group) => (
              // The same 16px inset the cards carry, so a column head lands on
              // the same left edge as the product name in the tile above it.
              <div key={group.id} style={{ padding: '0 16px' }}>
                <SectionLabel>{group.title}</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {group.items.map((item) => (
                    <LinkRow
                      key={item.id}
                      link={item}
                      current={item.id === currentProductId}
                      register={register}
                      onNavigate={close}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ ...LABEL, marginBottom: 10 }}>{children}</div>
}

function ProductCard({
  product,
  current,
  register,
  onNavigate,
}: {
  product: HanzoProduct
  current: boolean
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  return (
    <a
      ref={register}
      href={product.href}
      aria-current={current ? 'true' : undefined}
      aria-label={`${product.label}: ${product.tagline}`}
      onClick={onNavigate}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        textDecoration: 'none',
        padding: '14px 16px',
        borderRadius: R.card,
        // The reveal is an OUTLINE, never a fill — the same register the
        // products drape's tiles use, so the two menus read as one surface.
        border: `1px solid ${current ? ACCENT : 'transparent'}`,
        background: 'transparent',
        color: CHROME.fg,
        outlineColor: ACCENT,
        transition: 'border-color 140ms ease',
      }}
      onMouseEnter={(e) => {
        if (!current) (e.currentTarget as HTMLElement).style.borderColor = ACCENT_SOFT
      }}
      onMouseLeave={(e) => {
        if (!current) (e.currentTarget as HTMLElement).style.borderColor = 'transparent'
      }}
    >
      {/* No eyebrow. A card that says "Use AI" above "Hanzo Chat" above "Ask
          anything" spends three lines saying one thing; the name and the
          tagline are the thing. */}
      <span
        style={{
          fontSize: FS.base,
          fontWeight: 700,
          color: current ? ACCENT : CHROME.fg,
        }}
      >
        {product.label}
      </span>
      <span style={{ fontSize: FS.sm, color: CHROME.fgMuted, lineHeight: 1.3 }}>
        {product.tagline}
      </span>
    </a>
  )
}

function LinkRow({
  link,
  current,
  register,
  onNavigate,
}: {
  link: HanzoLink
  current: boolean
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  return (
    <a
      ref={register}
      href={link.href}
      aria-current={current ? 'true' : undefined}
      onClick={onNavigate}
      style={row(current)}
      {...ghostHover(current)}
    >
      {link.label}
    </a>
  )
}
