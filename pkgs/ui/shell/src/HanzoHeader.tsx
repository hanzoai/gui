'use client'

/**
 * HanzoHeader — the ONE public/marketing header for every Hanzo property.
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │ [H Hanzo Chat]  [Meet Hanzo ⌄]  Product  Models  …    Docs  [New chat] ● │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * Everything is DATA from a `HanzoSurface` (the per-domain config in
 * hanzo-registry): brand name · local nav · secondary (ghost) + primary
 * (filled) CTAs. "Meet Hanzo ⌄" opens the universal <MeetHanzoMenu> with the
 * current product highlighted. Below 900px the local nav + Meet-Hanzo collapse
 * into a single [Menu] disclosure.
 *
 * Self-contained: inline styles + theme.ts tokens, React the only runtime dep —
 * drops into Next / Vite / vanilla hosts with zero provider/setup. Sticky, dark
 * chrome, fully keyboard-accessible.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HanzoMark } from './mark'
import { MeetHanzoMenu } from './MeetHanzoMenu'
import { ProductsMegaMenu } from './ProductsMegaMenu'
import {
  DEFAULT_SURFACE,
  findSurfaceByHost,
  getSurface,
  type HanzoLink,
  type HanzoSurface,
  type ProductCategory,
} from './hanzo-registry'
import { ACCENT, CHROME, FS, Z } from './theme'
import { useIsMobile } from './useMediaQuery'
import { useShellFocusRing } from './focusRing'

const HEADER_H = 60

/**
 * Drop the local-nav item that duplicates the Products hub — but only when the
 * rich Products mega-menu is present (`hasProducts`), so a surface always has
 * exactly ONE Products affordance (the `Products ⌄` trigger). Matches by id,
 * label, or a `/products` href tail.
 */
function withoutProductsDup(nav: HanzoLink[], hasProducts: boolean): HanzoLink[] {
  if (!hasProducts) return nav
  return nav.filter(
    (l) => !(l.id === 'products' || l.label === 'Products' || /\/products\/?$/.test(l.href)),
  )
}

export interface HanzoHeaderProps {
  /** A `HanzoSurface`, or a surface id / hostname to resolve one. */
  surface: HanzoSurface | string
  /** Signed-in account control rendered at the far right (avatar/menu). */
  account?: React.ReactNode
  /** Opens the caller's Ask-Hanzo affordance (used by the mobile search button). */
  onAskHanzo?: () => void
  /**
   * Opt into the RICH ten-category Products mega-menu. When provided, a
   * "Products ⌄" trigger renders next to "Meet Hanzo" and opens
   * <ProductsMegaMenu> over this taxonomy. Omit for the flat `localNav` header
   * (the default — fully backward compatible).
   */
  productsTaxonomy?: ProductCategory[]
  /** Highlights the current Products category (accent + `aria-current`). */
  currentCategoryId?: string
  /** Highlights the current Products leaf whose href matches. */
  currentHref?: string
  /**
   * Custom brand block (a surface's own wordmark/logo) rendered in place of the
   * default mark + brand name. Own its own home link. Omit for the default.
   */
  brandSlot?: React.ReactNode
  /**
   * Custom identity control (sign-in / account menu) rendered at the far right,
   * before `account`. A richer alternative to `account`.
   */
  identitySlot?: React.ReactNode
  /**
   * Destination for the DEFAULT "Sign in" affordance rendered when `account`
   * is omitted (so surfaces don't diverge between "Sign in" / "Log in"). The
   * `account` prop always overrides it. Defaults to `#`.
   */
  signInHref?: string
  className?: string
}

/** Resolve a surface from an object, an id, or a hostname. */
export function resolveSurface(surface: HanzoSurface | string): HanzoSurface {
  if (typeof surface !== 'string') return surface
  return getSurface(surface) ?? findSurfaceByHost(surface) ?? DEFAULT_SURFACE
}

export function HanzoHeader({
  surface,
  account,
  onAskHanzo,
  productsTaxonomy,
  currentCategoryId,
  currentHref,
  brandSlot,
  identitySlot,
  signInHref = '#',
  className,
}: HanzoHeaderProps) {
  useShellFocusRing()
  const s = resolveSurface(surface)
  const isMobile = useIsMobile(900)
  const [meetOpen, setMeetOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const meetBtnRef = useRef<HTMLButtonElement>(null)
  const productsBtnRef = useRef<HTMLButtonElement>(null)

  const hasProducts = !!productsTaxonomy && productsTaxonomy.length > 0
  const home = `https://${s.host}`
  // Exactly one Products affordance: with the rich menu present, drop the
  // duplicate localNav "Products" link.
  const localNav = withoutProductsDup(s.localNav, hasProducts)
  // Standard account affordance: the surface-supplied `account`, else a default
  // "Sign in" so surfaces can't drift between "Sign in" / "Log in".
  const accountNode = account ?? <DefaultAccount href={signInHref} />

  // Close everything on Esc when a mobile sheet is open.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // The two mega-menus are mutually exclusive; either closes the mobile sheet.
  const toggleMeet = useCallback(() => {
    setMobileOpen(false)
    setProductsOpen(false)
    setMeetOpen((v) => !v)
  }, [])

  const toggleProducts = useCallback(() => {
    setMobileOpen(false)
    setMeetOpen(false)
    setProductsOpen((v) => !v)
  }, [])

  return (
    <header
      role="banner"
      data-hanzo-shell=""
      className={className}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: Z.sticky as unknown as number,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: HEADER_H,
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
      {/* ── Brand (surface-supplied wordmark, or the default mark + name) ── */}
      {brandSlot ?? (
        <a
          href={home}
          aria-label={s.brandName}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            flexShrink: 0,
            textDecoration: 'none',
            color: CHROME.fg,
          }}
        >
          <HanzoMark size={24} />
          <span style={{ fontSize: FS.base, fontWeight: 800, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>
            {s.brandName}
          </span>
        </a>
      )}

      {isMobile ? (
        <>
          <div style={{ flex: 1 }} />
          <IconButton label="Search" onClick={() => onAskHanzo?.()}>
            <SearchGlyph />
          </IconButton>
          <IconButton
            label={mobileOpen ? 'Close menu' : 'Open menu'}
            expanded={mobileOpen}
            onClick={() => {
              setMeetOpen(false)
              setMobileOpen((v) => !v)
            }}
          >
            {mobileOpen ? <CloseGlyph /> : <MenuGlyph />}
          </IconButton>
        </>
      ) : (
        <>
          {/* ── Meet Hanzo ⌄ ── */}
          <button
            ref={meetBtnRef}
            type="button"
            onClick={toggleMeet}
            aria-haspopup="dialog"
            aria-expanded={meetOpen}
            aria-controls={meetOpen ? 'hanzo-meet-menu' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              flexShrink: 0,
              height: 34,
              padding: '0 10px',
              border: 'none',
              borderRadius: 9,
              background: meetOpen ? CHROME.hover : 'transparent',
              color: CHROME.fg,
              fontSize: FS.sm,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => {
              if (!meetOpen) (e.currentTarget as HTMLElement).style.background = CHROME.hover
            }}
            onMouseLeave={(e) => {
              if (!meetOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            Meet Hanzo
            <Chevron open={meetOpen} />
          </button>

          {/* ── Products ⌄ (rich mega-menu) — only when a taxonomy is provided ── */}
          {hasProducts ? (
            <button
              ref={productsBtnRef}
              type="button"
              onClick={toggleProducts}
              aria-haspopup="dialog"
              aria-expanded={productsOpen}
              aria-controls={productsOpen ? 'hanzo-products-menu' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
                height: 34,
                padding: '0 10px',
                border: 'none',
                borderRadius: 9,
                background: productsOpen ? CHROME.hover : 'transparent',
                color: CHROME.fg,
                fontSize: FS.sm,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background 120ms ease',
              }}
              onMouseEnter={(e) => {
                if (!productsOpen) (e.currentTarget as HTMLElement).style.background = CHROME.hover
              }}
              onMouseLeave={(e) => {
                if (!productsOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              Products
              <Chevron open={productsOpen} />
            </button>
          ) : null}

          {/* ── Local nav ── */}
          <nav aria-label={`${s.brandName} navigation`} style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            {localNav.map((link) => (
              <NavLink key={link.id} link={link} />
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* ── CTAs + identity + account ── */}
          <CTA link={s.secondaryCTA} variant="ghost" />
          <CTA link={s.primaryCTA} variant="filled" />
          {identitySlot}
          {accountNode}
        </>
      )}

      {/* ── Universal Meet-Hanzo mega-menu ── */}
      <MeetHanzoMenu
        id="hanzo-meet-menu"
        open={meetOpen}
        onClose={() => setMeetOpen(false)}
        anchor={HEADER_H}
        currentProductId={s.productId}
      />

      {/* ── Rich Products mega-menu (opt-in via productsTaxonomy) ── */}
      {hasProducts ? (
        <ProductsMegaMenu
          id="hanzo-products-menu"
          categories={productsTaxonomy!}
          open={productsOpen}
          onClose={() => setProductsOpen(false)}
          anchor={HEADER_H}
          currentCategoryId={currentCategoryId}
          currentHref={currentHref}
        />
      ) : null}

      {/* ── Mobile disclosure sheet ── */}
      {isMobile && mobileOpen ? (
        <MobileSheet
          surface={s}
          account={accountNode}
          identity={identitySlot}
          productsTaxonomy={hasProducts ? productsTaxonomy : undefined}
          currentHref={currentHref}
          top={HEADER_H}
          onClose={() => setMobileOpen(false)}
          onMeet={() => {
            setMobileOpen(false)
            setMeetOpen(true)
          }}
        />
      ) : null}
    </header>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function NavLink({ link }: { link: HanzoLink }) {
  return (
    <a
      href={link.href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 34,
        padding: '0 10px',
        borderRadius: 9,
        textDecoration: 'none',
        fontSize: FS.sm,
        fontWeight: 500,
        color: CHROME.fgMuted,
        whiteSpace: 'nowrap',
        transition: 'background 120ms ease, color 120ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = CHROME.hover
        el.style.color = CHROME.fg
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = 'transparent'
        el.style.color = CHROME.fgMuted
      }}
    >
      {link.label}
    </a>
  )
}

function CTA({ link, variant }: { link: HanzoLink; variant: 'ghost' | 'filled' }) {
  const filled = variant === 'filled'
  return (
    <a
      href={link.href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        height: 34,
        padding: '0 14px',
        borderRadius: 9,
        textDecoration: 'none',
        fontSize: FS.sm,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: filled ? '1px solid transparent' : `1px solid ${CHROME.border}`,
        background: filled ? ACCENT : 'transparent',
        color: filled ? '#0b0b0f' : CHROME.fg,
        transition: 'opacity 120ms ease, background 120ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        if (filled) el.style.opacity = '0.85'
        else el.style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        if (filled) el.style.opacity = '1'
        else el.style.background = 'transparent'
      }}
    >
      {link.label}
    </a>
  )
}

function IconButton({
  label,
  children,
  onClick,
  expanded,
}: {
  label: string
  children: React.ReactNode
  onClick: () => void
  expanded?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        flexShrink: 0,
        border: 'none',
        borderRadius: 9,
        background: expanded ? CHROME.hover : 'transparent',
        color: CHROME.fg,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function MobileSheet({
  surface,
  account,
  identity,
  productsTaxonomy,
  currentHref,
  top,
  onClose,
  onMeet,
}: {
  surface: HanzoSurface
  account?: React.ReactNode
  identity?: React.ReactNode
  productsTaxonomy?: ProductCategory[]
  currentHref?: string
  top: number
  onClose: () => void
  onMeet: () => void
}) {
  const hasProducts = !!productsTaxonomy && productsTaxonomy.length > 0
  const localNav = withoutProductsDup(surface.localNav, hasProducts)
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, top, zIndex: Z.overlay as unknown as number, background: 'rgba(0,0,0,0.4)' }}
      />
      <div
        role="dialog"
        aria-label={`${surface.brandName} menu`}
        style={{
          position: 'fixed',
          top,
          left: 0,
          right: 0,
          zIndex: Z.modal as unknown as number,
          maxHeight: `calc(100vh - ${top}px)`,
          overflowY: 'auto',
          padding: 12,
          background: CHROME.panel,
          borderBottom: `1px solid ${CHROME.border}`,
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.7)',
          fontFamily: CHROME.font,
        }}
      >
        <button
          type="button"
          onClick={onMeet}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 12px',
            border: `1px solid ${CHROME.border}`,
            borderRadius: 12,
            background: 'transparent',
            color: CHROME.fg,
            fontSize: FS.base,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Meet Hanzo
          <Chevron open={false} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
          {localNav.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={onClose}
              style={{
                display: 'block',
                padding: '11px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: FS.base,
                color: CHROME.fg,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Rich Products taxonomy — collapsed accordions so mobile isn't an
            endless scroll (mirrors the "Meet Hanzo" collapsible pattern). */}
        {hasProducts ? (
          <div style={{ marginBottom: 12, borderTop: `1px solid ${CHROME.border}`, paddingTop: 4 }}>
            {productsTaxonomy!.map((category) => (
              <MobileProductsCategory
                key={category.id}
                category={category}
                currentHref={currentHref}
                onClose={onClose}
              />
            ))}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CTA link={surface.secondaryCTA} variant="ghost" />
          <CTA link={surface.primaryCTA} variant="filled" />
        </div>

        {/* Identity + account controls (Sign In / avatar) stay reachable on mobile. */}
        {identity || account ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              paddingTop: 12,
              borderTop: `1px solid ${CHROME.border}`,
            }}
          >
            {identity}
            {account}
          </div>
        ) : null}
      </div>
    </>
  )
}

/** One collapsed-by-default Products category (mobile accordion section). */
function MobileProductsCategory({
  category,
  currentHref,
  onClose,
}: {
  category: ProductCategory
  currentHref?: string
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = `hanzo-mprod-${category.id}`
  return (
    <div style={{ borderBottom: `1px solid ${CHROME.borderSoft}` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px',
          border: 'none',
          background: 'transparent',
          color: CHROME.fg,
          fontSize: FS.sm,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        {category.label}
        <Chevron open={open} />
      </button>
      {open ? (
        <div id={panelId} style={{ paddingBottom: 6 }}>
          <a
            href={category.href}
            onClick={onClose}
            style={{
              display: 'block',
              padding: '9px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: FS.sm,
              fontWeight: 600,
              color: category.href === currentHref ? ACCENT : CHROME.fg,
            }}
          >
            All {category.label}
          </a>
          {category.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer noopener' : undefined}
              onClick={onClose}
              style={{
                display: 'block',
                padding: '9px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: FS.sm,
                color: item.href === currentHref ? ACCENT : CHROME.fgMuted,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Default account affordance — a text "Sign in" link styled like the shell
 * chrome, rendered when `account` is omitted so every surface reads identically.
 */
function DefaultAccount({ href }: { href: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        height: 34,
        padding: '0 10px',
        borderRadius: 9,
        textDecoration: 'none',
        fontSize: FS.sm,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: CHROME.fg,
        transition: 'background 120ms ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      Sign in
    </a>
  )
}

/* ── Glyphs ──────────────────────────────────────────────────────────────── */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function MenuGlyph() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
