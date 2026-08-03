/**
 * Shell chrome tokens — the ONE place the reusable Hanzo shell reads its colors,
 * type, radii, elevation and control geometry from. Every shell surface
 * (HanzoHeader, HanzoAppHeader, HanzoFooter, MeetHanzoMenu, ProductsMegaMenu,
 * AskHanzo, HanzoAppBar, HanzoAppLauncher) themes from here so they look
 * identical everywhere.
 *
 * Brand-token driven: the values reference `@hanzo/brand`'s CSS custom properties
 * (`--hanzo-*`, `--font-size-*`, `--z-*`) with self-contained fallbacks, so a
 * surface that imports `@hanzo/brand/styles/variables.css` themes automatically
 * while a surface that does not still renders correctly.
 *
 * Hanzo is MONOCHROME — true-black grounds, paper-white ink, hairline borders.
 * There is no brand hue anywhere in the chrome.
 */
import type { CSSProperties, MouseEvent } from 'react'

/** Dark-chrome palette shared by the header/footer/menu/launcher. */
export const CHROME = {
  bg: 'rgba(9,9,11,0.85)',
  /** True black — the same ground hanzo.ai and hanzo.chat paint the page with. */
  panel: '#000000',
  /** The one raised fill (inputs, cards, tiles) that sits above `panel`. */
  raised: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.09)',
  borderSoft: 'rgba(255,255,255,0.06)',
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

/** Monochrome brand accent — paper-white on dark chrome; overridable per surface. */
export const ACCENT = 'var(--hanzo-accent, #ffffff)'
export const ACCENT_SOFT = 'rgba(255,255,255,0.14)'
export const ACCENT_SOFTER = 'rgba(255,255,255,0.22)'
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

/** A floating surface: mega-menu panels, dropdowns, sheets. */
export const PANEL: CSSProperties = {
  borderRadius: R.card,
  border: `1px solid ${CHROME.border}`,
  background: CHROME.panel,
  boxShadow: SHADOW,
}

/** Ghost pill — nav triggers, nav links, sign-in, icon buttons. */
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
    background: active ? CHROME.hover : 'transparent',
    color: CHROME.fg,
    fontSize: FS.sm,
    fontWeight: 600,
    fontFamily: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease, color 120ms ease',
  }
}

/** The two-variant call-to-action, identical in header, app header and pre-footer. */
export function cta(filled: boolean, height: number = CTRL_H): CSSProperties {
  return {
    ...control(false, height),
    padding: height > CTRL_H ? '0 22px' : '0 14px',
    border: filled ? '1px solid transparent' : `1px solid ${CHROME.border}`,
    background: filled ? ACCENT : 'transparent',
    color: filled ? CHROME.panel : CHROME.fg,
    transition: 'opacity 120ms ease, background 120ms ease',
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
    background: current ? ACCENT_SOFT : 'transparent',
    color: current ? ACCENT : CHROME.fg,
    outlineColor: ACCENT,
    transition: 'background 120ms ease, color 120ms ease',
  }
}

/** Background lift on hover for any ghost control or row; inert while `active`. */
export function ghostHover(active = false, resting = 'transparent') {
  return {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      if (!active) e.currentTarget.style.background = CHROME.hover
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      if (!active) e.currentTarget.style.background = resting
    },
  }
}
