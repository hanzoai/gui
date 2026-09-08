import React from 'react'
import type { ThemeName } from '@hanzo/gui'

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

/**
 * What a stop is worth, by name, so every family answers the same way.
 *
 * `accent` is the rung a stop STANDS FOR — the colour stored when it is picked,
 * read under the dark scheme so one value answers for both. Null names no
 * colour: the middle of the grey scale is how the axis is cleared.
 *
 * `dark` and `light` are the rungs that SHOW it: the solid step wherever it
 * clears three to one against the ground, and the next rung that does otherwise.
 * On the dark ground every stop is its solid. The light ground sits near the
 * bright end of the scale, so green and blue come down one rung and orange two —
 * 2.6:1 at its solid against 4.0:1 at its eleventh, and orange still.
 *
 * Yellow cannot come down: three to one against a ground that light needs a
 * luminance near 0.27, which is exactly where yellow stops being yellow and goes
 * olive and then brown. So yellow keeps its solid on both schemes and is drawn
 * the way the ENDS of the scale are drawn — by the ink hairline every dot
 * carries, 12:1 there. That is the rule the fill and the edge share: the fill is
 * the colour, and the edge is what makes it a chip rather than a smudge when the
 * colour and the ground are near neighbours.
 *
 * No stop paints the page ground or a section surface — those are the neutral
 * scale's on every one of the nine, and a tint that grounds a page is how yellow
 * became olive. A stop reaches the swatch, the demo, the ink and the stored
 * accent. `neutral` marks the three whose palettes are absolute rather than a
 * scheme's: white, grey and black name a colour and theme nothing, since an
 * absolute palette in an accent's place is the other scheme, not an accent.
 */
export type Stop = {
  accent: number | null
  dark: number
  light: number
  neutral?: true
}

export const STOPS: Record<string, Stop> = {
  red: { accent: 9, dark: 9, light: 9 },
  orange: { accent: 9, dark: 9, light: 11 },
  yellow: { accent: 9, dark: 9, light: 9 },
  green: { accent: 9, dark: 9, light: 10 },
  blue: { accent: 9, dark: 9, light: 10 },
  purple: { accent: 9, dark: 9, light: 9 },
  white: { accent: 1, dark: 1, light: 1, neutral: true },
  gray: { accent: null, dark: 9, light: 10, neutral: true },
  black: { accent: 1, dark: 1, light: 1, neutral: true },
}

// Every family is one length, because readers index the ramp by it.
const LENGTH = 9

const repeat = (...names: ThemeName[]): ThemeName[] =>
  Array.from({ length: LENGTH }, (_, i) => names[i % names.length]!)

export type TintFamily =
  | 'hanzogui'
  | 'xmas'
  | 'easter'
  | 'halloween'
  | 'valentine'
  | 'lunar'
  | 'stpatricks'

type Families = { [key in TintFamily]: ThemeName[] }

// The default is the spectrum with the scale's ends after it, and the grey it
// rests on between the warm half and the cool one.
const familiesValues: Families = {
  hanzogui: [
    'red',
    'orange',
    'yellow',
    'gray',
    'green',
    'blue',
    'purple',
    'white',
    'black',
  ] as ThemeName[],
  xmas: repeat('red', 'green'),
  easter: repeat('yellow'),
  halloween: repeat('yellow', 'gray'),
  valentine: repeat('red'),
  lunar: ['yellow', ...repeat('red').slice(0, LENGTH - 2), 'yellow'] as ThemeName[],
  stpatricks: repeat('green', 'yellow'),
}

/** Where the ramp rests: the stop that names no accent. */
export const NEUTRAL: number = familiesValues.hanzogui.findIndex(
  (name) => STOPS[name]?.accent === null
)

const DEFAULT_FAMILY: TintFamily = 'hanzogui'

const familiesNames = Object.keys(familiesValues) as TintFamily[]

const families = familiesValues

let fam: TintFamily = DEFAULT_FAMILY

export function getTints(): {
  name: string
  tints: ThemeName[]
  families: Families
} {
  return {
    name: fam || DEFAULT_FAMILY,
    tints: families[fam] || families.hanzogui,
    families,
  }
}

export function useTints(): {
  name: string
  tints: ThemeName[]
  families: Families
} {
  const [val, setVal] = React.useState(getTints())

  React.useEffect(() => {
    return onTintFamilyChange(() => {
      React.startTransition(() => {
        setVal(getTints())
      })
    })
  }, [])

  return val
}

export function setTintFamily(next: TintFamily): void {
  if (!families[next]) throw `impossible`
  fam = next

  // update DOM class for CSS-based styling (e.g., rainbow gradients)
  if (typeof document !== 'undefined') {
    const root = document.documentElement.classList
    // remove all season classes
    familiesNames.forEach((s) => {
      if (s !== 'hanzogui') {
        root.remove(`${s}-season`)
      }
    })
    // add the new one if not hanzogui
    if (next !== 'hanzogui') {
      root.add(`${next}-season`)
    }
  }

  React.startTransition(() => {
    listeners.forEach((l) => l(next))
  })
}

export const setNextTintFamily = (): void => {
  setTintFamily(familiesNames[(familiesNames.indexOf(fam) + 1) % familiesNames.length])
}

export const onTintFamilyChange = (cb: ChangeHandler) => {
  listeners.add(cb)
  return (): void => {
    listeners.delete(cb)
  }
}
