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
import {
  CHROME,
  FS,
  LABEL,
  PANEL,
  R,
  SCRIM,
  TAP_H,
  Z,
  control,
  cta,
  ghostHover,
  row,
} from './theme'
import { useIsMobile } from './useMediaQuery'
import { useShellStyles } from './shellStyles'

const HEADER_H = 60

/**
 * Drop the local-nav item that duplicates the Products hub — but only when the
 * rich Products mega-menu is present (`hasProducts`), so a surface always has
 * exactly ONE Products affordance (the `Products ⌄` trigger). Matches by id,
 * label, or a `/products` href tail.
 */
function withoutProductsDup(nav: HanzoLink[], hasProducts: boolean): HanzoLink[] {
  if (!hasProducts) return nav
  // Drop ONLY the canonical Products-hub entry (the one the rich mega-menu
  // replaces) — never a legitimate deep link that merely ends in /products or
  // happens to be labelled "Products". Match the hub id, or a "Products"-labelled
  // link that also points at a /products hub (both, not either).
  return nav.filter(
    (l) =>
      !(l.id === 'products' || (l.label === 'Products' && /\/products\/?$/.test(l.href)))
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
   * Where the DEFAULT "Sign in" affordance points. Supplying it is what makes
   * that affordance exist — omit it (the default) on a surface that already
   * carries its own sign-in, e.g. one whose primary CTA IS the sign-in, so the
   * header can never grow a second, dead one. `account` overrides it.
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
  signInHref,
  className,
}: HanzoHeaderProps) {
  useShellStyles()
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
  // "Sign in" so surfaces can't drift between "Sign in" / "Log in". Rendered ONLY
  // when the host asked for one — a header must never invent a link to nowhere.
  const accountNode =
    account ?? (signInHref ? <DefaultAccount href={signInHref} /> : null)

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
          {/* Just the H mark — the product wordmark is dropped so the lockup stays
              tight (H → Meet Hanzo), matching the compact app-shell register. The
              current product is still named inside the Meet Hanzo menu (highlighted)
              and by the page itself, so the wordmark here was redundant chrome. */}
          <HanzoMark size={22} />
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
          <MenuTrigger
            ref={meetBtnRef}
            label="Meet Hanzo"
            open={meetOpen}
            onClick={toggleMeet}
            controls="hanzo-meet-menu"
          />

          {/* ── Products ⌄ (rich mega-menu) — only when a taxonomy is provided ── */}
          {hasProducts ? (
            <MenuTrigger
              ref={productsBtnRef}
              label="Products"
              open={productsOpen}
              onClick={toggleProducts}
              controls="hanzo-products-menu"
            />
          ) : null}

          {/* ── Local nav ── */}
          <nav
            aria-label={`${s.brandName} navigation`}
            style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}
          >
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

/** A mega-menu disclosure in the header row ("Meet Hanzo ⌄", "Products ⌄"). */
const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  { label: string; open: boolean; onClick: () => void; controls: string }
>(function MenuTrigger({ label, open, onClick, controls }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      style={control(open)}
      {...ghostHover(open)}
    >
      {label}
      <Chevron open={open} />
    </button>
  )
})

function NavLink({ link }: { link: HanzoLink }) {
  return (
    <a
      href={link.href}
      style={{ ...control(), fontWeight: 500, color: CHROME.fgMuted }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = CHROME.hover
        e.currentTarget.style.color = CHROME.fg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = CHROME.fgMuted
      }}
    >
      {link.label}
    </a>
  )
}

function CTA({
  link,
  variant,
  height,
}: {
  link: HanzoLink
  variant: 'ghost' | 'filled'
  height?: number
}) {
  const filled = variant === 'filled'
  return (
    <a
      href={link.href}
      style={cta(filled, height)}
      onMouseEnter={(e) => {
        if (filled) e.currentTarget.style.opacity = '0.85'
        else e.currentTarget.style.background = CHROME.hover
      }}
      onMouseLeave={(e) => {
        if (filled) e.currentTarget.style.opacity = '1'
        else e.currentTarget.style.background = 'transparent'
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
      style={{ ...control(expanded, TAP_H), width: TAP_H, padding: 0 }}
      {...ghostHover(expanded)}
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
        style={{
          position: 'fixed',
          inset: 0,
          top,
          zIndex: Z.overlay as unknown as number,
          background: SCRIM,
        }}
      />
      <div
        role="dialog"
        aria-label={`${surface.brandName} menu`}
        style={{
          ...PANEL,
          position: 'fixed',
          top,
          left: 0,
          right: 0,
          zIndex: Z.modal as unknown as number,
          maxHeight: `calc(100vh - ${top}px)`,
          overflowY: 'auto',
          padding: 12,
          borderRadius: 0,
          borderTop: 'none',
          fontFamily: CHROME.font,
        }}
      >
        <button
          type="button"
          onClick={onMeet}
          style={{
            ...cta(false, TAP_H),
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: R.card,
            fontSize: FS.base,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Meet Hanzo
          <Chevron open={false} />
        </button>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}
        >
          {localNav.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={onClose}
              style={{
                ...row(),
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                padding: '0 12px',
                minHeight: TAP_H,
                fontSize: FS.base,
              }}
              {...ghostHover()}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Rich Products taxonomy — collapsed accordions so mobile isn't an
            endless scroll (mirrors the "Meet Hanzo" collapsible pattern). */}
        {hasProducts ? (
          <div
            style={{
              marginBottom: 12,
              borderTop: `1px solid ${CHROME.border}`,
              paddingTop: 4,
            }}
          >
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
          <CTA link={surface.secondaryCTA} variant="ghost" height={TAP_H} />
          <CTA link={surface.primaryCTA} variant="filled" height={TAP_H} />
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
          ...control(false, TAP_H),
          ...LABEL,
          justifyContent: 'space-between',
          width: '100%',
          borderRadius: 0,
          color: CHROME.fg,
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
            style={{ ...mobileLeaf(category.href === currentHref), fontWeight: 600 }}
            {...ghostHover()}
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
              style={mobileLeaf(item.href === currentHref)}
              {...ghostHover()}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** One row of the mobile Products accordion. */
function mobileLeaf(current: boolean) {
  return {
    ...row(current),
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: '0 12px',
    minHeight: TAP_H,
  }
}

/**
 * Default account affordance — a text "Sign in" link styled like the shell
 * chrome, rendered when a surface asks for one via `signInHref` and supplies no
 * `account` of its own, so every surface that has it reads identically.
 */
function DefaultAccount({ href }: { href: string }) {
  return (
    <a href={href} style={control()} {...ghostHover()}>
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
      style={{
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform 150ms ease',
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

function MenuGlyph() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
