import { forwardRef, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { YStack, type YStackProps } from '@hanzo/gui'

/**
 * The focus indicator every control here draws: two pixels of the full ink,
 * clear of the edge. The ink rather than the theme's `$outlineColor`, which a
 * stock config sets at 20% alpha (1.5:1 on light), and which on a time tile is
 * near the hover edge's grey, so a focused time looked like a hovered one.
 * Stated rather than left to a host's stylesheet, so a host that resets
 * `outline` on buttons still shows where the keyboard is.
 */
export const RING = {
  outlineColor: '$color12',
  outlineStyle: 'solid',
  outlineWidth: 2,
  outlineOffset: 2,
} as const

/** The ring for a control filled with the theme's inverse (the accent pill):
 *  in that theme the ink is the page's colour, so the ring takes the fill's. */
export const RING_FILLED = { ...RING, outlineColor: '$background' } as const

export type PressProps = YStackProps & {
  /** Roving tab order: 0 for the one control of a group Tab lands on, -1 otherwise. */
  tabIndex?: number
  /** Unavailable, but still focusable: a control that goes unavailable under
   *  focus (the first month's Previous) must not drop focus to the page. */
  disabled?: boolean
}

/**
 * A real `<button type="button">` on web: Tab reaches it, Enter and Space press
 * it, and a screen reader calls it a button. A styled `YStack` with `onPress` is
 * a `<div>` that only a pointer can use. gui's own `Button` is one too, but it
 * fixes its `tabIndex` at 0, so a group that keeps one tab stop (the month grid,
 * the times) cannot be built from it.
 *
 * `tabIndex` is stated, 0 unless a roving group says otherwise: Safari's Tab
 * skips a <button> that carries none (unless the person turned on "Press Tab to
 * highlight each item"), which left the month arrows unreachable there. `role`
 * is stated because native has no <button> to carry it.
 */
export const Press = forwardRef<HTMLElement, PressProps>(function Press(
  { disabled, ...props },
  ref
) {
  return (
    <YStack
      ref={ref as never}
      render={<button type="button" />}
      role="button"
      tabIndex={0}
      padding={0}
      borderWidth={0}
      backgroundColor="transparent"
      cursor={disabled ? 'default' : 'pointer'}
      focusVisibleStyle={RING}
      aria-disabled={disabled || undefined}
      {...props}
      onPress={disabled ? undefined : props.onPress}
    />
  )
})

/**
 * One tab stop for a group of controls, and the arrow keys between them — the
 * roving tabindex of the WAI-ARIA authoring practices. `current` is the index
 * Tab lands on (the chosen one, or the first). `step(i, key)` names the index a
 * key moves to from `i`, or null to let the key through. `scope` names the set
 * (the day the times are for, the month the days are in): a new one starts the
 * group over at `current`.
 */
export function useRoving(
  count: number,
  current: number,
  step?: (i: number, key: string) => number | null,
  scope?: string | null
) {
  const nodes = useRef<(HTMLElement | null)[]>([])
  // The control the arrows last reached keeps the tab stop, so Tab out and back
  // returns to it; a new choice (or a new set of controls) takes it back.
  const [at, setAt] = useState<number | null>(null)
  useEffect(() => setAt(null), [current, count, scope])
  const home = count === 0 ? -1 : Math.min(Math.max(at ?? current, 0), count - 1)

  const move = (i: number, key: string): number | null => {
    const own = step?.(i, key)
    if (own !== undefined && own !== null) return own
    if (key === 'ArrowRight' || key === 'ArrowDown') return Math.min(i + 1, count - 1)
    if (key === 'ArrowLeft' || key === 'ArrowUp') return Math.max(i - 1, 0)
    if (key === 'Home') return 0
    if (key === 'End') return count - 1
    return null
  }

  return {
    /** Focus the control Tab would land on — for a group that comes back. */
    focus: () => nodes.current[home]?.focus(),
    item: (i: number) => ({
      ref: (el: HTMLElement | null) => {
        nodes.current[i] = el
      },
      tabIndex: i === home ? 0 : -1,
      onFocus: () => setAt(i),
      onKeyDown: (e: KeyboardEvent) => {
        // A chord is the browser's or the reader's (Alt+Left is Back), not ours.
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        const to = move(i, e.key)
        if (to === null) return
        // Handled even at an end, or the arrow scrolls the page instead.
        e.preventDefault()
        if (to !== i) nodes.current[to]?.focus()
      },
    }),
  }
}
