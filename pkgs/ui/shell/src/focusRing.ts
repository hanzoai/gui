'use client'

/**
 * Shell focus ring — the ONE monochrome `:focus-visible` outline for every
 * interactive element in the reusable Hanzo shell.
 *
 * `:focus-visible` is a pseudo-class, so it cannot be expressed with React
 * inline styles (the shell's design contract). This is the sanctioned single
 * exception: one idempotent `<style>` element, scoped to `[data-hanzo-shell]`
 * roots, that replaces Chrome's default BLUE focus ring — the one stray hue on
 * the otherwise-monochrome chrome — with a paper-white ring. `!important`
 * overrides any inline `outline` (e.g. inputs that set `outline: none`) so the
 * ring is guaranteed visible and the blue is always killed.
 *
 * Usage: a top-level shell component calls `useShellFocusRing()` once and puts
 * `data-hanzo-shell=""` on its root; the ring then applies to every focusable
 * descendant (links, buttons, inputs) including menus rendered within.
 */
import { useEffect } from 'react'

const STYLE_ID = 'hanzo-shell-focus-ring'

const CSS = `[data-hanzo-shell] :focus-visible{outline:2px solid rgba(255,255,255,0.7)!important;outline-offset:2px!important}`

/** Inject the shell's monochrome `:focus-visible` ring once (idempotent). */
export function useShellFocusRing(): void {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])
}
