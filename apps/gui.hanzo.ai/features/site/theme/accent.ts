import { apply, read, write } from '@hanzo/appearance/state'
import { NEUTRAL } from '@hanzogui/logo'

/**
 * A tint stop, as the person's own accent.
 *
 * The ramp names hues; @hanzo/appearance stores a colour. The bridge between
 * them is the solid step the theme already publishes at the root — one value,
 * the same on both grounds, so a choice made in the dark still reads back in
 * the light. Storing it there rather than in this page's tint state is what
 * makes it outlive the visit and reach the rest of the estate.
 */
const colorOf = (tint: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${tint}9`).trim()

/** Choose a stop. The neutral notch is the absence of an accent, so it clears
 *  the axis instead of storing a grey. */
export const setAccent = (tints: string[], index: number): void => {
  const next = { ...read() }
  const color = index === NEUTRAL ? '' : colorOf(tints[index])
  if (color) next.accent = color
  else delete next.accent
  write(next)
  apply(next)
}

/** Which stop the stored accent names, or the notch when none does. */
export const accentIndex = (tints: string[]): number => {
  const { accent } = read()
  const at = accent ? tints.findIndex((t) => colorOf(t) === accent) : -1
  return at < 0 ? NEUTRAL : at
}

/** The stored preference back on the document. The head script sets every knob
 *  but the colour, which it will not validate, so this is where one lands. */
export const restoreAppearance = (): void => apply(read())
