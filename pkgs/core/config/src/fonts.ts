import { createZenMonoFont, createZenSansFont } from '@hanzogui/font-zen'

/**
 * Zen, and only Zen — heading, body and mono all come off the one family, so an
 * app on the default entry renders in the house typeface and nothing else. The
 * sizes, weights, letter-spacing and transforms below are the design scale.
 *
 * `@hanzogui/font-zen` names the families; `@hanzo/font` ships the bytes.
 */
const headingFont = createZenSansFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    // The house has no all-caps. This scale used to say `6: 'uppercase'`, which
    // spreads DOWN — steps 1-6 all inherited it — so every small heading
    // (`<H6>`, menu/section heads, command-palette group heads) went silently
    // ALL CAPS from a font token no surface could see. Rank comes from weight
    // and brightness, not shouting; fixing it here fixes it everywhere at once.
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
      9: -1,
      10: -1.5,
      12: -2,
      14: -3,
      15: -4,
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const bodyFont = createZenSansFont(
  {
    weight: {
      1: '400',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 8 : 4)),
  }
)

const monoFont = createZenMonoFont(
  {
    weight: {
      1: '500',
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
      9: 30,
      10: 42,
      11: 52,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5,
  }
)

export const fonts = {
  heading: headingFont,
  body: bodyFont,
  mono: monoFont,
}
