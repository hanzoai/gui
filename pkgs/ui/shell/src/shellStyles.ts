'use client'

/**
 * Shell base stylesheet — the ONE sanctioned CSS escape hatch for rules React
 * inline styles cannot express (`:focus-visible`, `:disabled`, media queries).
 * Everything else in the shell stays inline styles + theme.ts tokens.
 *
 * It carries exactly six house rules, scoped to `[data-hanzo-shell]` roots:
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
 *   6. the shell's two keyframes. Neither has an inline-style form — `style`
 *      holds one transform, not a sequence — so a rotation and an entrance both
 *      have to name a keyframe, and rule 5 already silences them for a reader
 *      who asked for stillness. `hanzo-spin` is the busy spinner;
 *      `hanzo-palette-in` is the ⌘K palette expanding into place.
 *
 * Usage: a top-level shell component calls `useShellStyles()` once and puts
 * `data-hanzo-shell=""` on its root; the rules then apply to every focusable
 * descendant, including menus rendered within.
 */
import { useEffect } from 'react'
import { FOCUS_RING, TAP_H } from './theme'

const STYLE_ID = 'hanzo-shell-styles'

const CSS = [
  `[data-hanzo-shell] :focus-visible{outline:2px solid ${FOCUS_RING}!important;outline-offset:2px!important}`,
  // A control wrapped in a <label> is ONE control, so it gets ONE ring — on the
  // wrapper, not on the input inside it, which would draw a second box within
  // the first.
  `[data-hanzo-shell] label:focus-within{outline:2px solid ${FOCUS_RING};outline-offset:2px}`,
  `[data-hanzo-shell] label :focus-visible{outline:none!important}`,
  `[data-hanzo-shell] button{cursor:pointer}`,
  `[data-hanzo-shell] button:disabled{cursor:default}`,
  `@media (pointer:coarse){[data-hanzo-shell] a,[data-hanzo-shell] button{min-height:${TAP_H}px}}`,
  `@media (prefers-reduced-motion:reduce){[data-hanzo-shell],[data-hanzo-shell] *{transition:none!important;animation:none!important}}`,
  `@keyframes hanzo-spin{to{transform:rotate(360deg)}}`,
  // The palette expands into place. Kept to opacity + transform so it composites
  // off the main thread, and stated on an INNER element so the frame's own
  // centring transform is never the thing being animated.
  `@keyframes hanzo-palette-in{from{opacity:0;transform:translateY(-6px) scale(0.98)}to{opacity:1;transform:none}}`,
].join('')

/** The shell's one animation, for a control that is busy. See rule 6. */
export const SPIN = 'hanzo-spin 700ms linear infinite'

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
