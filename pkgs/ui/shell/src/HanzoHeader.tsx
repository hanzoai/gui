'use client'

/**
 * HanzoHeader — the ONE public/marketing header for every Hanzo property.
 *
 *   ┌────────────────────────────────────────────────────────────────────────┐
 *   │ [H]  [Hanzo ⌄] [Products ⌄]  Models  …   ⌕⌘K  Docs  [Try Hanzo]  ●     │
 *   └────────────────────────────────────────────────────────────────────────┘
 *
 * Everything is DATA from a `HanzoSurface` (the per-domain config in
 * hanzo-registry): brand name · local nav · secondary (ghost) + primary
 * (filled) CTAs. "Hanzo ⌄" opens the universal <MeetHanzoMenu> with the
 * current product highlighted. Below 900px the local nav + the Hanzo menu
 * collapse into a single [Menu] disclosure.

 * The identity cluster is one action against Hanzo IAM and nothing else — see
 * <HanzoIdentity>. The chrome never holds a credential or a session.
 *
 * The two mega-menus open on HOVER once the pointer RESTS on a trigger, and they
 * are ONE value (`useIntent`), never a boolean each — two booleans can say "both
 * open", a state the row has no layout for. Hover never takes focus; a click, an
 * Enter or a ↓ does, and Esc closes from anywhere and hands focus back.
 *
 * SEARCH IS A HEADER CONTROL, not a menu's. The ⌕⌘K trigger sits with the CTAs
 * and opens <HanzoCommandPalette> — filter the ~97 primitives, or ask AI —
 * reachable by ⌘K from anywhere on the page, and full-screen on a phone. It
 * used to be a field buried inside the Products mega-menu, which meant the only
 * way to search products was to first open the menu you were trying to skip.
 *
 * Self-contained: inline styles + theme.ts tokens, React the only runtime dep —
 * drops into Next / Vite / vanilla hosts with zero provider/setup. Sticky, dark
 * chrome, fully keyboard-accessible.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { HanzoMark } from './mark'
import { MeetHanzoMenu } from './MeetHanzoMenu'
import { TryHanzoMenu } from './TryHanzoMenu'
import { ProductsMegaMenu } from './ProductsMegaMenu'
import {
  DEFAULT_SURFACE,
  findSurfaceByHost,
  getSurface,
  type HanzoLink,
  type HanzoNav,
  type HanzoSurface,
  type ProductCategory,
} from './hanzo-registry'
import {
  CHROME,
  CTRL_H,
  FG_ON,
  FS,
  GLASS,
  PANEL,
  R,
  SCRIM,
  SHADOW,
  TAP_H,
  Z,
  control,
  cta,
  ghostHover,
  row,
} from './theme'
import { Glyph, glyphRow, type GlyphName } from './glyph'
import { useIsMobile } from './useMediaQuery'
import { useShellStyles } from './shellStyles'
import { useIntent, type Reach } from './intent'
import { useRove } from './rove'
import {
  HanzoCommandPalette,
  HanzoCommandTrigger,
  type HanzoCommandEntry,
} from './HanzoCommandPalette'
import { HanzoIdentity, type HanzoAuth } from './HanzoIdentity'

const HEADER_H = 60
/**
 * How far a nav card hangs below the control that opened it — the control's own
 * height plus the gap the header leaves under it, so the card starts exactly on
 * the bar's bottom edge, where both drapes start.
 */
const DROP = CTRL_H + (HEADER_H - CTRL_H) / 2

/** One open menu at a time, nav cards included. */
type MenuKey = 'meet' | 'products' | 'try' | `nav:${string}`

/**
 * Drop the local-nav item that duplicates the Products hub — but only when the
 * rich Products mega-menu is present (`hasProducts`), so a surface always has
 * exactly ONE Products affordance (the `Products ⌄` trigger). Matches by id,
 * label, or a `/products` href tail.
 */
function withoutProductsDup(nav: HanzoNav[], hasProducts: boolean): HanzoNav[] {
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
  /**
   * Host-owned Ask-Hanzo affordance. When supplied, the ⌘K palette's "Ask AI"
   * mode hands it the question instead of opening Hanzo Chat, so a surface that
   * already embeds an assistant keeps the visitor on the page.
   */
  onAskHanzo?: (question: string) => void
  /**
   * Opt into the RICH ten-category Products mega-menu. When provided, a
   * "Products ⌄" trigger renders next to "Hanzo" and opens
   * <ProductsMegaMenu> over this taxonomy. Omit for the flat `localNav` header
   * (the default — fully backward compatible).
   */
  productsTaxonomy?: ProductCategory[]
  /**
   * The surface's OWN pages, docs and actions, for the ⌘K palette to find.
   *
   * The header already contributes what it renders — the local nav and both
   * CTAs — so this is for everything a header has no room to link and a reader
   * still searches by name. Without it a palette answers "no results" about
   * pages the site publishes, which is the one thing a site search may not do.
   */
  commands?: HanzoCommandEntry[]
  /**
   * What the taxonomy trigger is CALLED on this surface. The menu is the same
   * ten categories everywhere; what a visitor is looking for when they open it
   * is not. On hanzo.ai they are reading about the work, so it is "Research"; on
   * cloud.hanzo.ai they are looking at what they can run, so it is "Platform".
   * Defaults to "Products", which is what every surface said before and is still
   * right for a storefront.
   *
   * A LABEL, not a second menu: one taxonomy, one component, one place it is
   * defined. Forking the menu to rename it is how two of them drift.
   */
  productsLabel?: string
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
   * Turn the PRIMARY action into the doors menu instead of a link.
   *
   * "Try Hanzo" as one href answers a question nobody asked — a visitor wants
   * to build an app, or keep data somewhere, or chat, or code from a terminal,
   * and any single destination is wrong for most of them. With this on, the
   * pill opens <TryHanzoMenu> over the canonical `TRY_HANZO_GROUPS`; the
   * surface's `primaryCTA.href` stays the fallback the pill still carries, so
   * the control is a real link before hydration and for anyone without JS.
   *
   * DESKTOP ONLY, deliberately. The mobile sheet is ALREADY a list of doors —
   * it opens the Hanzo menu and every product category inline — so a menu in it
   * would be a menu inside a menu, and the phone's big pill would stop being
   * the one thing on the sheet that just goes somewhere. On a phone the sheet
   * is the card.
   */
  tryMenu?: boolean
  /**
   * The identity cluster: one sign-in action, or the account menu once there is
   * a session. Supplying it is what makes the cluster exist — omit it on a
   * surface that carries its own, so the header can never grow a second one.
   * `account` overrides it.
   *
   * Hanzo IAM is the only identity provider and the host owns the client, so
   * this is data and callbacks, never a session: pass the mapped `user` and
   * `@hanzo/iam`'s `startLogin` / `logout`. See <HanzoIdentity>.
   */
  auth?: HanzoAuth
  /**
   * `false` on a surface that carries no search at all.
   *
   * The header contributes what it renders (`chrome`) to the palette, so a
   * surface always has something to find and the ⌕⌘K trigger appears by
   * default.
   */
  search?: boolean
  /**
   * Open the HOST's palette instead of this one.
   *
   * The trigger is chrome and the palette is data, so a surface that knows
   * things a shared header cannot — hanzo.app holds the visitor's projects and
   * every operation the cloud answers — keeps its own palette and still wears
   * the bar's control, at both widths, in the same place as every sibling. The
   * alternative is a second search control in the identity slot, which is a
   * second design of one thing and reaches the phone only inside the sheet.
   */
  onSearch?: () => void
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
  commands,
  productsLabel = 'Products',
  currentCategoryId,
  currentHref,
  brandSlot,
  identitySlot,
  tryMenu,
  auth,
  search = true,
  onSearch,
  className,
}: HanzoHeaderProps) {
  useShellStyles()
  const s = resolveSurface(surface)
  const isMobile = useIsMobile(900)
  // ONE open mega-menu, not one boolean per menu.
  const menu = useIntent<MenuKey>()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const hasProducts = !!productsTaxonomy && productsTaxonomy.length > 0
  const home = `https://${s.host}`
  // Exactly one Products affordance: with the rich menu present, drop the
  // duplicate localNav "Products" link.
  const localNav = withoutProductsDup(s.localNav, hasProducts)
  // Standard account affordance: the surface-supplied `account`, else the
  // canonical IAM cluster, so surfaces can't drift between "Sign in" / "Log in"
  // or grow a second session scheme. Rendered ONLY when the host asked for one.
  const accountNode = account ?? (auth ? <HanzoIdentity auth={auth} /> : null)

  // What the header itself can reach, handed to the palette. A control the bar
  // renders and the palette cannot find is the same page described two ways,
  // and the header is the half that already knows the answer.
  const chrome: HanzoCommandEntry[] = React.useMemo(
    () =>
      // A nav entry that holds links contributes what it HOLDS: its own href is
      // one of them, so offering both would be one page under two names.
      // The predicate is spelled out so the compiler knows what the filter
      // proves: a surface may carry no primaryCTA, and `.filter(Boolean)` alone
      // drops the value without narrowing the type.
      [...localNav.flatMap((l) => l.items ?? [l]), s.secondaryCTA, s.primaryCTA]
        .filter((link): link is HanzoLink => Boolean(link))
        .map((link) => ({
          id: `nav/${link.id}`,
          title: link.label,
          href: link.href,
          hint: link.hint,
          group: 'Pages',
          external: /^https?:\/\//.test(link.href),
        })),
    [localNav, s.secondaryCTA, s.primaryCTA]
  )

  const searchIndex = React.useMemo(
    () => [...(commands ?? []), ...chrome],
    [commands, chrome]
  )
  // Search exists as long as there is something to find, or a host that will
  // answer for it.
  const hasSearch = search && (hasProducts || searchIndex.length > 0 || !!onSearch)

  // Close everything on Esc when a mobile sheet is open.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const closeMenu = useCallback(() => menu.set(null), [menu.set])

  // The palette is modal, so summoning it dismisses whatever was hanging open.
  const openSearch = useCallback(() => {
    setMobileOpen(false)
    menu.set(null)
    if (onSearch) onSearch()
    else setSearchOpen(true)
  }, [menu.set, onSearch])

  return (
    // The overlays are SIBLINGS of the bar, not children of it. The bar carries
    // `backdrop-filter`, and a filtered element is a containing block for every
    // `position: fixed` descendant — so a palette inside it resolves `inset: 0`
    // against a 60px-tall strip instead of the viewport, and renders as a sliver
    // clipped to the header. The mega-menus only escaped this by coincidence
    // (their `left/right: 0` happened to match the full-width bar). Keeping the
    // overlays outside makes all four correct for the same reason.
    <>
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
          // The audited bar draws NO hairline: the glass already ends itself,
          // and a white line over a blurred boundary reads as a seam between
          // two surfaces rather than the edge of one. The 1px stays so the
          // 60px box and everything measured against it do not move.
          borderBottom: '1px solid transparent',
          // The one glass recipe, shared with both mega-menu drapes so the bar
          // and the panel that drops out of it are lit as a single surface.
          ...GLASS,
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
                tight (H → Hanzo), matching the compact app-shell register. The
                current product is still named inside the Hanzo menu (highlighted)
                and by the page itself, so the wordmark here was redundant chrome. */}
            <HanzoMark size={22} />
          </a>
        )}

        {isMobile ? (
          <>
            <div style={{ flex: 1 }} />
            {hasSearch ? <HanzoCommandTrigger onOpen={openSearch} compact /> : null}
            <IconButton
              label={mobileOpen ? 'Close menu' : 'Open menu'}
              expanded={mobileOpen}
              onClick={() => {
                menu.set(null)
                setMobileOpen((v) => !v)
              }}
            >
              {mobileOpen ? <CloseGlyph /> : <MenuGlyph />}
            </IconButton>
          </>
        ) : (
          <>
            {/* ── Hanzo ⌄ ──
                The label is the NAME, not an invitation. "Meet Hanzo" reads as
                onboarding copy in a slot that is doing navigation: a reader
                already on a Hanzo surface has met us, and the menu behind it is
                the product list, which is a noun. The drape itself is unchanged
                — same groups, same rows — so this is what the trigger is called
                and nothing else. */}
            <MenuTrigger
              label="Hanzo"
              open={menu.key === 'meet'}
              reach={menu.trigger('meet')}
              onStepIn={() => menu.set('meet')}
              controls="hanzo-meet-menu"
            />

            {/* ── Products ⌄ (rich mega-menu) — only when a taxonomy is provided ── */}
            {hasProducts ? (
              <MenuTrigger
                label={productsLabel}
                open={menu.key === 'products'}
                reach={menu.trigger('products')}
                onStepIn={() => menu.set('products')}
                controls="hanzo-products-menu"
              />
            ) : null}

            {/* ── Local nav ── */}
            <nav
              aria-label={`${s.brandName} navigation`}
              style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}
            >
              {localNav.map((link) => {
                const items = link.items
                if (!items?.length) return <NavLink key={link.id} link={link} />
                const key: MenuKey = `nav:${link.id}`
                return (
                  <NavMenu
                    key={link.id}
                    link={link}
                    items={items}
                    open={menu.key === key}
                    reach={menu.trigger(key)}
                    onStepIn={() => menu.set(key)}
                    onClose={closeMenu}
                    autoFocus={!menu.hover}
                  />
                )
              })}
            </nav>

            <div style={{ flex: 1 }} />

            {/* ── ⌘K palette trigger + CTAs + identity + account ── */}
            {hasSearch ? <HanzoCommandTrigger onOpen={openSearch} /> : null}
            <CTA link={s.secondaryCTA} variant="ghost" />
            {/* A surface with no primary action renders none. */}
            {!s.primaryCTA ? null : tryMenu ? (
              <CTATrigger
                link={s.primaryCTA}
                open={menu.key === 'try'}
                reach={menu.trigger('try')}
                onStepIn={() => menu.set('try')}
                controls="hanzo-try-menu"
              />
            ) : (
              <CTA link={s.primaryCTA} variant="filled" />
            )}
            {identitySlot}
            {accountNode}
          </>
        )}
      </header>

      {/* ── Universal Meet-Hanzo mega-menu ── */}
      <MeetHanzoMenu
        id="hanzo-meet-menu"
        open={menu.key === 'meet'}
        onClose={closeMenu}
        anchor={HEADER_H}
        currentProductId={s.productId}
        autoFocus={!menu.hover}
        {...menu.panel}
      />

      {/* ── The doors, behind the primary action (opt-in via tryMenu) ── */}
      {tryMenu ? (
        <TryHanzoMenu
          id="hanzo-try-menu"
          open={menu.key === 'try'}
          onClose={closeMenu}
          anchor={HEADER_H}
          autoFocus={!menu.hover}
          {...menu.panel}
        />
      ) : null}

      {/* ── Rich Products mega-menu (opt-in via productsTaxonomy) ── */}
      {hasProducts ? (
        <ProductsMegaMenu
          id="hanzo-products-menu"
          categories={productsTaxonomy!}
          open={menu.key === 'products'}
          onClose={closeMenu}
          anchor={HEADER_H}
          currentCategoryId={currentCategoryId}
          currentHref={currentHref}
          autoFocus={!menu.hover}
          {...menu.panel}
        />
      ) : null}

      {/* The ONE place this surface is searched — from the header, at any
          width, in or out of a menu. ⌘K reaches it without the trigger, and a
          host answering `onSearch` opens its own instead of this one. */}
      {hasSearch && !onSearch ? (
        <HanzoCommandPalette
          categories={productsTaxonomy}
          commands={searchIndex}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onAsk={onAskHanzo}
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
            menu.set('meet')
          }}
        />
      ) : null}
    </>
  )
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

/**
 * A mega-menu disclosure in the header row ("Hanzo ⌄", "Products ⌄").
 *
 * Three ways in, one way out. The pointer RESTS and the menu opens without
 * taking focus (`reach`, from `useIntent`); a click or Enter/Space toggles it and
 * hands it focus; ↓ opens it and steps straight into the first item, which is
 * how a keyboard reaches a menu it can see but cannot point at.
 *
 * Focus alone does NOT open it. Tabbing across the header would otherwise drop a
 * full mega-menu on a reader who is on their way to the CTA, and then hand them
 * twenty extra tab stops to get back out of it.
 */
function MenuTrigger({
  label,
  open,
  reach,
  onStepIn,
  controls,
}: {
  label: string
  open: boolean
  /** Pointer + click props from `useIntent`. */
  reach: Reach
  /** Open and move focus into the panel (↓). */
  onStepIn: () => void
  controls: string
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowDown' || open) return
        e.preventDefault()
        onStepIn()
      }}
      style={control(open)}
      {...reach}
      {...ghostHover(open)}
    >
      {label}
      <Chevron open={open} />
    </button>
  )
}

function NavLink({ link }: { link: HanzoLink }) {
  // Hover comes from the shared token, not from here. Hand-rolling it is what
  // let this link drift from the trigger beside it (a background lift, and a
  // brightening that stopped short of white).
  return (
    <a href={link.href} style={{ ...control(), fontWeight: 500 }} {...ghostHover()}>
      {link.label}
    </a>
  )
}

/**
 * A local-nav entry that holds others — the label, and a card of its links.
 *
 * A CARD, not a drape: a handful of destinations is for CHOOSING, so it stays
 * the width of its contents and hangs off its own label, while the two menus
 * that are for READING span the bar. Same distinction the primary action makes.
 *
 * The trigger is an `<a>` carrying the entry's own `href`, not a button — the
 * markup is read before React runs, so the label is a real link at first paint
 * and for anyone without JavaScript. The click is intercepted only once there is
 * a card to show.
 *
 * The card is a CHILD of the label's box, so nothing has to measure where the
 * label is: `position: absolute`, dropped by `DROP` onto the bar's bottom edge.
 * The pointer props sit on that box rather than on the label, so crossing from
 * one to the other never leaves the menu and there is no seam to time.
 */
function NavMenu({
  link,
  items,
  open,
  reach,
  onStepIn,
  onClose,
  autoFocus,
}: {
  link: HanzoNav
  items: HanzoLink[]
  open: boolean
  reach: Reach
  onStepIn: () => void
  onClose: () => void
  autoFocus: boolean
}) {
  const { onClick, ...pointer } = reach
  const rove = useRove(open, onClose, autoFocus)
  const panel = `hanzo-nav-${link.id}`
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} {...pointer}>
      <a
        href={link.href}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panel : undefined}
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' || open) return
          e.preventDefault()
          onStepIn()
        }}
        style={{ ...control(open), fontWeight: 500, gap: 6 }}
        {...ghostHover(open)}
      >
        <Glyph name={link.glyph} />
        {link.label}
        <Chevron open={open} />
      </a>
      {open ? (
        <div
          id={panel}
          role="dialog"
          aria-label={link.label}
          ref={rove.ref}
          onKeyDown={rove.onKeyDown}
          onFocus={rove.onFocus}
          style={{
            position: 'absolute',
            top: DROP,
            // The label sits 12px into its control and a row 8px into the card,
            // so the card starts 4px right of the label's box and the two
            // columns of text line up.
            left: 4,
            zIndex: Z.dropdown as unknown as number,
            // A positioned box shrinks to fit its CONTAINING BLOCK, and this
            // card's is the label that opened it — about 90px. So every row
            // wrapped against the 180px floor while the 300px cap it was
            // supposed to grow into never applied. `max-content` is what makes
            // the card size to its widest row; the cap still holds it back.
            width: 'max-content',
            minWidth: 180,
            maxWidth: 320,
            padding: 8,
            borderRadius: R.card,
            border: `1px solid ${CHROME.border}`,
            boxShadow: SHADOW,
            // The bar's own glass, continuing — one surface, lit once.
            ...GLASS,
            color: CHROME.fg,
            // It drops out of the label that opened it, so it grows from that
            // corner rather than appearing from behind the page.
            transformOrigin: 'top left',
            animation: 'hanzo-card-in 200ms cubic-bezier(.2,.9,.3,1.1) both',
          }}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              onClick={onClose}
              style={{ ...row(), ...glyphRow, fontWeight: 500 }}
              {...ghostHover()}
            >
              <Glyph name={item.glyph} />
              <span style={{ minWidth: 0 }}>
                {item.label}
                {item.hint ? (
                  <span
                    style={{
                      display: 'block',
                      marginTop: 1,
                      fontSize: FS.xs,
                      fontWeight: 400,
                      color: CHROME.fgDim,
                    }}
                  >
                    {item.hint}
                  </span>
                ) : null}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
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
      // The filled pill dips its opacity; the ghost one is a plain link and
      // brightens like every other ghost control. Neither grows a background.
      onMouseEnter={(e) => {
        if (filled) e.currentTarget.style.opacity = '0.85'
        else e.currentTarget.style.color = FG_ON
      }}
      onMouseLeave={(e) => {
        if (filled) e.currentTarget.style.opacity = '1'
        else e.currentTarget.style.color = CHROME.fgMuted
      }}
    >
      {link.label}
    </a>
  )
}

/**
 * The primary action, opening the doors instead of taking one.
 *
 * It is an `<a>` carrying the surface's own `primaryCTA.href`, NOT a button:
 * the markup ships from a static export and is read before React runs, so the
 * pill must be a real link at first paint and for anyone who never gets the
 * JavaScript. The click is intercepted only once there is a menu to show.
 *
 * `preventDefault` on the click, and nothing else about it changes — the pill
 * keeps `cta(true)`, so "go" still looks like "go" and gains one chevron.
 */
function CTATrigger({
  link,
  open,
  reach,
  onStepIn,
  controls,
}: {
  link: HanzoLink
  open: boolean
  reach: Reach
  onStepIn: () => void
  controls: string
}) {
  const { onClick, ...pointer } = reach
  return (
    <a
      href={link.href}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowDown' || open) return
        e.preventDefault()
        onStepIn()
      }}
      style={{ ...cta(true), gap: 6 }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      {...pointer}
    >
      {link.label}
      <Chevron open={open} />
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
        data-hanzo-shell=""
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
          Hanzo
          <Chevron open={false} />
        </button>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}
        >
          {localNav.map((link) => {
            const items = link.items
            // An entry that holds links opens them in place — the same
            // disclosure the sheet already uses for the Hanzo menu and for every
            // product category, so a phone learns one gesture, not three.
            return items?.length ? (
              <MobileGroup
                key={link.id}
                group={{ ...link, items }}
                currentHref={currentHref}
                onClose={onClose}
              />
            ) : (
              <a
                key={link.id}
                href={link.href}
                onClick={onClose}
                style={{
                  ...row(),
                  ...glyphRow,
                  alignItems: 'center',
                  margin: 0,
                  padding: '0 12px',
                  minHeight: TAP_H,
                  fontSize: FS.base,
                }}
                {...ghostHover()}
              >
                <Glyph name={link.glyph} />
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Rich Products taxonomy — collapsed accordions, for BROWSING. This
            sheet used to carry a second search field over the same ~97 leaves;
            searching them now happens in exactly one place, the ⌘K palette the
            header's own glyph opens, so a phone has one answer to "where do I
            type" instead of two fields that could disagree. */}
        {hasProducts ? (
          <div
            style={{
              marginBottom: 12,
              borderTop: `1px solid ${CHROME.border}`,
              paddingTop: 12,
            }}
          >
            {productsTaxonomy!.map((category) => (
              <MobileGroup
                key={category.id}
                group={category}
                currentHref={currentHref}
                onClose={onClose}
              />
            ))}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CTA link={surface.secondaryCTA} variant="ghost" height={TAP_H} />
          {surface.primaryCTA ? (
            <CTA link={surface.primaryCTA} variant="filled" height={TAP_H} />
          ) : null}
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

/**
 * One collapsed-by-default section of the sheet — a Products category, or a
 * local-nav entry that holds links. Both are a name, the page it names, and the
 * links under it, so both open the same way.
 */
function MobileGroup({
  group,
  currentHref,
  onClose,
}: {
  group: {
    id: string
    label: string
    href: string
    items: HanzoLink[]
    glyph?: GlyphName
  }
  currentHref?: string
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const panelId = `hanzo-mgroup-${group.id}`
  // The list may already END in a link to the section's own page (hanzo.ai
  // spells it "All 15 →"). Synthesising a second one put two links to the same
  // href in one drawer, so the row is only invented when the data lacks it.
  const ownsAllLink = group.items.some((item) => item.href === group.href)
  return (
    <div style={{ borderBottom: `1px solid ${CHROME.borderSoft}` }}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={expanded ? panelId : undefined}
        style={{
          ...control(false, TAP_H),
          justifyContent: 'space-between',
          width: '100%',
          borderRadius: 0,
          fontSize: FS.base,
          gap: 8,
        }}
      >
        <span style={{ ...glyphRow, alignItems: 'center' }}>
          <Glyph name={group.glyph} />
          {group.label}
        </span>
        <Chevron open={expanded} />
      </button>
      {expanded ? (
        <div id={panelId} style={{ paddingBottom: 6 }}>
          {ownsAllLink ? null : (
            <a
              href={group.href}
              onClick={onClose}
              style={{ ...mobileLeaf(group.href === currentHref), fontWeight: 600 }}
              {...ghostHover()}
            >
              All {group.label}
            </a>
          )}
          {group.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer noopener' : undefined}
              onClick={onClose}
              style={mobileLeaf(item.href === currentHref)}
              {...ghostHover()}
            >
              <Glyph name={item.glyph} />
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
    ...glyphRow,
    alignItems: 'center',
    margin: 0,
    padding: '0 12px',
    minHeight: TAP_H,
  }
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
