'use client'

/**
 * Pointer intent — the ONE place the header decides a hover MEANT to open a
 * menu, so "Meet Hanzo" and "Products" cannot answer the pointer differently.
 *
 * A pointer crossing a trigger on its way somewhere else has asked for nothing,
 * so a hover only opens after it RESTS for `OPEN_AFTER`. A menu closes only once
 * the pointer has been off BOTH the trigger and the panel for `CLOSE_AFTER` —
 * long enough to cross the seam between them without the panel blinking out
 * underneath. Once a menu is open that wait is already spent: moving to the
 * sibling trigger swaps at once, because the visitor is inside the navigation
 * and a second delay there reads as lag rather than as care.
 *
 * `hover` records HOW the menu opened, and that is why this is one hook rather
 * than a pair of timers: a menu that opened under a passing pointer must NOT
 * take focus away from whatever the reader was using, while one opened by click
 * or key must take it (see `useRove`'s `autoFocus`).
 *
 * ONE open menu, held as one value rather than a boolean per menu — two booleans
 * can say "both open", which is a state neither the layout nor the keyboard has
 * an answer for.
 *
 * MOUSE ONLY. A touch `pointerenter` arrives immediately before the `click` it
 * belongs to, so honouring it would open the menu and let the same tap toggle it
 * shut again.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

/** Rest this long on a trigger before its menu opens. */
export const OPEN_AFTER = 150
/** Stay off both trigger and panel this long before the menu closes. */
export const CLOSE_AFTER = 140

/** Pointer props for an open panel — being inside it keeps it open. */
export interface Stay {
  onPointerEnter: (e: PointerEvent) => void
  onPointerLeave: (e: PointerEvent) => void
}

/** Pointer + click props for a trigger. */
export interface Reach extends Stay {
  onClick: () => void
}

export interface Intent<K extends string> {
  /** The open menu, or null when nothing is open. */
  key: K | null
  /** True when the POINTER opened it; a click or a keystroke leaves it false. */
  hover: boolean
  /** Open or close now, with no delay — a click, a key, a modal taking the page. */
  set: (key: K | null) => void
  /** Props for a trigger: resting opens, clicking toggles, leaving closes. */
  trigger: (key: K) => Reach
  /** Props for the open panel. */
  panel: Stay
}

export function useIntent<K extends string>(): Intent<K> {
  const [key, setKey] = useState<K | null>(null)
  const [hover, setHover] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // The open menu, readable from inside a handler without rebuilding every
  // handler each time it changes.
  const live = useRef<K | null>(null)
  live.current = key

  const stop = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  // A pending open or close must never outlive the header.
  useEffect(() => stop, [stop])

  const after = useCallback(
    (ms: number, run: () => void) => {
      stop()
      timer.current = setTimeout(() => {
        timer.current = null
        run()
      }, ms)
    },
    [stop]
  )

  const shut = useCallback(() => {
    setHover(false)
    setKey(null)
  }, [])

  const set = useCallback(
    (next: K | null) => {
      stop()
      setHover(false)
      setKey(next)
    },
    [stop]
  )

  const trigger = useCallback(
    (k: K): Reach => ({
      onClick: () => {
        stop()
        setHover(false)
        setKey((cur) => (cur === k ? null : k))
      },
      onPointerEnter: (e) => {
        if (e.pointerType !== 'mouse') return
        after(live.current ? 0 : OPEN_AFTER, () => {
          setHover(true)
          setKey(k)
        })
      },
      onPointerLeave: (e) => {
        if (e.pointerType !== 'mouse') return
        after(CLOSE_AFTER, shut)
      },
    }),
    [after, shut, stop]
  )

  const panel = useMemo<Stay>(
    () => ({
      onPointerEnter: (e) => {
        if (e.pointerType !== 'mouse') return
        stop()
      },
      onPointerLeave: (e) => {
        if (e.pointerType !== 'mouse') return
        after(CLOSE_AFTER, shut)
      },
    }),
    [after, shut, stop]
  )

  // One stable object per state change, so a consumer can hold `menu` in a
  // dependency list without it changing identity on every render.
  return useMemo(
    () => ({ key, hover, set, trigger, panel }),
    [key, hover, set, trigger, panel]
  )
}
