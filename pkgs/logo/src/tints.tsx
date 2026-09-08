import React from 'react'
import type { ThemeName } from '@hanzo/gui'

type ChangeHandler = (next: TintFamily) => void

const listeners = new Set<ChangeHandler>()

// A ramp of tint stops; every reader indexes by `tints.length`, and `NEUTRAL`
// is the notch the chrome rests on while the landing sections cycle.
//
// The default sweeps one arc of the wheel — red 358, pink 322, violet 272,
// then blue 206, teal 173, green 151 — so the stops read as a ramp rather
// than a bag of hues, and every one is measured against both grounds at its
// solid step: the dimmest is violet at 3.63:1 on dark and blue at 3.16:1 on
// light. Yellow and orange are absent from it because neither clears 3:1 on
// the light ground at any solid step — 2.09 and 2.86 — and yellow over the
// dark ground is an olive.
const familiesValues = {
  hanzogui: ['red', 'pink', 'purple', 'gray', 'blue', 'teal', 'green'] as ThemeName[],
  xmas: ['red', 'green', 'red', 'green', 'red', 'green', 'red'] as ThemeName[],
  easter: [
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
    'yellow',
  ] as ThemeName[],
  halloween: [
    'yellow',
    'gray',
    'yellow',
    'gray',
    'yellow',
    'gray',
    'yellow',
  ] as ThemeName[],
  valentine: ['red', 'red', 'red', 'red', 'red', 'red', 'red'] as ThemeName[],
  lunar: ['yellow', 'red', 'red', 'red', 'red', 'red', 'yellow'] as ThemeName[],
  stpatricks: [
    'green',
    'yellow',
    'green',
    'yellow',
    'green',
    'yellow',
    'green',
  ] as ThemeName[],
}

type Family = keyof typeof familiesValues

const DEFAULT_FAMILY: Family = 'hanzogui'

const familiesNames = Object.keys(familiesValues) as any as Family[]

type Families = { [key in Family]: ThemeName[] }
const families = familiesValues as Families

export type TintFamily = keyof typeof families

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
