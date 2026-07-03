import type { FillInFont, GenericFont } from '@hanzogui/core'
import { createFont, getVariableValue, isWeb } from '@hanzogui/core'
import { createGeistSansFont } from '@hanzogui/font-geist-sans'
import { createGeistMonoFont } from '@hanzogui/font-geist-mono'

export const createSystemFont = <A extends GenericFont>({
  font = {},
  sizeLineHeight = (size) => size + 10,
  sizeSize = (size) => size * 1,
}: {
  font?: Partial<A>
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
} = {}): FillInFont<A, keyof typeof defaultSizes> => {
  // merge to allow individual overrides
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isWeb
      ? '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'System',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
    size,
  })
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

// Geist is the default type system (matches hanzo.ai). Body uses Geist Sans with
// its tuned 1.5 line-height; headings tighten letter-spacing at large sizes for a
// crisp, modern hierarchy; data/code use Geist Mono (tabular by construction).
// Both fall back to the system stack when the webfont has not loaded.
export const fonts = {
  body: createGeistSansFont(),
  heading: createGeistSansFont(
    { letterSpacing: { 4: 0, 8: -0.5, 9: -1, 10: -1.5, 11: -2, 12: -2.5 } as any },
    { sizeSize: (n) => n * 1.4 }
  ),
  mono: createGeistMonoFont(),
}
