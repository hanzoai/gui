import type { FillInFont, GenericFont } from '@hanzo/gui-core'
import { createFont, getVariableValue, isWeb } from '@hanzo/gui-core'

export type { GenericFont, FillInFont } from '@hanzo/gui-core'

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

export const createGeistSansFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => Math.round(size * 1.5),
    sizeSize = (size) => size * 1,
  }: {
    sizeLineHeight?: (fontSize: number) => number
    sizeSize?: (size: number) => number
  } = {}
): FillInFont<A, keyof typeof defaultSizes> => {
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isWeb
      ? '"Geist Sans", "Geist", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'Geist',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: {
      4: '400',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
    size,
  })
}
