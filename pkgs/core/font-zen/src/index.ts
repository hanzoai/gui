import type { FillInFont, GenericFont } from '@hanzogui/core'
import { createFont, getVariableValue, isWeb } from '@hanzogui/core'

export type { GenericFont, FillInFont } from '@hanzogui/core'

/**
 * Zen is the Hanzo typeface: Zen for the UI, Zen Mono for anything monospaced.
 * This module is the single place either one is named — the family stacks the
 * tokens bind to, and the kit fonts built on them. An app that states a family
 * of its own is a second source of truth and will drift from the rest of the
 * fleet.
 *
 * THE BYTES COME FROM `@hanzo/font`, which ships the woff2 files and the
 * @font-face that reaches them:
 *
 *   import '@hanzo/font/css'   // once, at the app's entry
 *
 * That package owns the faces; this one owns the names the kit binds. This
 * module used to carry a second copy of the @font-face rules pointed at a
 * versioned CDN path, so the family name and the file behind it were two
 * decisions that could disagree — and for Zen they did: nothing is served under
 * that path, so every rule it emitted would have 404'd.
 */

/**
 * The two family names, exactly as `@hanzo/font` registers them.
 *
 * Everything else here is derived from these, so a stack and a native face can
 * never name the typeface differently. Spelling the name a second time anywhere
 * is how a font silently stops resolving.
 */
export const ZEN_SANS_FAMILY: string = 'Zen'
export const ZEN_MONO_FAMILY: string = 'Zen Mono'

/**
 * The UI face.
 *
 * Everything after Zen is a system face, and the list ends in `sans-serif`: a
 * font that fails to load must never leave the browser on its default, which is
 * a serif.
 */
export const zenSans: string = `"${ZEN_SANS_FAMILY}", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

/** The monospace face, ending in `monospace` for the same reason. */
export const zenMono: string = `"${ZEN_MONO_FAMILY}", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`

/** The family names as the platform resolves them: a stack on web, a registered face on native. */
export const zenSansFamily: string = isWeb ? zenSans : ZEN_SANS_FAMILY
export const zenMonoFamily: string = isWeb ? zenMono : ZEN_MONO_FAMILY

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

const createZenFont = (
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

export const createZenSansFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => Math.round(size * 1.5),
    sizeSize = (size) => size * 1,
  }: SizeOpts = {}
): FillInFont<A, keyof typeof defaultSizes> =>
  createZenFont(zenSansFamily, font, sizeLineHeight, sizeSize) as FillInFont<
    A,
    keyof typeof defaultSizes
  >

export const createZenMonoFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => Math.round(size * 1.5),
    sizeSize = (size) => size * 1,
  }: SizeOpts = {}
): FillInFont<A, keyof typeof defaultSizes> =>
  createZenFont(zenMonoFamily, font, sizeLineHeight, sizeSize) as FillInFont<
    A,
    keyof typeof defaultSizes
  >
