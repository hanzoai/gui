// Per-brand accent tokens — the single hue each white-label brand uses for
// accents / CTAs / focus / selection, applied SPARINGLY over the shared
// true-black neutral base. Values, not places: a brand is one data row, and
// adding a brand is one entry here — nothing else in the system hardcodes a
// brand color.
//
// Canonical anchors (verified against @luxfi/brand, @zooai/brand, pars-id):
//   hanzo  #ffffff  monochrome  (hanzo.ai white-on-black)
//   lux    #3b82f6  blue        (@luxfi/brand accent.DEFAULT)
//   zoo    #facc15  yellow      (@zooai/brand primary #FCF006)
//   pars   #d4af37  gold        (pars-id --pars-gold #D4AF37)
//
// The 12-step ramps reuse the audited Radix scales shipped in @hanzogui/colors
// (blue / yellow / gold) so no bespoke color math lives here; hanzo is a zinc
// monochrome ramp matching hanzo.ai's brand token (zinc-200 #e4e4e7).

import { blue, blueDark, gold, goldDark, yellow, yellowDark } from '@hanzogui/colors'

export type BrandName = 'hanzo' | 'lux' | 'zoo' | 'pars'

/**
 * Solid accent hue per brand. Components read this for focus rings, links and
 * the sparingly-used CTA — they never hardcode a hex.
 */
export const brandAccent = {
  hanzo: '#ffffff',
  lux: '#3b82f6',
  zoo: '#facc15',
  pars: '#d4af37',
} as const satisfies Record<BrandName, string>

export type BrandRamp = { dark: string[]; light: string[] }

// hanzo: monochrome zinc. Same ramp both schemes so `theme="hanzo"` renders a
// white surface in dark mode (white-on-black primary — the hanzo.ai signature).
const zinc = [
  '#ffffff',
  '#fafafa',
  '#f4f4f5',
  '#e4e4e7',
  '#d4d4d8',
  '#a1a1aa',
  '#71717a',
  '#52525b',
  '#3f3f46',
  '#27272a',
  '#18181b',
  '#09090b',
]

/** 12-step accent ramp per brand, consumed by the theme builder as a child theme. */
export const brandRamps = {
  hanzo: { dark: zinc, light: zinc },
  lux: { dark: Object.values(blueDark), light: Object.values(blue) },
  zoo: { dark: Object.values(yellowDark), light: Object.values(yellow) },
  pars: { dark: Object.values(goldDark), light: Object.values(gold) },
} satisfies Record<BrandName, BrandRamp>
