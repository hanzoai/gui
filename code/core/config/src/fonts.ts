import { createGeistSansFont } from '@hanzo/gui-font-geist-sans'
import { createGeistMonoFont } from '@hanzo/gui-font-geist-mono'

const headingFont = createGeistSansFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
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
    face: {
      700: { normal: 'GeistBold' },
      800: { normal: 'GeistBold' },
      900: { normal: 'GeistBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const bodyFont = createGeistSansFont(
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

const monoFont = createGeistMonoFont(
  {
    weight: {
      1: '500',
    },
  },
  {
    sizeLineHeight: (x) => Math.round(x * 1.5),
  }
)

export const fonts = {
  heading: headingFont,
  body: bodyFont,
  mono: monoFont,
}
