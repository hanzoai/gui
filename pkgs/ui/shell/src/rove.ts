'use client'

/**
 * The keyboard contract of an open menu panel, stated once for both mega-menus.
 * They carried an identical copy of it, which is how a fix to one could silently
 * leave the other behind.
 *
 * Esc closes from ANYWHERE on the page, not only from inside the panel. A menu
 * that opened under the pointer never took focus, so a panel-scoped key handler
 * would never hear the key that dismisses it — the listener has to be on the
 * document for the hover case to be dismissible at all.
 *
 * Focus is handed back only if the panel ever HELD it — because it claimed it on
 * open (`autoFocus`), or because the reader tabbed in. A menu that merely opened
 * under a passing pointer must not yank the caret out of whatever the reader was
 * using when it closes again.
 *
 * Items are read from the DOM (`a[href]` inside the panel, in document order)
 * rather than gathered through a `register` callback threaded down through every
 * card and leaf. The DOM already IS the list, in exactly the order the reader
 * sees it, and it cannot fall out of step with the render the way a hand-kept
 * array can.
 */
import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'

export interface Rove {
  /** Attach to the panel element — it is the root the items are read from. */
  ref: RefObject<HTMLDivElement | null>
  /** Attach to the panel: ↑/↓/←/→/Home/End rove the items. */
  onKeyDown: (e: KeyboardEvent) => void
  /** Attach to the panel: records that focus has entered it. */
  onFocus: () => void
}

/**
 * @param open      whether the panel is mounted
 * @param close     dismiss the panel (Esc)
 * @param autoFocus claim focus on open. True for a click or a keystroke, false
 *                  when the pointer opened the menu.
 */
export function useRove(open: boolean, close: () => void, autoFocus = true): Rove {
  const ref = useRef<HTMLDivElement | null>(null)
  const restore = useRef<HTMLElement | null>(null)
  /** True once the panel holds focus — claimed on open, or tabbed into. */
  const held = useRef(false)
  // Read at open time, not at render time, so flipping it under an open panel
  // cannot re-run the effect and re-take focus.
  const claim = useRef(autoFocus)
  claim.current = autoFocus

  // Held in a ref, and deliberately NOT an effect dependency. A host passing an
  // inline `onClose={() => …}` is ordinary React, and it hands this a fresh
  // function on every render — as a dependency it would tear the effect down and
  // build it up again each time, which means re-capturing the element to restore
  // focus to and re-claiming focus, on every render, for as long as the panel is
  // open. The effect turns on ONE thing: whether the panel is open.
  const dismiss = useRef(close)
  dismiss.current = close

  const items = useCallback(
    () => Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
    []
  )

  useEffect(() => {
    if (!open) return
    restore.current = (document.activeElement as HTMLElement) ?? null
    held.current = claim.current
    if (claim.current) requestAnimationFrame(() => items()[0]?.focus())

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') dismiss.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (held.current) restore.current?.focus?.()
    }
  }, [open, items])

  const focusAt = useCallback(
    (i: number) => {
      const els = items()
      if (els.length === 0) return
      els[((i % els.length) + els.length) % els.length]?.focus()
    },
    [items]
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const els = items()
      const cur = els.indexOf(document.activeElement as HTMLAnchorElement)
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusAt((cur < 0 ? -1 : cur) + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusAt((cur < 0 ? els.length : cur) - 1)
          break
        case 'Home':
          e.preventDefault()
          focusAt(0)
          break
        case 'End':
          e.preventDefault()
          focusAt(els.length - 1)
          break
      }
    },
    [focusAt, items]
  )

  const onFocus = useCallback(() => {
    held.current = true
  }, [])

  return { ref, onKeyDown, onFocus }
}
