'use client'

/**
 * MeetHanzoMenu — the universal "Meet Hanzo" mega-menu, IDENTICAL on every
 * Hanzo property. It is the one place a visitor discovers the whole ecosystem,
 * so it renders the SAME data (`MEET_HANZO_GROUPS`) everywhere:
 *
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │ Products        │ Platform      Install          Resources            │
 *   │ Hanzo Chat      │ Models        Desktop app      Documentation        │
 *   │  Ask anything   │ Enso          Browser ext.     Quickstarts          │
 *   │ Hanzo App       │ Managed …     Hanzo CLI        Learn                │
 *   │  Build and ship │ MCP tools     SDKs             Community            │
 *   │ …               │ …             …                …                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *
 * ONE dense column of products on the LEFT, everything else in the pane to its
 * RIGHT, divided by a hairline. The products are the answer to "what is Hanzo",
 * so they get their own rail and are read top-to-bottom in one pass; the link
 * groups are the answer to "how do I start", which is a different question and
 * belongs beside it rather than beneath it. This used to be six rich cards in a
 * six-track grid with the link columns under them — a full screen of chrome that
 * had to be READ, twice, before anything could be clicked.
 *
 * SMALL AND DENSE on purpose: 13px rows, 4px of row padding, one 11px line of
 * tagline per product. A navigation surface is scanned, not read.
 *
 * It is the SAME FULL-BLEED DRAPE the Products mega-menu is: edge-to-edge under
 * the header, no gutters, no radius, no outline box, closed by one hairline —
 * and its content carries the header's own 16px gutter, so the rail sits under
 * the brand mark. Both drapes are the header's own dark glass (`GLASS`)
 * continuing down the page.
 *
 * Controlled-open (props `open`/`onClose`/`anchor`) so a header can drive it;
 * also usable standalone. Self-contained: inline styles + theme.ts tokens,
 * React the only runtime dep — drops into any host with zero setup. Fully
 * keyboard-accessible: Esc closes and returns focus to the previously-focused
 * element; ↑/↓/←/→/Home/End rove the items; the current product is highlighted
 * with the accent + `aria-current`. See `useRove` for the focus contract, and
 * `useIntent` for how a hover opens it without stealing focus.
 */
import React, { useCallback, useMemo } from 'react'
import type { PointerEventHandler } from 'react'
import {
  HANZO_FLAGSHIP,
  MEET_HANZO_GROUPS,
  type HanzoLink,
  type HanzoProduct,
} from './hanzo-registry'
import {
  ACCENT,
  CHROME,
  FS,
  DRAPE,
  GUTTER,
  LABEL,
  SHADOW,
  VEIL,
  Z,
  ghostHover,
  row,
} from './theme'
import { Glyph, glyphRow } from './glyph'
import { useShellStyles } from './shellStyles'
import { useIsMobile } from './useMediaQuery'
import { useRove } from './rove'

/** The products rail. Wide enough for "Hanzo Studio" + its tagline on one line each. */
const RAIL = 236
/** A link column. Wide enough for "Browser extension" without wrapping. */
const COLUMN = 168
/**
 * The rail collapses above the pane at exactly the width the HEADER collapses to
 * its mobile sheet, so the drape and the bar that opens it never disagree about
 * which layout the viewport is in.
 */
const STACK_BELOW = 900

export interface MeetHanzoMenuProps {
  /** Controlled visibility. When false/undefined the menu renders nothing. */
  open?: boolean
  /** Called on Esc, backdrop click, or item activation. */
  onClose?: () => void
  /** px from the viewport top where the panel drops (under the header row). */
  anchor?: number
  /** Highlights the current product (accent + `aria-current`). */
  currentProductId?: string
  /** id for the panel (wire the trigger's `aria-controls` to it). */
  id?: string
  className?: string
  /**
   * Take focus on open. TRUE for a click or a keystroke — the reader asked for
   * the menu and their next key belongs to it. FALSE when a hover opened it,
   * because a pointer resting on a trigger is not a request to move the caret
   * out of whatever they were typing in. See `useIntent`.
   */
  autoFocus?: boolean
  /** Keeps a hover-opened menu open while the pointer is inside it (`useIntent`). */
  onPointerEnter?: PointerEventHandler<HTMLDivElement>
  onPointerLeave?: PointerEventHandler<HTMLDivElement>
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
  autoFocus = true,
  onPointerEnter,
  onPointerLeave,
  resolveHref,
}: MeetHanzoMenuProps) {
  useShellStyles()
  const stacked = useIsMobile(STACK_BELOW)
  const close = useCallback(() => onClose?.(), [onClose])
  const rove = useRove(!!open, close, autoFocus)

  // Apply the optional host href rewriter (docs-aware nav, etc.). Identity by
  // default, so marketing properties render the canonical ecosystem links.
  const resolve = resolveHref ?? ((h: string) => h)
  const products = useMemo(
    () => HANZO_FLAGSHIP.map((p) => ({ ...p, href: resolve(p.href, p.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolveHref]
  )
  // Column groups = every group except the products rail, hrefs resolved.
  const columns = useMemo(
    () =>
      MEET_HANZO_GROUPS.filter((g) => g.id !== 'products').map((g) => ({
        ...g,
        items: g.items.map((it) => ({ ...it, href: resolve(it.href, it.id) })),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolveHref]
  )

  if (!open) return null

  return (
    <>
      {/* Click-away catcher (transparent), starting BELOW the header.
          It must never cover the header row. This element sits above the bar
          (overlay 300 > sticky 200), so an `inset: 0` catcher slides between the
          pointer and the trigger the instant the menu opens — the trigger sees a
          `pointerleave` the reader never made, and a menu opened by hover shuts
          itself ~140ms later with the mouse still resting on it. Starting at the
          anchor leaves the header row reachable, which is also what makes
          clicking the open trigger reach the trigger and toggle it. */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          top: anchor,
          zIndex: Z.overlay as unknown as number,
          background: 'transparent',
        }}
      />
      <div
        ref={rove.ref}
        id={id}
        data-hanzo-shell=""
        role="dialog"
        aria-modal="false"
        aria-label="Meet Hanzo"
        className={className}
        onKeyDown={rove.onKeyDown}
        onFocus={rove.onFocus}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
          // The header's own glass, lifted by one hueless glow where the panel
          // meets it, so a full-bleed band still reads as a surface.
          ...DRAPE,
          background: `${VEIL}, ${DRAPE.background as string}`,
          boxShadow: SHADOW,
          fontFamily: CHROME.font,
          color: CHROME.fg,
        }}
      >
        <div
          style={{
            display: 'grid',
            // The rail is a fixed track and the pane takes the rest, so the
            // hairline between them lands in the same place at every width.
            gridTemplateColumns: stacked ? '1fr' : `${RAIL}px minmax(0, 1fr)`,
            gap: stacked ? 18 : 0,
            padding: `12px ${GUTTER} 18px`,
          }}
        >
          {/* ── Products — one dense column ── */}
          <section
            aria-label="Products"
            style={{
              paddingRight: stacked ? 0 : 22,
              borderRight: stacked ? undefined : `1px solid ${CHROME.borderSoft}`,
            }}
          >
            <SectionLabel>Products</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  current={p.id === currentProductId}
                  onNavigate={close}
                />
              ))}
            </div>
          </section>

          {/* ── Platform / Install / Resources — link columns ── */}
          <div
            style={{
              display: 'grid',
              // Fixed-width tracks, START-aligned: a link column is as wide as
              // its longest label and no wider. Stretching three columns across
              // a 1600px pane is how a dense menu turns back into a poster.
              gridTemplateColumns: stacked
                ? `repeat(auto-fit, minmax(${COLUMN}px, 1fr))`
                : `repeat(${columns.length}, ${COLUMN}px)`,
              justifyContent: 'start',
              alignContent: 'start',
              gap: '16px 24px',
              paddingLeft: stacked ? 0 : 24,
            }}
          >
            {columns.map((group) => (
              <div key={group.id}>
                <SectionLabel>{group.title}</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {group.items.map((item) => (
                    <LinkRow
                      key={item.id}
                      link={item}
                      current={item.id === currentProductId}
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
  return <div style={{ ...LABEL, marginBottom: 6 }}>{children}</div>
}

/**
 * One product in the rail: name over tagline, in the space a link row used to
 * take on its own.
 *
 * The NAME carries no colour of its own so it inherits the row's and brightens
 * with it under the pointer; the tagline states `fgDim` and therefore stays put.
 * The name is the thing being answered to, and a tagline that lit up with it
 * would make the whole rail flicker as the pointer travelled down it.
 */
function ProductRow({
  product,
  current,
  onNavigate,
}: {
  product: HanzoProduct
  current: boolean
  onNavigate: () => void
}) {
  return (
    <a
      href={product.href}
      aria-current={current ? 'true' : undefined}
      onClick={onNavigate}
      style={{
        ...row(current),
        ...glyphRow,
        padding: '4px 8px',
        lineHeight: 1.3,
        // Brighter at rest than a link row (`fgMuted`): the rail is what the
        // menu is FOR, and the groups beside it are how you act on it.
        color: current ? ACCENT : CHROME.fg,
      }}
      {...ghostHover(current, CHROME.fg)}
    >
      <Glyph name={product.glyph} />
      <span style={{ minWidth: 0 }}>
        <span style={{ fontWeight: 500 }}>{product.label}</span>
        <span
          style={{
            display: 'block',
            fontSize: FS.xs,
            fontWeight: 400,
            lineHeight: 1.25,
            color: CHROME.fgDim,
          }}
        >
          {product.tagline}
        </span>
      </span>
    </a>
  )
}

function LinkRow({
  link,
  current,
  onNavigate,
}: {
  link: HanzoLink
  current: boolean
  onNavigate: () => void
}) {
  return (
    <a
      href={link.href}
      aria-current={current ? 'true' : undefined}
      onClick={onNavigate}
      style={{ ...row(current), ...glyphRow, padding: '4px 8px' }}
      {...ghostHover(current)}
    >
      <Glyph name={link.glyph} />
      {link.label}
    </a>
  )
}
