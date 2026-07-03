import type { FillInFont, GenericFont } from '@hanzogui/core'
import { createFont, getVariableValue, isWeb } from '@hanzogui/core'
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

// Basel Grotesk is the canonical Hanzo sans (ui/DESIGN.md §1) — Book 400 / Medium
// 500, self-hosted by each app; the token only names the family (with a system
// fallback until the webfont loads). Native uses the bundled PostScript name.
export const createBaselSansFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size: number) => Math.round(size * 1.5),
    sizeSize = (size: number) => size * 1,
  }: {
    sizeLineHeight?: (fontSize: number) => number
    sizeSize?: (size: number) => number
  } = {}
): FillInFont<A, keyof typeof defaultSizes> => {
  const size = Object.fromEntries(
    Object.entries({ ...defaultSizes, ...font.size }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isWeb
      ? '"Basel Grotesk", "Basel", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Basel Grotesk',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: { 4: '400', 7: '500' },
    letterSpacing: { 4: 0 },
    ...(font as any),
    size,
  })
}

// Canonical Hanzo type (ui/DESIGN.md §1): Basel Grotesk sans for body + heading,
// Geist Mono for code/data. Headings run Medium (500) with tightened tracking at
// large sizes. One value shared by both render engines (@hanzo/ui + @hanzo/gui).
export const fonts = {
  body: createBaselSansFont(),
  heading: createBaselSansFont(
    {
      weight: { 4: '500', 7: '500' },
      letterSpacing: { 4: 0, 8: -0.5, 9: -1, 10: -1.5, 11: -2, 12: -2.5 },
    } as any,
    { sizeSize: (n) => n * 1.4 }
  ),
  mono: createGeistMonoFont(),
}
