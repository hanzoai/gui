import type { FillInFont, GenericFont } from '@hanzogui/core'
import { createFont, getVariableValue, isWeb } from '@hanzogui/core'

export type { GenericFont, FillInFont } from '@hanzogui/core'

/**
 * Geist is the Hanzo typeface: Geist for the UI, Geist Mono for anything
 * monospaced. This module is the single place either one is described — the
 * family stacks the tokens bind to, the @font-face rules that fetch the bytes,
 * and the version those bytes are. An app that states a family of its own is a
 * second source of truth and will drift from the rest of the fleet.
 */

/**
 * The Geist release the hosted files are cut from.
 *
 * The path a version is served under is immutable, so publishing a new version
 * never invalidates a cached copy of an old one — bump this and the new files
 * appear beside the old, they do not replace them.
 */
export const GEIST_VERSION = '1.7.2'

/** The origin the fleet's fonts are served from. */
export const GEIST_CDN_ORIGIN = 'https://cdn.hanzo.ai'

/**
 * The two family names, exactly as the `@font-face` rules below register them.
 *
 * Everything else here is derived from these, so a stack, a rule and a native
 * face can never name the typeface differently. Spelling the name a second time
 * anywhere is how a font silently stops resolving.
 */
export const GEIST_SANS_FAMILY: string = 'Geist'
export const GEIST_MONO_FAMILY: string = 'Geist Mono'

/**
 * The UI face.
 *
 * Everything after Geist is a system face, and the list ends in `sans-serif`:
 * a font that fails to load must never leave the browser on its default, which
 * is a serif.
 */
export const geistSans: string = `"${GEIST_SANS_FAMILY}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

/** The monospace face, ending in `monospace` for the same reason. */
export const geistMono: string = `"${GEIST_MONO_FAMILY}", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`

/** The family names as the platform resolves them: a stack on web, a registered face on native. */
export const geistSansFamily: string = isWeb ? geistSans : GEIST_SANS_FAMILY
export const geistMonoFamily: string = isWeb ? geistMono : GEIST_MONO_FAMILY

/**
 * Where the font bytes come from.
 *
 * `cdn` is the default and is what every hosted property should use: one copy,
 * one version, one cache, shared across the fleet. `self-hosted` serves the
 * same files from the app's own origin for installs that cannot reach us —
 * an air-gapped deployment behind a bank's perimeter. The families and the
 * token names do not change between the two, only the URL, so moving between
 * them is configuration rather than a rewrite.
 */
export type GeistSource = {
  mode?: 'cdn' | 'self-hosted'
  /** Origin (cdn) or base path (self-hosted) the versioned directory hangs off. */
  base?: string
  version?: string
}

/** The directory the two woff2 files live in, for a given source. */
export function geistBaseURL({
  mode = 'cdn',
  base,
  version = GEIST_VERSION,
}: GeistSource = {}): string {
  const root = base ?? (mode === 'cdn' ? GEIST_CDN_ORIGIN : '')
  return `${root.replace(/\/$/, '')}/fonts/geist/${version}`
}

/** The two files a first paint needs, in the order it needs them. */
export function geistPreloadHrefs(
  source: GeistSource = {}
): [sans: string, mono: string] {
  const at = geistBaseURL(source)
  return [`${at}/GeistVariable.woff2`, `${at}/GeistMonoVariable.woff2`]
}

/**
 * The @font-face rules, as text.
 *
 * Returned rather than injected: a caller that must not write a <style> element
 * — a console under a strict `style-src` — puts this through the CSSOM, and a
 * caller that renders HTML can serve it as a stylesheet. Both get the same
 * bytes from the same place.
 *
 * One variable file per family covers weight 100..900, so the whole typeface is
 * two requests instead of eighteen. `font-display: swap` means text paints in a
 * fallback immediately and never goes invisible waiting on the network.
 */
export function geistFontFace(source: GeistSource = {}): string {
  const [sans, mono] = geistPreloadHrefs(source)
  return `@font-face {
  font-family: "${GEIST_SANS_FAMILY}";
  src: url("${sans}") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "${GEIST_MONO_FAMILY}";
  src: url("${mono}") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
`
}

/**
 * The custom properties the fleet's stylesheets read, bound to the two stacks.
 *
 * An app that hard-codes a family in its own CSS is a second source of truth;
 * it reads these instead and inherits whatever the kit resolves.
 */
export function geistProperties(): string {
  return `:root { --hz-font-sans: ${geistSans}; --hz-font-mono: ${geistMono}; }\n`
}

/**
 * Install the typeface into a document. This is the one way an app gets Geist.
 *
 * Both halves land together — the `@font-face` rules that fetch the bytes and
 * the properties that point at them — because either alone is a page that
 * renders in a fallback while looking correctly configured.
 *
 * Prefers a constructed stylesheet so a console under a strict `style-src` is
 * not required to allow inline styles, and falls back to a `<style>` element
 * where `adoptedStyleSheets` is unavailable. Returns false only if neither is
 * possible (a non-DOM environment), so a caller can tell installed from not.
 */
export function installGeist(
  source: GeistSource = {},
  doc: Document | undefined = typeof document === 'undefined' ? undefined : document
): boolean {
  if (!doc) return false
  const css = geistFontFace(source) + geistProperties()

  if (typeof CSSStyleSheet !== 'undefined' && 'adoptedStyleSheets' in doc) {
    try {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(css)
      doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet]
      return true
    } catch {
      // fall through to the element below
    }
  }

  const style = doc.createElement('style')
  style.setAttribute('data-hanzo-font', 'geist')
  style.textContent = css
  doc.head.appendChild(style)
  return true
}

const defaultSizes = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
} as const

const createGeistFont = (
  family: string,
  font: Partial<GenericFont>,
  sizeLineHeight: (fontSize: number) => number,
  sizeSize: (size: number) => number
) => {
  const size = Object.fromEntries(
    Object.entries({ ...defaultSizes, ...font.size }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: { 4: '400' },
    letterSpacing: { 4: 0 },
    ...(font as any),
    size,
  })
}

type SizeOpts = {
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
}

export const createGeistSansFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => Math.round(size * 1.5),
    sizeSize = (size) => size * 1,
  }: SizeOpts = {}
): FillInFont<A, keyof typeof defaultSizes> =>
  createGeistFont(geistSansFamily, font, sizeLineHeight, sizeSize) as FillInFont<
    A,
    keyof typeof defaultSizes
  >

export const createGeistMonoFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => Math.round(size * 1.5),
    sizeSize = (size) => size * 1,
  }: SizeOpts = {}
): FillInFont<A, keyof typeof defaultSizes> =>
  createGeistFont(geistMonoFamily, font, sizeLineHeight, sizeSize) as FillInFont<
    A,
    keyof typeof defaultSizes
  >
