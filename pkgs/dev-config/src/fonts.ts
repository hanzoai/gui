import {
  createZenMonoFont,
  createZenPixelFont,
  createZenSansFont,
} from '@hanzogui/font-zen'

/**
 * Zen, and only Zen — the surface that demonstrates the design system renders in
 * the house typeface, the same one the kit binds by default.
 *
 * The pixel ROLE is worth having, so `pixelFont` fills it with Zen Pixel Square.
 * There is no display face beside these three: a role no Zen cut answers is left
 * unfilled rather than borrowed from somebody else's family.
 */

export const pixelFont = createZenPixelFont()
export const headingFont = createZenSansFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 30,
      10: 44,
    },
    // No all-caps in the house — see pkgs/core/config/src/fonts.ts. The
    // transform scale spreads down from 6, so `uppercase` here silently capsed
    // every small heading.
    transform: {
      6: 'none',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -0.1,
      10: -0.25,
      11: -0.5,
      12: -0.75,
      14: -1,
      15: -2,
    },
    // for native
    face: {
      700: { normal: 'InterBold' },
      800: { normal: 'InterBold' },
      900: { normal: 'InterBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

export const bodyFont = createZenSansFont(
  {
    weight: {
      1: '400',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.2 + (size >= 20 ? 12 : 8)),
  }
)

export const monoFont = createZenMonoFont(
  {
    weight: {
      1: '400',
    },
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 16,
      6: 18,
      7: 20,
      8: 22,
      9: 24,
      10: 32,
      11: 46,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5 + 2,
  }
)
