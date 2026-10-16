import { forwardRef, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { YStack, type YStackProps } from '@hanzo/gui'

/**
 * The focus indicator every control here draws: the theme's ring, two pixels,
 * clear of the edge. Stated rather than left to a host's stylesheet, so a host
 * that resets `outline` on buttons still shows where the keyboard is.
 */
export const RING = {
  outlineColor: '$outlineColor',
  outlineStyle: 'solid',
  outlineWidth: 2,
  outlineOffset: 2,
} as const

export type PressProps = YStackProps & {
  /** Roving tab order: 0 for the one control of a group Tab lands on, -1 otherwise. */
  tabIndex?: number
  disabled?: boolean
}

/**
 * A real `<button type="button">` on web: Tab reaches it, Enter and Space press
 * it, and a screen reader calls it a button. A styled `YStack` with `onPress` is
 * a `<div>` that only a pointer can use. gui's own `Button` is one too, but it
 * fixes its `tabIndex` at 0, so a group that keeps one tab stop (the month grid,
 * the times) cannot be built from it.
 */
export const Press = forwardRef<HTMLElement, PressProps>(function Press(
  { disabled, ...props },
  ref
) {
  return (
    <YStack
      ref={ref as never}
      render={<button type="button" disabled={disabled} />}
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
 * key moves to from `i`, or null to let the key through.
 */
export function useRoving(
  count: number,
  current: number,
  step?: (i: number, key: string) => number | null
) {
  const nodes = useRef<(HTMLElement | null)[]>([])
  // The control the arrows last reached keeps the tab stop, so Tab out and back
  // returns to it; a new choice (or a new set of controls) takes it back.
  const [at, setAt] = useState<number | null>(null)
  useEffect(() => setAt(null), [current, count])
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
    item: (i: number) => ({
      ref: (el: HTMLElement | null) => {
        nodes.current[i] = el
      },
      tabIndex: i === home ? 0 : -1,
      onFocus: () => setAt(i),
      onKeyDown: (e: KeyboardEvent) => {
        const to = move(i, e.key)
        if (to === null || to === i) return
        e.preventDefault()
        nodes.current[to]?.focus()
      },
    }),
  }
}
