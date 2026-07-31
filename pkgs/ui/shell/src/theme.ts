/**
 * Shell chrome tokens — the ONE place the reusable Hanzo shell reads its colors,
 * accent, and type/z scales from. Every shell surface (HanzoHeader, HanzoAppHeader,
 * HanzoFooter, MeetHanzoMenu, AskHanzo, HanzoAppBar, HanzoAppLauncher) themes from
 * here so they look identical everywhere.
 *
 * Brand-token driven: the values reference `@hanzo/brand`'s CSS custom properties
 * (`--hanzo-*`, `--font-size-*`, `--z-*`) with self-contained fallbacks, so a
 * surface that imports `@hanzo/brand/styles/variables.css` themes automatically
 * while a surface that does not still renders correctly.
 *
 * Hanzo is MONOCHROME — there is NO brand hue (no orange, no red). On the dark
 * shell chrome the accent is paper-white (max contrast); flip it per surface with
 * `--hanzo-accent`.
 */

/** Dark-chrome palette shared by the header/footer/menu/launcher. */
export const CHROME = {
  bg: 'rgba(9,9,11,0.85)',
  // True black. This was #0b0b0f — a blue-tinted near-black that read as a
  // different surface next to the true-#000 grounds on hanzo.ai and hanzo.chat.
  panel: '#000000',
  border: 'rgba(255,255,255,0.09)',
  borderSoft: 'rgba(255,255,255,0.06)',
  fg: 'rgba(255,255,255,0.92)',
  fgMuted: 'rgba(255,255,255,0.6)',
  fgDim: 'rgba(255,255,255,0.45)',
  hover: 'rgba(255,255,255,0.06)',
  // Geist first, via the consuming app's --font-sans when it sets one.
  //
  // This constant is applied as an INLINE `fontFamily: CHROME.font` in 9 places
  // across 8 shared-chrome components, and an inline style beats the app's
  // @theme token every time. So this one line was silently overriding Geist on
  // every surface that mounts the shared chrome: hanzo.ai's whole footer (48
  // visible nodes in system font while the page above them was Geist), and
  // cloud/console's entire nav plus both mega-menus.
  //
  // The var() indirection is the point — the app stays the source of truth for
  // its own type, and the literals are only the fallback for a host that sets
  // no --font-sans.
  font: 'var(--font-sans, "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif)',
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
  base: 'var(--font-size-base, 0.875rem)', // 14px — base app text (was 16px)
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
