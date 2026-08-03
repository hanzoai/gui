'use client'

/**
 * Shell base stylesheet — the ONE sanctioned CSS escape hatch for rules React
 * inline styles cannot express (`:focus-visible`, `:disabled`, media queries).
 * Everything else in the shell stays inline styles + theme.ts tokens.
 *
 * It carries exactly five house rules, scoped to `[data-hanzo-shell]` roots:
 *   1. a paper-white focus ring, replacing Chrome's default BLUE — the one stray
 *      hue on otherwise-monochrome chrome. `!important` beats inline `outline`.
 *   2. `cursor: pointer` on every button, so no control can drift without it.
 *   3. `cursor: default` on disabled buttons.
 *   4. a >=44px target for every link/button on coarse pointers, so the dense
 *      34px desktop register never ships as an unhittable phone target.
 *   5. no transitions or animations when the reader asked for reduced motion.
 *      The shell states its motion as inline `transition`, which no media query
 *      can reach — so honouring the preference has to happen HERE, once, for
 *      every surface, rather than each component re-deriving it.
 *
 * Usage: a top-level shell component calls `useShellStyles()` once and puts
 * `data-hanzo-shell=""` on its root; the rules then apply to every focusable
 * descendant, including menus rendered within.
 */
import { useEffect } from 'react'
import { TAP_H } from './theme'

const STYLE_ID = 'hanzo-shell-styles'

const CSS = [
  `[data-hanzo-shell] :focus-visible{outline:2px solid rgba(255,255,255,0.7)!important;outline-offset:2px!important}`,
  // A control wrapped in a <label> is ONE control, so it gets ONE ring — on the
  // wrapper, not on the input inside it, which would draw a second box within
  // the first.
  `[data-hanzo-shell] label:focus-within{outline:2px solid rgba(255,255,255,0.7);outline-offset:2px}`,
  `[data-hanzo-shell] label :focus-visible{outline:none!important}`,
  `[data-hanzo-shell] button{cursor:pointer}`,
  `[data-hanzo-shell] button:disabled{cursor:default}`,
  `@media (pointer:coarse){[data-hanzo-shell] a,[data-hanzo-shell] button{min-height:${TAP_H}px}}`,
  `@media (prefers-reduced-motion:reduce){[data-hanzo-shell],[data-hanzo-shell] *{transition:none!important;animation:none!important}}`,
].join('')

/** Inject the shell's base stylesheet once (idempotent). */
export function useShellStyles(): void {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = CSS
    document.head.appendChild(el)
  }, [])
}
