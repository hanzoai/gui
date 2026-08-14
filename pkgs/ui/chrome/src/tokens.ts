/**
 * tokens — the monochrome zinc-on-black design tokens for the Hanzo public
 * chrome, ported 1:1 from the canonical hanzo.ai landing (which expresses them
 * as Tailwind `neutral` classes). This is the SINGLE SOURCE OF TRUTH for the
 * chrome palette.
 *
 * Why a local palette instead of `$background` / `$color` theme tokens? The
 * chrome is the ONE unified header/footer every Hanzo surface adopts, so it must
 * render identically regardless of the host app's active Gui theme (light, dark,
 * brand-tinted, …). It commits to the marketing look — dark, monochrome — and
 * references these values as literals inside `styled()`, which the Gui
 * compiler still flattens to atomic CSS.
 */

import { geistSans } from '@hanzogui/font-geist'

/** Raw neutral scale (Tailwind `neutral-*`) + the two poles. */
export const palette = {
  black: '#000000',
  n950: '#0a0a0a',
  n900: '#171717',
  n800: '#262626',
  n700: '#404040',
  n600: '#525252',
  n500: '#737373',
  n400: '#a3a3a3',
  n300: '#d4d4d4',
  n200: '#e5e5e5',
  n100: '#f5f5f5',
  white: '#ffffff',
} as const

/** Semantic aliases (the meaning, not the place) — what components actually reference. */
export const c = {
  /** Page/base surface. */
  bg: palette.black,
  /** Translucent bar over content (header `bg-black/70`). */
  barBg: 'rgba(0,0,0,0.7)',
  /** Raised surface (dropdown/panel, `bg-neutral-950/95`). */
  surface: 'rgba(10,10,10,0.95)',
  /** Composer field (`bg-neutral-900/70`). */
  field: 'rgba(23,23,23,0.7)',
  /** Hover wash (`hover:bg-neutral-900`). */
  hover: palette.n900,
  /** Faint fill (pill `bg-neutral-900/50`). */
  fill: 'rgba(23,23,23,0.5)',

  /** Hairline (`border-neutral-800`) + its translucent header variant. */
  line: palette.n800,
  lineBar: 'rgba(38,38,38,0.8)',
  /** Footer/section hairline (`border-neutral-900`). */
  lineSoft: palette.n900,
  /** Field border + its hover/focus stops. */
  fieldLine: palette.n700,
  fieldLineHover: palette.n500,

  /** Primary text. */
  fg: palette.white,
  /** High-contrast body (`text-neutral-100`). */
  fgStrong: palette.n100,
  /** Menu/mobile body (`text-neutral-200`). */
  fgBody: palette.n200,
  /** Default nav text (`text-neutral-300`). */
  fgMuted: palette.n300,
  /** Footer links (`text-neutral-400`). */
  fgLink: palette.n400,
  /** Icon default (`text-neutral-400`). */
  icon: palette.n400,
  /** Labels / descriptions / dim icons (`text-neutral-500`). */
  fgDim: palette.n500,
  /** Faintest label (`text-neutral-600`). */
  fgFaint: palette.n600,

  /** Inverted CTA. */
  ctaBg: palette.white,
  ctaFg: palette.black,
} as const

/**
 * Geist, as the rest of the fleet spells it.
 *
 * Re-exported rather than restated: this used to carry its own copy of the
 * stack, which is how a chrome ends up one fallback out of step with the app it
 * frames. `@hanzogui/font-geist` also carries the @font-face rules that fetch
 * the bytes, so naming the family and loading it are no longer separate
 * decisions a host can get half-right.
 */
export const FONT: string = geistSans

/** The ambient radial-gradient glow behind the hero (matches the site's 640px, blur-120, 16% white). */
export const HERO_GLOW = 'radial-gradient(circle, #ffffff 0%, transparent 70%)'

/** Desktop breakpoint (Tailwind `lg`) — the header flips to the mega-menu at/above this. */
export const LG = 1024
/** Small breakpoint (Tailwind `sm`) — search + login controls appear at/above this. */
export const SM = 640
