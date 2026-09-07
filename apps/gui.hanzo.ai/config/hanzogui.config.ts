import { fontWeight } from '@hanzo/tokens'
import { createFont, createGui } from '@hanzo/gui'
import { config } from '@hanzogui/dev-config'
import { zenMonoFamily, zenPixelFamily, zenSansFamily } from '@hanzogui/font-zen'

// Type sits on @hanzo/design's ramp. Every `fontSize="$n"` resolves through
// `var(--text-*)`, the rungs design multiplies by `--type-scale` and
// `--type-ratio`, so the appearance knobs retune this site the way they retune
// hanzo.ai. The px fallback is the ramp at scale 1 and is what gui reads where
// it needs a number. $5 is the reading size and $10 the second heading — 18px
// and 48px, hanzo.ai's body and h2 — set between rungs the way @hanzo/ui sets
// its own.
const rung = (name: string, px: number) => `var(--text-${name}, ${px}px)`
const between = (a: string, b: string, at: number) => `calc(${a} + (${b} - ${a}) * ${at})`

const xs = rung('xs', 11)
const sm = rung('sm', 13)
const base = rung('base', 14)
const lg = rung('lg', 15)
const xl = rung('xl', 17)
const xl2 = rung('2xl', 21)
const xl3 = rung('3xl', 26)
const xl4 = rung('4xl', 32)
const xl5 = rung('5xl', 40)
const xl6 = rung('6xl', 52)
const xl7 = rung('7xl', 64)
const xl8 = rung('8xl', 84)
const xl9 = rung('9xl', 112)

const SIZE = {
  1: xs,
  2: sm,
  3: base,
  4: lg,
  5: between(xl, xl2, 0.25),
  6: xl2,
  7: xl3,
  8: xl4,
  9: xl5,
  10: between(xl5, xl6, 2 / 3),
  11: xl7,
  12: xl8,
  13: xl9,
  14: `calc(${xl9} * 1.2)`,
  15: `calc(${xl9} * 1.45)`,
  16: `calc(${xl9} * 1.7)`,
  true: base,
}

type Rung = keyof typeof SIZE
type Scale<T> = Record<Rung, T>

// Leading in em so it follows the rung whatever the knobs do to it: 1.6 for
// reading sizes, tightening as type grows, as measured on hanzo.ai.
const LEADING = {
  1: '1.55em',
  2: '1.55em',
  3: '1.6em',
  4: '1.6em',
  5: '1.6em',
  6: '1.6em',
  7: '1.35em',
  8: '1.35em',
  9: '1.19em',
  10: '1.19em',
  11: '1.19em',
  12: '1.05em',
  13: '1.05em',
  14: '1.05em',
  15: '1.05em',
  16: '1.05em',
  true: '1.6em',
}

// Optical tracking: a text face carries too much sidebearing once enlarged.
const TRACKING = Object.fromEntries(
  Object.keys(SIZE).map((k) => [k, Number(k) >= 7 ? '-0.025em' : 0])
)

const face = (family: string, weight: string) =>
  createFont({
    family,
    size: SIZE as unknown as Scale<number>,
    lineHeight: LEADING as unknown as Scale<number>,
    letterSpacing: TRACKING as unknown as Scale<number>,
    weight: { 1: weight },
  })

const tamaConf = createGui({
  ...config,
  // A reader who asked for less motion. Design's motion tokens already zero
  // every CSS duration; this is how a component turns its own driver off.
  media: { ...config.media, reduceMotion: { prefersReducedMotion: 'reduce' } },
  fonts: {
    heading: face(zenSansFamily, fontWeight.normal),
    body: face(zenSansFamily, '400'),
    mono: face(zenMonoFamily, '400'),
    pixel: face(zenPixelFamily, '500'),
  },
})

export type Conf = typeof tamaConf

declare module '@hanzo/gui' {
  interface GuiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'content' | 'item'
  }
}

export default tamaConf
