import { apply, read, write } from '@hanzo/appearance/state'
import { NEUTRAL, STOPS } from '@hanzogui/logo'

/**
 * A tint stop, as the person's own accent.
 *
 * The ramp names stops; @hanzo/appearance stores a colour. The bridge is the
 * rung a stop stands for, read from a span scoped to dark so the answer does not
 * change with the page: a yellow chosen at night is the same yellow by day,
 * which is what lets a stored accent be recognised again under either scheme.
 * Storing it there rather than in this page's tint state is what makes the
 * choice outlive the visit and reach the rest of the estate.
 */
const colorsOf = (tints: string[]): string[] => {
  const probe = document.createElement('span')
  probe.className = 't_dark'
  probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden'
  document.body.append(probe)
  const scale = getComputedStyle(probe)
  const colors = tints.map((tint) => {
    const rung = STOPS[tint]?.accent
    return rung ? scale.getPropertyValue(`--${tint}${rung}`).trim() : ''
  })
  probe.remove()
  return colors
}

/** Choose a stop. The one that names no colour clears the axis instead of
 *  storing a grey, so the published accent is what answers again. */
export const setAccent = (tints: string[], index: number): void => {
  const next = { ...read() }
  const [color] = colorsOf([tints[index]])
  if (color) next.accent = color
  else delete next.accent
  write(next)
  apply(next)
}

/** Which stop the stored accent names, or the notch when none does. */
export const accentIndex = (tints: string[]): number => {
  const { accent } = read()
  const at = accent ? colorsOf(tints).indexOf(accent) : -1
  return at < 0 ? NEUTRAL : at
}

/** The stored preference back on the document. The head script sets every knob
 *  but the colour, which it will not validate, so this is where one lands. */
export const restoreAppearance = (): void => apply(read())
