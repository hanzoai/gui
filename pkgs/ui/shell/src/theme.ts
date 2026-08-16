/**
 * Shell chrome tokens — the ONE place the reusable Hanzo shell reads its colors,
 * type, radii, elevation and control geometry from. Every shell surface
 * (HanzoHeader, OrgHeader, HanzoFooter, MeetHanzoMenu, ProductsMegaMenu,
 * AskHanzo, HanzoAppLauncher) themes from here so they look identical
 * everywhere.
 *
 * Token driven: the values reference CSS custom properties — `--font-size-*` and
 * `--z-*` from `@hanzo/brand`, `--neutral-*` and `--ring` from `@hanzo/design` —
 * each with a self-contained fallback, so a surface that loads those stylesheets
 * themes automatically while a surface that loads neither still renders
 * correctly. This package depends on neither on purpose, so those fallbacks are
 * load-bearing rather than decorative and have to be kept in step by hand.
 *
 * Hanzo is MONOCHROME — true-black grounds, paper-white ink, hairline borders.
 * There is no brand hue anywhere in the chrome.
 */
import type { CSSProperties, MouseEvent } from 'react'

/** Dark-chrome palette shared by the header/footer/menu/launcher. */
export const CHROME = {
  /**
   * The glass ground. 72%, not 85% — see `GLASS`: it is the ground the whole
   * material is tuned around, and `@hanzo/ui`'s says 72 over a 20px blur.
   */
  bg: 'rgba(9,9,11,0.72)',
  /** True black — the same ground hanzo.ai and hanzo.chat paint the page with. */
  panel: '#000000',
  /** The one raised fill (inputs, cards, tiles) that sits above `panel`. */
  raised: 'rgba(255,255,255,0.03)',
  /**
   * The resting edge — every hairline in the chrome, and design's value.
   *
   * `--white-10` and NOT `--border`, though design defines the latter as the
   * former. `--border` is semantic and INVERTS: dark themes give
   * `rgb(255 255 255 / .10)`, light themes `rgb(0 0 0 / .10)`. This chrome is
   * always dark, on every surface and in every host theme, so binding the edge
   * to a token that flips would draw black hairlines on a black bar the moment
   * the page around it went light. `--white-10` is a fixed rung and carries the
   * same value in both — the same reason `ACCENT` reads `--neutral-50` rather
   * than `--primary`.
   *
   * Resting only. Hover, focus and press edges stay on gui's ramp.
   */
  border: 'var(--white-10, rgb(255 255 255 / .10))',
  borderSoft: 'rgba(255,255,255,0.06)',
  /**
   * The SELECTED edge — a current app tile, a current product card, a featured
   * plan. Still a hairline. This used to be ACCENT, which then resolved to
   * literal #ffffff, so "current" was drawn as a 1px pure-white box around the
   * tile: an 11x jump from `border` and the loudest thing in the chrome. The
   * selection is already carried by ACCENT_SOFT behind it; the edge only has to
   * define the shape.
   *
   * `ACCENT_SOFTER` IS this value — the selected fill and the selected edge are
   * one rung. Move this and both move together, which is the point.
   */
  borderStrong: 'rgba(255,255,255,0.22)',
  fg: 'rgba(255,255,255,0.92)',
  fgMuted: 'rgba(255,255,255,0.6)',
  fgDim: 'rgba(255,255,255,0.45)',
  hover: 'rgba(255,255,255,0.06)',
  /**
   * Three sources, in order of how much they know.
   *
   * `--hz-font-sans` is what `@hanzogui/font-geist` publishes, so a host that
   * installs the kit's typeface gets exactly the stack the kit resolved.
   * `--font-sans` is what every host actually sets today — Tailwind emits it on
   * `:root` even unconfigured, `@hanzo/brand` defines it, and apps using
   * `next/font` point it at their own hashed family. Reading it second means the
   * chrome matches the page body instead of guessing at the family name.
   * `sans-serif` ends it, because the one thing this must never do is fall
   * through to the browser default, which is a serif.
   *
   * Applied as an inline `fontFamily`, which beats the app's @theme token, so
   * this MUST stay a var() indirection or it silently un-brands every surface
   * that mounts the shared chrome. Naming a family here instead would be a copy
   * of a stack this package cannot see, and it would drift.
   */
  font: 'var(--hz-font-sans, var(--font-sans, sans-serif))',
} as const

/**
 * Monochrome brand accent — paper-white ink on dark chrome.
 *
 * INK AND FILL ONLY. Borders use CHROME.borderStrong; focus rings use
 * FOCUS_RING. Spending this on a boundary is what once painted pure-white
 * outlines across the launcher, the product menu, the plans table, the access
 * gate and every nav link, and it is what those two tokens exist to absorb.
 *
 * A PALETTE rung, not a semantic one. `--neutral-50` is a fixed step on the
 * greyscale ramp and carries the SAME value in both themes; `--primary` and
 * `--foreground` deliberately INVERT between them. The chrome is always dark —
 * `CHROME.panel` is #000000 and every ink here is an rgba white — so a semantic
 * token would flip this ink to black the moment the HOST page went light, on
 * chrome that is still black. A rung cannot do that to us.
 *
 * #fafafa and not #ffffff on purpose: pure white on pure black is 21:1, the
 * maximum-contrast pair that exists, and at that ratio ink halates — the glyph
 * edges bloom into the ground and small text reads soft. One rung down still
 * reads as white and stops glowing.
 */
export const ACCENT = 'var(--neutral-50, #fafafa)'

/**
 * The lit state — the top of the brightness ramp, and the SAME VALUE as ACCENT.
 *
 * In a strictly monochrome system "the lit state" and "the accent" are one
 * colour, so this is an alias rather than a second opinion: two names for one
 * duty, both kept because `FG_ON` is what reads correctly at a hover call site
 * and `ACCENT` is what reads correctly at a fill. They must never drift apart,
 * which is why this is the token and not a copy of its value.
 *
 * The chrome's whole interaction language is one axis — `fgMuted` at rest,
 * `FG_ON` under the pointer — so this is the other end of `CHROME.fgMuted` and
 * the only thing a hover changes. Deliberately NOT `CHROME.fg` (0.92): a hover
 * that lands just short of the top reads as a smudge rather than a response, and
 * leaves nothing for `fg` to mean.
 */
export const FG_ON = ACCENT

/**
 * The focus ring, and the one place the shell defers to @hanzo/design: `--ring`
 * is the ONE boundary that package still gates at 3:1 against its surface in
 * both themes (WCAG 2.4.11 non-text contrast). Every other edge over there is
 * free to be a hairline; this one is not.
 *
 * It is now an ALPHA rung rather than a flat grey, so it LIFTS with whatever
 * surface it lands on instead of holding a single grey that is too dark on the
 * true-black panel and too light on a raised tile.
 *
 * The fallback is not decoration. The shell carries no dependency on
 * @hanzo/design on purpose — it has to render standalone in a host that loaded
 * nothing — so in practice the fallback is what ships, and it has to be kept in
 * step with the package by hand every time `--ring` moves.
 */
export const FOCUS_RING = 'var(--ring, rgb(255 255 255 / .40))'
export const ACCENT_SOFT = 'rgba(255,255,255,0.14)'
/**
 * The selected FILL — the same rung as the selected EDGE, which is why it is
 * literally `CHROME.borderStrong` and not a copy of its value.
 *
 * A chosen thing is one thing: the wash that marks a current tile and the
 * hairline that closes it are the same white at the same alpha, so the tile
 * reads as a single lifted plane instead of an edge and a fill that nearly
 * agree. They sat side by side under two names until now.
 */
export const ACCENT_SOFTER = CHROME.borderStrong
export const ACCENT_TINT = 'rgba(255,255,255,0.18)'

/**
 * Brand font-size scale (consumes @hanzo/brand `--font-size-*`).
 *
 * DEFAULTS ARE TIGHT — a small, dense, developer-app type scale (the linear.app /
 * vercel.com register), NOT a roomy marketing scale. Base is 14px, nav labels 13px,
 * section labels 11px. This is the Hanzo default so every shell surface reads like a
 * modern web app out of the box; a brand can still override any step via the CSS var.
 */
export const FS = {
  xs: 'var(--font-size-xs, 0.6875rem)', // 11px — section labels / eyebrows
  sm: 'var(--font-size-sm, 0.8125rem)', // 13px — nav labels, dense body
  base: 'var(--font-size-base, 0.875rem)', // 14px — base app text
  lg: 'var(--font-size-lg, 0.9375rem)', // 15px
  xl: 'var(--font-size-xl, 1.0625rem)', // 17px
  '2xl': 'var(--font-size-2xl, 1.3125rem)', // 21px
} as const

/** Brand z-index ladder (consumes @hanzo/brand `--z-*`). */
export const Z = {
  sticky: 'var(--z-sticky, 200)',
  dropdown: 'var(--z-dropdown, 100)',
  overlay: 'var(--z-overlay, 300)',
  modal: 'var(--z-modal, 400)',
  popover: 'var(--z-popover, 500)',
} as const

/** Corner radii. House rule: pill controls, rounded-xl cards, lg rows. */
export const R = { pill: 999, card: 12, row: 8 } as const

/** The ONE elevation used by everything that floats over the page. */
export const SHADOW = '0 24px 60px -16px rgba(0,0,0,0.75)'

/**
 * SHADOW turned on its side, for a surface anchored to the RIGHT edge of the
 * viewport (the AskHanzo drawer) whose shadow has to fall inward across the page
 * instead of down it. Same alpha, same blur, same spread — only the offset
 * rotates, so the drawer and the menus sit at the same elevation rather than at
 * two elevations that happen to look similar.
 */
export const SHADOW_LEFT = '-24px 0 60px -16px rgba(0,0,0,0.75)'

/**
 * The hueless glow where a full-bleed drape meets the header — one soft lift so
 * a black band on a black page still reads as a surface rather than a hole. Both
 * mega-menus carried this gradient as an identical inline copy before it lived
 * here.
 *
 * Compose it OVER the ground, never instead of it:
 *   background: `${VEIL}, ${CHROME.panel}`
 *
 * Its 0.05 is a 13th untokenized white, sitting between `CHROME.raised` (.03)
 * and `CHROME.hover` (.06) and belonging to neither — because it is not a fill
 * on a control but a gradient stop that is already fading to transparent by the
 * time it covers any area, so neither of those rungs would mean here what it
 * means there. Naming it is the whole fix: one value, one place.
 */
export const VEIL =
  'radial-gradient(720px 260px at 50% -40%, rgba(255,255,255,0.05), transparent 70%)'

/**
 * Dark glass — the ONE recipe for chrome the page shows through: near-black at
 * 72% over a 20px backdrop blur, saturated.
 *
 * The header bar and both mega-menu drapes are ONE piece of glass. A drape is
 * the bar CONTINUING down the page, not an opaque slab hung underneath it, so
 * the two must be lit the same way or the seam between them becomes an edge. The
 * drapes were true black (`CHROME.panel`) against a frosted bar, which is
 * exactly that edge.
 *
 * ── The same edge, one level up ────────────────────────────────────────────
 * It was 85% over 12px, which is the same seam between the shell and everything
 * mounted UNDER it: `@hanzo/ui`'s material — the one every dialog, popover,
 * select, dropdown and tooltip wears — is 72% over blur(20px) saturate(1.8), so
 * a menu opened from this header was visibly a different glass than the header
 * it hung off. A thicker ground with less blur reads as a slab; the same surface
 * beside a real lens reads as the cheaper of the two.
 *
 * The saturate is not decoration: a plain blur greys out whatever it averages,
 * and pushing saturation back up is what makes the blurred content still read as
 * the page rather than as fog. It is why the material looks like glass and a
 * bare `blur()` looks like frosted plastic.
 *
 * The two cannot be shared as one token. This package deliberately depends on
 * neither `@hanzo/design` nor `@hanzo/ui` — it is the frame those render
 * inside, and importing either would point the dependency the wrong way. So the
 * numbers are kept in step by hand, like every other fallback in this file.
 *
 * Compose the drapes' `VEIL` OVER this ground rather than instead of it:
 *   { ...GLASS, background: `${VEIL}, ${CHROME.bg}` }
 *
 * Caution: a backdrop-filtered element is a containing block for every
 * `position: fixed` descendant, so anything applying this must have no fixed
 * children — `inset: 0` inside one resolves against the glass, not the viewport.
 */
export const GLASS: CSSProperties = {
  background: CHROME.bg,
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
}

/**
 * The page gutter — ONE inset for the bar, every menu under it, and the page
 * content below. Stated as a clamp so it grows with the viewport instead of
 * stepping at a breakpoint: 20px on a phone, 72px on a wide desktop.
 *
 * A menu that centres itself independently of the bar is the defect this
 * prevents. Every drape reads this, so a link in an open menu sits in the same
 * column as the bar item that opened it, at every width, with nothing measured.
 */
export const GUTTER = 'clamp(20px, 4vw, 72px)'

/**
 * THE NAVIGATION PLANE — one surface for every primary menu.
 *
 * Full width, no corner radius, no outer box: a menu is the bar CONTINUING down
 * the page, so it has no edges of its own except the light on its top lip. A
 * floating card beside it reads as a different product, which is what a header
 * carrying two drapes and four anchored cards looked like.
 *
 * Translucent, so the picture behind it stays visible and the plane reads as a
 * layer over the page rather than a section of it. The inset highlight is the
 * whole trick: a 7% white line along the top lip is what makes a dark
 * translucent sheet read as glass with a lit edge instead of a hole.
 *
 * Reserve rounded, bordered chrome for COMPACT controls — search, the CTA, the
 * composer. Three surfaces in the house and no more: this plane, that compact
 * glass, and the bare page.
 */
export const DRAPE: CSSProperties = {
  background: CHROME.panel,
  borderRadius: 0,
  border: 'none',
  boxShadow: 'none',
}

/**
 * What the page does while a plane is open: it RECEDES.
 *
 * The blur belongs here, not on the plane. A translucent menu with the page
 * legible through it asks a reader to pick the words out of a moving picture;
 * the reference does the opposite — the plane is flatly opaque and everything
 * BELOW it is dimmed and thrown out of focus, so the menu is the only thing in
 * focus on the screen and the page is visibly still there underneath.
 *
 * Also the click-catcher: pointing anywhere in it closes the plane.
 */
export const UNDERVEIL: CSSProperties = {
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(24px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
}

/** Scrim behind a modal surface. */
export const SCRIM = 'rgba(0,0,0,0.45)'

/** Dense desktop control height. Touch targets are grown to 44 by shellStyles. */
export const CTRL_H = 34
/** Minimum comfortable touch target. */
export const TAP_H = 44

/**
 * The section head every menu / footer / column head shares.
 *
 * SENTENCE CASE — the house has no all-caps. Shouting a word does not rank it;
 * uppercase costs legibility (it strips the ascender/descender silhouette
 * readers match on) and reads as chrome from another era. A head earns its rank
 * from WEIGHT and BRIGHTNESS against the dimmer links beneath it, which is why
 * this is `fg` at 600 while `FooterLink`/`row` sit at `fgMuted`.
 *
 * This is the ONE place that rank is defined, so no surface has to re-derive it
 * — and none may reintroduce `textTransform: 'uppercase'` locally.
 */
export const LABEL: CSSProperties = {
  fontSize: FS.sm,
  fontWeight: 600,
  color: CHROME.fg,
}

/**
 * The chrome-menu surface: mega-menu panels, dropdowns, sheets, the account and
 * org menus, the launcher, the palette.
 *
 * CHROME IS ALWAYS DARK — on every surface, in every host theme. It is a
 * different material from page content, and the boundary is what a menu hangs
 * off: a menu attached to the bar wears this and stays dark under a light
 * theme; a menu inside the page body is content and follows the theme like
 * everything else around it.
 *
 * This is why no ground in this file reads `--background` or any other
 * semantic token — those invert between themes, and a chrome menu that
 * inverted would be a white card hanging off a black bar. Every ground here is
 * a literal, and `ACCENT`/`FOCUS_RING` are palette RUNGS that hold their value
 * in both themes.
 *
 * A consumer gets this by MOUNTING the chrome component, not by matching its
 * colour. Building a chrome-attached menu we do not ship? Spread this token —
 * never a copied hex, which is how one surface ends up a shade off from the
 * bar it hangs from.
 */
export const PANEL: CSSProperties = {
  borderRadius: R.card,
  border: `1px solid ${CHROME.border}`,
  background: CHROME.panel,
  boxShadow: SHADOW,
}

/**
 * Ghost pill — nav triggers, nav links, sign-in, icon buttons.
 *
 * Rest is DIM and the surface is FLAT. Every ghost control in the house reads
 * the same at rest, whether it opens a menu or just links out: no background,
 * no border, `fgMuted`. Brightness is the only thing that moves (see
 * `ghostHover`), so a row of nav items looks like one row instead of some items
 * volunteering that they are special. This used to be `CHROME.fg` here and
 * `fgMuted` on plain links, which is why triggers and CTAs sat visibly brighter
 * than their neighbours at rest.
 */
export function control(active = false, height: number = CTRL_H): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    flexShrink: 0,
    height,
    padding: '0 12px',
    border: 'none',
    borderRadius: R.pill,
    background: 'transparent',
    color: active ? FG_ON : CHROME.fgMuted,
    fontSize: FS.sm,
    fontWeight: 600,
    fontFamily: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 120ms ease',
  }
}

/**
 * The two-variant call-to-action, identical in header, app header and pre-footer.
 *
 * `filled` is the ONE filled element in the chrome — a single white pill, so it
 * is unambiguous where the primary action is. The ghost variant is not a
 * quieter button; it is a plain link that happens to sit in the CTA slot, so it
 * carries NO border and NO background. It used to take `1px solid CHROME.border`,
 * which is what made secondary actions like "Documentation" render as a
 * grey bordered button competing with the real CTA next to it.
 */
export function cta(filled: boolean, height: number = CTRL_H): CSSProperties {
  return {
    ...control(false, height),
    padding: height > CTRL_H ? '0 22px' : '0 14px',
    border: filled ? '1px solid transparent' : 'none',
    background: filled ? ACCENT : 'transparent',
    color: filled ? CHROME.panel : CHROME.fgMuted,
    transition: filled ? 'opacity 120ms ease' : 'color 120ms ease',
  }
}

/** A list row inside a panel: menu item, product leaf, switcher option. */
export function row(current = false): CSSProperties {
  return {
    display: 'block',
    padding: '6px 8px',
    margin: '0 -8px',
    borderRadius: R.row,
    textDecoration: 'none',
    fontSize: FS.sm,
    // Flat, like every other ghost surface. "Current" is said in brightness,
    // not in a filled chip — the one filled element in the chrome is the CTA.
    background: 'transparent',
    color: current ? ACCENT : CHROME.fgMuted,
    outlineColor: FOCUS_RING,
    transition: 'color 120ms ease',
  }
}

/**
 * Hover for any ghost control or row: the label BRIGHTENS to pure white and
 * nothing else moves. Inert while `active` (an open trigger is already lit).
 *
 * This used to lift a background (`CHROME.hover`), which is what put a grey
 * panel behind whatever the pointer touched and made the menus look like a
 * different, older product. A hover is a pointer readout, not a state change —
 * brightness alone carries it, and it composes: rows, triggers, leaves and
 * footer links all answer the pointer identically, so nothing has to re-derive
 * the rule. `resting` is the colour to fall back to, so a dimmed row and a lit
 * one each return to their own rest.
 *
 * NO background change and NO underline, ever. The one filled element in the
 * chrome is the single white pill CTA (`cta(true)`).
 */
export function ghostHover(active = false, resting: string = CHROME.fgMuted) {
  return {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      if (!active) e.currentTarget.style.color = FG_ON
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      if (!active) e.currentTarget.style.color = resting
    },
  }
}
