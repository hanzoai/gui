'use client'

/**
 * Shell base stylesheet — the ONE sanctioned CSS escape hatch for rules React
 * inline styles cannot express (`:focus-visible`, `:disabled`, media queries).
 * Everything else in the shell stays inline styles + theme.ts tokens.
 *
 * It carries exactly six house rules, scoped to `[data-hanzo-shell]` roots:
 *   1. a hueless focus ring, replacing Chrome's default BLUE — the one stray hue
 *      on otherwise-monochrome chrome. Stated at normal weight so a component
 *      can still overrule it; see the rule itself.
 *   2. `cursor: pointer` on every button, so no control can drift without it.
 *   3. `cursor: default` on disabled buttons.
 *   4. a >=44px target for every link/button on coarse pointers, so the dense
 *      34px desktop register never ships as an unhittable phone target.
 *   5. no transitions or animations when the reader asked for reduced motion.
 *      The shell states its motion as inline `transition`, which no media query
 *      can reach — so honouring the preference has to happen HERE, once, for
 *      every surface, rather than each component re-deriving it.
 *   6. the shell's keyframes, and the two hover rules that reach a DESCENDANT
 *      of what the pointer is on. Neither has an inline-style form — `style`
 *      holds one transform, not a sequence, and it cannot address a child — so
 *      both land here, where rule 5 already silences them for a reader who
 *      asked for stillness. `hanzo-spin` is the busy spinner;
 *      `hanzo-palette-in` is the ⌘K palette expanding into place;
 *      `hanzo-card-in` + `hanzo-row-in` are a menu dropping out of its trigger
 *      and its rows arriving behind it.
 *
 * Usage: a top-level shell component calls `useShellStyles()` once and puts
 * `data-hanzo-shell=""` on its root; the rules then apply to every focusable
 * descendant, including menus rendered within.
 */
import { useEffect } from 'react'
import { FOCUS_RING, TAP_H } from './theme'

const STYLE_ID = 'hanzo-shell-styles'

const CSS = [
  // The house focus treatment, stated once. Deliberately the SAME recipe
  // @hanzo/design's base.css uses, so a focused control looks identical whether
  // it came from the shell or from the design system — this is not a
  // shell-private ring.
  //
  // NOT `!important`: a component that has a real reason to state its own focus
  // treatment must be able to, and an unbeatable rule here is a default
  // masquerading as a law. This is the floor, not a ceiling.
  `[data-hanzo-shell] :focus-visible{outline:2px solid ${FOCUS_RING};outline-offset:2px}`,
  // A control wrapped in a <label> is ONE control, so it gets ONE ring — on the
  // wrapper, not on the input inside it, which would draw a second box within
  // the first.
  `[data-hanzo-shell] label:focus-within{outline:2px solid ${FOCUS_RING};outline-offset:2px}`,
  // This one KEEPS `!important`. It exists to suppress the nested second ring
  // the first rule would otherwise draw on the input INSIDE a label.
  // Cascade check: `[data-hanzo-shell] label :focus-visible` scores (0,2,1) —
  // attribute + pseudo-class + the `label` TYPE selector — against (0,2,0) for
  // `[data-hanzo-shell] :focus-visible`, so specificity already separates them
  // and this would win on its own. The `!important` is belt-and-braces against
  // a component that states its own `outline` inline, which specificity alone
  // would lose to.
  `[data-hanzo-shell] label :focus-visible{outline:none!important}`,
  // …except the palette's own field, which is focused for the whole life of
  // the panel. An indicator that is never off indicates nothing, and it costs a
  // rounded box drawn around the one thing a reader is already looking at. The
  // caret says where the typing goes. Specificity (0,3,1) beats the rule above
  // it at (0,2,1), so this needs no `!important`.
  `[data-hanzo-shell] label.hanzo-field:focus-within{outline:none}`,
  // A host can draw focus as a SHADOW rather than an outline — @hanzo/design's
  // base layer does, as `:where(input,textarea):focus-visible{box-shadow:…}` —
  // so clearing the outline leaves a soft rectangle exactly where the hard one
  // was. The shell states its own focus treatment and has to clear both, or the
  // field wears whichever ring the page it landed on happens to believe in.
  `[data-hanzo-shell] label.hanzo-field input{box-shadow:none;border-color:transparent}`,
  // BRIGHTEN THE TARGET, DIM THE CONTEXT.
  //
  // A hover already takes the row it is on to pure white (`ghostHover`), which
  // is the only half a component can state for itself: an inline style knows
  // about one element and a plane full of links needs the OTHER ones to answer.
  // So while a pointer is on any link in a plane, its siblings step back to 46%
  // — enough to read, quiet enough that the one being pointed at is the only
  // thing at full strength. Focus counts as pointing, so a keyboard walks the
  // plane the same way.
  //
  // `!important` because the rows carry their resting colour inline and no
  // stylesheet reaches an inline declaration otherwise. It is scoped to a
  // sibling of whatever is hovered, so it can only ever quieten — the target
  // itself is excluded by `:not(:hover)`.
  `[data-hanzo-plane]:is(:hover,:focus-within) a:not(:hover):not(:focus-visible){color:rgba(255,255,255,0.46)!important}`,
  `[data-hanzo-plane] a{transition:color 140ms ease,transform 140ms ease}`,
  `[data-hanzo-plane] a:hover{transform:translateY(-1px)}`,
  // The taxonomy grid widens in two steps. The COUNTS are computed where the
  // categories are (ProductsMegaMenu, `columnsFor`) and ride in as custom
  // properties; the WIDTHS that choose between them can only be said here.
  // `!important` because the base count is stated inline on the same property,
  // and nothing else reaches an inline declaration.
  `@media (min-width:1100px){[data-hanzo-products-grid]{grid-template-columns:repeat(var(--hz-products-cols-mid),minmax(0,1fr))!important}}`,
  `@media (min-width:1400px){[data-hanzo-products-grid]{grid-template-columns:repeat(var(--hz-products-cols-wide),minmax(0,1fr))!important}}`,
  `[data-hanzo-shell] button{cursor:pointer}`,
  `[data-hanzo-shell] button:disabled{cursor:default}`,
  `@media (pointer:coarse){[data-hanzo-shell] a,[data-hanzo-shell] button{min-height:${TAP_H}px}}`,
  `@media (prefers-reduced-motion:reduce){[data-hanzo-shell],[data-hanzo-shell] *{transition:none!important;animation:none!important}}`,
  `@keyframes hanzo-spin{to{transform:rotate(360deg)}}`,
  // The palette expands into place. Kept to opacity + transform so it composites
  // off the main thread, and stated on an INNER element so the frame's own
  // centring transform is never the thing being animated.
  `@keyframes hanzo-palette-in{from{opacity:0;transform:translateY(-6px) scale(0.98)}to{opacity:1;transform:none}}`,
  // A card dropping out of the control that opened it. It scales from that
  // corner (the caller sets `transform-origin`) and lands with a little past
  // the mark, which is what separates a card that OPENED from one that was
  // simply switched on.
  `@keyframes hanzo-card-in{from{opacity:0;transform:translateY(-8px) scale(0.94)}60%{opacity:1;transform:translateY(0) scale(1.012)}to{opacity:1;transform:none}}`,
  // The rows arriving after the card, one behind the next. The delay is set per
  // row at the call site, so the cascade is a property of the list rather than
  // of any one item.
  `@keyframes hanzo-row-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}`,
  // A door says where it goes once the pointer is on it. The mark leans toward
  // the exit and the arrow arrives — the whole of the personality, and it
  // cannot be an inline style because both are DESCENDANTS of what is hovered.
  `[data-hanzo-shell] .hanzo-door .hanzo-door-go{opacity:0;transform:translateX(-3px);transition:opacity 140ms ease,transform 140ms ease}`,
  `[data-hanzo-shell] .hanzo-door:hover .hanzo-door-go,[data-hanzo-shell] .hanzo-door:focus-visible .hanzo-door-go{opacity:1;transform:none}`,
  `[data-hanzo-shell] .hanzo-door .hanzo-door-mark{transition:transform 160ms cubic-bezier(.2,.9,.3,1.4)}`,
  `[data-hanzo-shell] .hanzo-door:hover .hanzo-door-mark,[data-hanzo-shell] .hanzo-door:focus-visible .hanzo-door-mark{transform:translateX(2px) scale(1.14)}`,
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
