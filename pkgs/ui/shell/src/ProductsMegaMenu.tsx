'use client'

/**
 * ProductsMegaMenu — the RICH ten-category cloud Products mega-menu, at the
 * flagship (hanzo.ai) level of richness. It renders a `ProductCategory[]` as the
 * signature "two rows of five" cloud taxonomy, in a FULL-BLEED panel that drops
 * edge-to-edge from the header bar:
 *
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │ ◇ AI        ◇ Compute   ◇ Data      ◇ Network   ◇ Security            │
 *   │   Models      GPUs        Vector      Gateway     IAM                 │
 *   │   Agents      Machines    SQL         VPC         Authz    … item lists│
 *   │ ◇ Payments  ◇ Platform  ◇ Observe   ◇ Web3      ◇ Apps                │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *
 * The panel is a full-width DRAPE, not a floating card: no side gutters, no
 * corner radius, no outline box. Its background runs the full viewport width and
 * it closes with a single hairline bottom border, so the only edges on screen are
 * the header's own hairline above it and that one below — the register a Vercel
 * or Stripe nav uses. Its CONTENT carries the header's 16px gutter (the header is
 * itself edge-to-edge with no max-width), so the first category sits directly
 * under the brand mark and the grid ends under the CTAs.
 *
 * Each category is a TILE: a monochrome line glyph, its name, its tagline, then
 * its leaves. Hovering a tile brightens its text toward pure white and reveals a
 * hairline outline — nothing fills, nothing flips to a button. Each category
 * header links to its `/products/<slug>` landing page; each leaf links to its
 * product page. The current category (`currentCategoryId`) and the current leaf
 * (`currentHref`) are highlighted with the accent + `aria-current`.
 *
 * Leaves are LABELS ONLY. Every leaf carries a `hint` in the taxonomy and this
 * menu deliberately does not render it: ten categories x five one-line
 * descriptors is fifty lines of prose in a navigation surface, which buries the
 * names you came to click. The category tagline is the one line of explanation
 * a tile gets — the leaf's own page is where its description belongs. (The
 * `hint` still feeds the surfaces that ARE a description: the mobile sheet and
 * the category pages.)
 *
 * Controlled-open (`open`/`onClose`/`anchor`) so a header can drive it. Self-
 * contained: inline styles + theme.ts tokens, React the only runtime dep — the
 * glyphs are inlined lucide paths (ISC) rather than a dependency, so this still
 * drops into any host with zero setup. Fully keyboard-accessible: Esc closes and
 * returns focus to the trigger; ↑/↓/←/→/Home/End rove the links (category
 * headers + leaves in render order). Motion is colour/border only and is dropped
 * entirely under `prefers-reduced-motion` (see shellStyles).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { type HanzoLink, type ProductCategory } from './hanzo-registry'
import { ACCENT, ACCENT_SOFT, CHROME, FOCUS_RING, FS, R, SHADOW, VEIL, Z } from './theme'
import { useShellStyles } from './shellStyles'

/** The signature grid: ten categories as two rows of five, at every desktop width. */
const COLUMNS = 5
/** Matches the header's own `padding: 0 16px`, so the two align edge for edge. */
const GUTTER = 16

export interface ProductsMegaMenuProps {
  /** The category taxonomy to render (≈10 categories, ≈6 leaves each). */
  categories: ProductCategory[]
  /** Controlled visibility. When false/undefined the menu renders nothing. */
  open?: boolean
  /** Called on Esc, backdrop click, or item activation. */
  onClose?: () => void
  /** px from the viewport top where the panel drops (under the header row). */
  anchor?: number
  /** Highlights the current category header (accent + `aria-current`). */
  currentCategoryId?: string
  /** Highlights the current leaf whose href matches (accent + `aria-current`). */
  currentHref?: string
  /** id for the panel (wire the trigger's `aria-controls` to it). */
  id?: string
  className?: string
}

export function ProductsMegaMenu({
  categories,
  open,
  onClose,
  anchor = 60,
  currentCategoryId,
  currentHref,
  id,
  className,
}: ProductsMegaMenuProps) {
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const restoreRef = useRef<HTMLElement | null>(null)
  useShellStyles()

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
        id={id}
        data-hanzo-shell=""
        role="dialog"
        aria-modal="false"
        aria-label="Products"
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
          // The header already draws the hairline above, so drawing one here too
          // would double it.
          borderBottom: `1px solid ${CHROME.border}`,
          // True black, lifted by one hueless glow where the panel meets the
          // header, so a full-bleed black band still reads as a surface.
          background: `${VEIL}, ${CHROME.panel}`,
          boxShadow: SHADOW,
          fontFamily: CHROME.font,
          color: CHROME.fg,
        }}
      >
        {/* No "PRODUCTS" eyebrow: the trigger this panel hangs off already says
            Products, and the panel is anchored to it. Labelling it twice is the
            same word in two places. */}
        <div style={{ padding: `18px ${GUTTER}px 28px` }}>
          <div
            style={{
              display: 'grid',
              // Explicitly five, not auto-fit: the two-rows-of-five shape IS the
              // taxonomy's signature, and an auto-fit track count drifts with the
              // viewport (six columns at 1440, four at 1024) which splits the ten
              // categories into ragged rows.
              gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
              gap: '8px 4px',
              // Tiles carry their own 12px inset so their hover outline has room;
              // pulling the grid out by that much keeps the first column's TEXT
              // flush with the gutter rather than its invisible border.
              margin: '0 -12px',
            }}
          >
            {categories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                currentCategory={category.id === currentCategoryId}
                currentHref={currentHref}
                register={register}
                onNavigate={close}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function CategoryTile({
  category,
  currentCategory,
  currentHref,
  register,
  onNavigate,
}: {
  category: ProductCategory
  currentCategory: boolean
  currentHref?: string
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  // Hover lives on the TILE, not on each link, because the whole column lifts
  // together — the glyph, the name and the leaves all brighten as one.
  const [hover, setHover] = useState(false)
  const lit = hover || currentCategory

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '12px 12px 14px',
        borderRadius: R.card,
        // The reveal is an OUTLINE, never a fill: no background changes here.
        border: `1px solid ${lit ? ACCENT_SOFT : 'transparent'}`,
        transition: 'border-color 140ms ease',
      }}
    >
      {/* Category header — glyph + name, links to its /products/<slug> page. */}
      <a
        ref={register}
        href={category.href}
        aria-current={currentCategory ? 'true' : undefined}
        onClick={onNavigate}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 9,
          textDecoration: 'none',
          color: lit ? ACCENT : CHROME.fg,
          outlineColor: FOCUS_RING,
          transition: 'color 140ms ease',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 auto',
            width: 30,
            height: 30,
            borderRadius: R.row,
            border: `1px solid ${lit ? ACCENT_SOFT : CHROME.border}`,
            color: lit ? ACCENT : CHROME.fgMuted,
            transition: 'color 140ms ease, border-color 140ms ease',
          }}
        >
          <CategoryGlyph category={category} />
        </span>
        <span
          style={{
            fontSize: FS.lg,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            minWidth: 0,
          }}
        >
          {category.label}
        </span>
      </a>

      {category.tagline ? (
        <p
          title={category.tagline}
          style={{
            margin: '0 0 12px',
            fontSize: FS.xs,
            lineHeight: 1.45,
            // Levels the two rows: taglines run one to three lines, and without a
            // floor the leaf lists start at a different y in every column.
            minHeight: 32,
            color: lit ? CHROME.fgMuted : CHROME.fgDim,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 140ms ease',
          }}
        >
          {category.tagline}
        </p>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {category.items.map((item) => (
          <LeafRow
            key={item.id}
            link={item}
            current={!!currentHref && item.href === currentHref}
            tileLit={lit}
            register={register}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

function LeafRow({
  link,
  current,
  tileLit,
  register,
  onNavigate,
}: {
  link: HanzoLink
  current: boolean
  tileLit: boolean
  register: (el: HTMLAnchorElement | null) => void
  onNavigate: () => void
}) {
  const [hover, setHover] = useState(false)

  // Three steps, all colour: dim at rest, one step up while its tile is lit,
  // pure white on the leaf itself. Nothing moves and nothing fills.
  const label = hover || current ? ACCENT : tileLit ? CHROME.fg : CHROME.fgMuted

  return (
    <a
      ref={register}
      href={link.href}
      aria-current={current ? 'true' : undefined}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer noopener' : undefined}
      onClick={onNavigate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block',
        fontSize: FS.sm,
        fontWeight: 500,
        lineHeight: 1.65,
        textDecoration: 'none',
        color: label,
        outlineColor: FOCUS_RING,
        transition: 'color 120ms ease',
      }}
    >
      {link.label}
    </a>
  )
}

/* ── Category glyphs ─────────────────────────────────────────────────────── */

/**
 * One monochrome line glyph per category, keyed by category id (falling back to
 * a slugged label, then to a neutral grid).
 *
 * These are lucide paths (ISC) inlined rather than imported. The shell's whole
 * premise is that it drops into any host with React as its only runtime
 * dependency — pulling `lucide-react` in for ten static glyphs would trade that
 * for ~1500 icons the shell never renders.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  // sparkles
  ai: (
    <>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </>
  ),
  // cpu
  compute: (
    <>
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </>
  ),
  // database
  data: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </>
  ),
  // network
  network: (
    <>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </>
  ),
  // shield-check
  security: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // credit-card
  payments: (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </>
  ),
  // code-xml
  dev: (
    <>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </>
  ),
  // layers
  platform: (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  // activity
  observe: (
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  ),
  // box
  web3: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  // layout-grid
  apps: (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </>
  ),
}

function CategoryGlyph({ category }: { category: ProductCategory }) {
  const key = (category.id || category.label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[key] ?? GLYPHS.apps}
    </svg>
  )
}
