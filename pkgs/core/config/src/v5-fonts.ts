import type { FillInFont, GenericFont } from '@hanzogui/core'
import { createFont, getVariableValue, isWeb } from '@hanzogui/core'
import { geistMonoFamily, geistSansFamily } from '@hanzogui/font-geist'

// `isWeb` comes from the kit, which resolves the platform through the package
// `exports` map (`react-native` vs `browser`) — the same source `v4-fonts` uses.
// Reading `process.env.GUI_TARGET` here instead was only correct once something
// else had set that variable, and when unset it selected the NATIVE branch: bare
// family names that a browser cannot resolve, so the document fell back to its
// default serif.
const isNative = !isWeb

// web sizes
const webSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  true: 15,
  5: 16,
  6: 18,
  7: 22,
  8: 26,
  9: 30,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100,
} as const

// native sizes aligned with iOS HIG (SF Pro)
// 4/true = body (17pt), 3 = subheadline (15pt), 2 = caption (12pt)
const nativeSizes = {
  1: 11,
  2: 12,
  3: 15,
  4: 17,
  true: 17,
  5: 20,
  6: 22,
  7: 24,
  8: 28,
  9: 32,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100,
} as const

const defaultSizes = isNative ? nativeSizes : webSizes

// line height: native per iOS HIG (size + 5), web 150% tapering to ~142% for large sizes
const defaultLineHeight = (size: number) => {
  if (isNative) return Math.round(size + 5)
  // taper from 1.5 at small sizes to ~1.42 at 40px
  const ratio = 1.5 - Math.max(0, (size - 20) * 0.004)
  return Math.round(size * ratio)
}

export const createSystemFont = <A extends GenericFont>({
  font = {},
  sizeLineHeight = defaultLineHeight,
  sizeSize = (size) => Math.round(size),
}: {
  font?: Partial<A>
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
} = {}): FillInFont<A, keyof typeof webSizes> => {
  // merge to allow individual overrides
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isNative
      ? 'System'
      : '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: {
      1: '400',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
    size,
  })
}

// heading line height: native ~120%, web original
const headingLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.2 : size * 1.12 + 5)

// Geist is the Hanzo typeface; `@hanzogui/font-geist` is the one place it is
// described. The scale above stays as it is — a family is not a metric — so
// these bind the family and inherit every size, line height and weight.
//
// The families come from the package already resolved for the platform. Naming
// them again here would be a second source of truth, and it resolved off the
// local GUI_TARGET read below — which is only correct once something else has
// set that variable, so an unlucky module order rendered the mono face in the
// browser's default serif.
const sansFamily = geistSansFamily
const monoFamily = geistMonoFamily

export const fonts = {
  body: createSystemFont({ font: { family: sansFamily } }),
  heading: createSystemFont({
    font: {
      family: sansFamily,
      weight: {
        0: '600',
        6: '700',
        9: '800',
      },
    },
    sizeLineHeight: headingLineHeight,
  }),
  mono: createSystemFont({ font: { family: monoFamily } }),
}

export type V5Fonts = typeof fonts
