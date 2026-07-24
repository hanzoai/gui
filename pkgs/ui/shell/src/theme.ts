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
  panel: '#0b0b0f',
  border: 'rgba(255,255,255,0.09)',
  borderSoft: 'rgba(255,255,255,0.06)',
  fg: 'rgba(255,255,255,0.92)',
  fgMuted: 'rgba(255,255,255,0.6)',
  fgDim: 'rgba(255,255,255,0.45)',
  hover: 'rgba(255,255,255,0.06)',
  font: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const

/** Monochrome brand accent — paper-white on dark chrome; overridable per surface. */
export const ACCENT = 'var(--hanzo-accent, #ffffff)'
export const ACCENT_SOFT = 'rgba(255,255,255,0.14)'
export const ACCENT_SOFTER = 'rgba(255,255,255,0.22)'
export const ACCENT_TINT = 'rgba(255,255,255,0.18)'

/** Brand font-size scale (consumes @hanzo/brand `--font-size-*`). */
export const FS = {
  xs: 'var(--font-size-xs, 0.75rem)',
  sm: 'var(--font-size-sm, 0.875rem)',
  base: 'var(--font-size-base, 1rem)',
  lg: 'var(--font-size-lg, 1.125rem)',
  xl: 'var(--font-size-xl, 1.25rem)',
  '2xl': 'var(--font-size-2xl, 1.5rem)',
} as const

/** Brand z-index ladder (consumes @hanzo/brand `--z-*`). */
export const Z = {
  sticky: 'var(--z-sticky, 200)',
  dropdown: 'var(--z-dropdown, 100)',
  overlay: 'var(--z-overlay, 300)',
  modal: 'var(--z-modal, 400)',
  popover: 'var(--z-popover, 500)',
} as const
