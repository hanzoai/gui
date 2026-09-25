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
 *      `hanzo-card-in` + `hanzo-row-in` are a card dropping out of its trigger
 *      and its rows arriving behind it; `hanzo-plane-in` is a full-bleed menu
 *      lowering out of the bar.
 *
 * Usage: a top-level shell component calls `useShellStyles()` once and puts
 * `data-hanzo-shell=""` on its root; the rules then apply to every focusable
 * descendant, including menus rendered within.
 */
import { useInsertionEffect } from 'react'
import { FOCUS_RING, FRAME, TAP_H } from './theme.ts'

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
  // THE RUNG, not the literal. This was rgba(255,255,255,0.46) written out,
  // which is `--white-45` to within a rounding step — and unlike the literal,
  // the rung is a name a light host already redefines. Written flat it survived
  // every theme: on a light plane it dimmed the whole menu to white-on-white the
  // moment a pointer entered, and `!important` meant nothing could reach it.
  // The fallback keeps the measured value for a host that defines nothing.
  `[data-hanzo-plane]:is(:hover,:focus-within) a:not(:hover):not(:focus-visible){color:var(--white-45, rgba(255,255,255,0.46))!important}`,
  `[data-hanzo-plane] a{transition:color 140ms ease,transform 140ms ease}`,
  `[data-hanzo-plane] a:hover{transform:translateY(-1px)}`,
  // The taxonomy grid widens in two steps. The COUNTS are computed where the
  // categories are (ProductsMegaMenu, `columnsFor`) and ride in as custom
  // properties; the WIDTHS that choose between them can only be said here.
  // `!important` because the base count is stated inline on the same property,
  // and nothing else reaches an inline declaration.
  `@media (min-width:1100px){[data-hanzo-products-grid]{grid-template-columns:repeat(var(--hz-products-cols-mid),minmax(0,1fr))!important}}`,
  `@media (min-width:1400px){[data-hanzo-products-grid]{grid-template-columns:repeat(var(--hz-products-cols-wide),minmax(0,1fr))!important}}`,
  // The column a reader is IN stays lit and the others step back, so a menu of
  // four dense columns reads as one at a time. On the container, not the
  // column, because a column cannot know that a sibling is hovered; and only
  // where a pointer can hover, so a touch reader is never left dimmed.
  `@media (hover:hover){[data-hanzo-plane]:has([data-hanzo-menu-col]:hover) [data-hanzo-menu-col]{opacity:0.45;transition:opacity 140ms ease}}`,
  `@media (hover:hover){[data-hanzo-plane] [data-hanzo-menu-col]:hover{opacity:1}}`,
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
  // The plane lowering out of the bar. It cannot SCALE — a full-bleed sheet's
  // corners travel further than the eye can follow — so it fades and drops the
  // 4px that reads as "this came from the edge above it".
  `@keyframes hanzo-plane-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`,
  // A row says where it goes once the pointer is on it. The mark leans toward
  // the exit and the arrow arrives — the whole of the personality, and it
  // cannot be an inline style because both are DESCENDANTS of what is hovered.
  `[data-hanzo-shell] .hanzo-door .hanzo-door-go{opacity:0;transform:translateX(-3px);transition:opacity 140ms ease,transform 140ms ease}`,
  `[data-hanzo-shell] .hanzo-door:hover .hanzo-door-go,[data-hanzo-shell] .hanzo-door:focus-visible .hanzo-door-go{opacity:1;transform:none}`,
  `[data-hanzo-shell] .hanzo-door .hanzo-door-mark{transition:transform 160ms cubic-bezier(.2,.9,.3,1.4)}`,
  `[data-hanzo-shell] .hanzo-door:hover .hanzo-door-mark,[data-hanzo-shell] .hanzo-door:focus-visible .hanzo-door-mark{transform:translateX(2px) scale(1.14)}`,
].join('')

/**
 * THE WORKSPACE FRAME'S LAYOUT — the rules `Frame` cannot state inline.
 *
 * A grid, addressed by slot: the rail down the left, the bar across the top,
 * and under the bar the sidebar (`list`), the room (`pane`) and the column
 * beside it (`side`, or the `panel` that takes its place). Below 768px the grid
 * turns: bar, pane, and the rail along the bottom as a tab bar, with the
 * sidebar a sheet between them. Media queries and `:hover` have no inline
 * form, which is the only reason these live here.
 *
 * EVERY SELECTOR NAMES THE FRAME'S OWN ELEMENTS. The frame's root holds the
 * whole app, so a rule written against `button` or `a` under it would restyle
 * every room. Rows, tiles and icon controls carry a `data-frame-*` attribute
 * and the columns are addressed by slot, one level down.
 *
 * The rail is the sidebar SHUT: a laptop with the sidebar open lists the
 * sections at the sidebar's top, so the rail steps aside — unless the host
 * asked for the far-left strip (`data-strip`), which stands beside the open
 * sidebar and carries the sections itself.
 */
const F = '[data-hanzo-frame]'
const FRAME_CSS = [
  `${F}{display:grid;grid-template-columns:64px auto minmax(0,1fr) auto;grid-template-rows:44px minmax(0,1fr);grid-template-areas:"rail bar bar bar" "rail list pane side";position:relative;width:100%;height:100dvh;overflow:hidden;background:${FRAME.ground};color:${FRAME.ink}}`,
  `${F}>[data-slot=rail]{grid-area:rail;display:grid;grid-template-rows:auto minmax(0,1fr) auto;min-height:0;min-width:0;background:${FRAME.ground};border-right:1px solid ${FRAME.edge}}`,
  `${F}>[data-slot=rail]>[data-slot=places]{grid-row:2;display:grid;grid-auto-rows:max-content;align-content:start;justify-items:center;gap:2px;min-width:0;overflow-y:auto;scrollbar-width:none;padding-top:8px}`,
  `${F}>[data-slot=rail]>[data-slot=strip]{grid-row:1;display:grid;justify-items:center;padding:8px 0 4px}`,
  `${F}>[data-slot=rail]>[data-slot=foot]{grid-row:3;display:grid;justify-items:center;padding-bottom:8px}`,
  `${F}>[data-slot=bar]{grid-area:bar;min-width:0}`,
  `${F}>[data-slot=list]{grid-area:list;display:flex;min-height:0;z-index:var(--z-drawer,20);background:${FRAME.ground}}`,
  `${F}>[data-slot=pane]{grid-area:pane}`,
  `${F}>[data-slot=side],${F}>[data-slot=panel]{grid-area:side;min-height:0}`,
  `${F}>[data-slot=scrim]{position:absolute;inset:0;z-index:var(--z-scrim,19);border:0;padding:0;background:${FRAME.scrim}}`,
  // A section is its icon over its label on the rail, its icon beside its label
  // in the sidebar. `aria-current` is the one state; the pointer is the other.
  // Unscoped, because the attribute is already the frame's own name and the
  // account card wears these rows on a page with no frame around it.
  `[data-frame-tile]{display:grid;place-items:center;align-content:center;gap:2px;width:56px;min-height:44px;padding:4px 0;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-decoration:none;cursor:pointer}`,
  `[data-frame-tile]>span{font-size:10px;line-height:12px;color:${FRAME.quiet};max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}`,
  `[data-frame-tile]:hover{background:${FRAME.hover}}`,
  `[data-frame-tile][aria-current=page]{background:${FRAME.edge}}`,
  `[data-frame-tile][aria-current=page]>span{color:${FRAME.ink}}`,
  `[data-frame-row]{display:flex;align-items:center;gap:8px;width:100%;min-width:0;padding:6px 8px;border:0;border-radius:8px;background:transparent;color:${FRAME.quiet};font:inherit;font-size:13px;line-height:18px;text-align:left;text-decoration:none;cursor:pointer}`,
  `[data-frame-row]>svg{flex-shrink:0;opacity:.7}`,
  `[data-frame-row]>span{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}`,
  `[data-frame-row]:hover{background:${FRAME.hover}}`,
  `[data-frame-row][aria-current=page]{background:${FRAME.edge};color:${FRAME.ink}}`,
  `[data-frame-icon]{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0;border:0;border-radius:8px;background:transparent;color:inherit;opacity:.7;cursor:pointer}`,
  `[data-frame-icon]:hover{background:${FRAME.edge};opacity:1}`,
  `[data-frame-grip]:hover,[data-frame-grip]:focus-visible{background:${FRAME.edge}}`,
  `${F} [data-slot=find]:hover{background:${FRAME.hover}}`,
  `:is([data-frame-tile],[data-frame-row],[data-frame-icon],[data-frame-grip]):focus-visible,${F} [data-slot=find]:focus-visible{outline:2px solid ${FOCUS_RING};outline-offset:-2px}`,
  // The column beside the room exists from 1024px, and so do the controls that
  // open it: a toggle for a column nobody can see is a dead control.
  `@media (max-width:1023.98px){${F}>[data-slot=side],${F} [data-frame-lg]{display:none!important}${F}>[data-slot=panel]{position:absolute;inset:44px 0 0;z-index:var(--z-drawer,20)}}`,
  `@media (min-width:768px){${F}>[data-slot=scrim]{display:none}${F}>[data-slot=rail] [data-slot=more]{display:none}${F}[data-sidebar=open]:not([data-strip]){grid-template-columns:0 auto minmax(0,1fr) auto}${F}[data-sidebar=open]:not([data-strip])>[data-slot=rail]{display:none}${F}[data-strip] [data-slot=places-list]{display:none}}`,
  // A PHONE. The bar, the room, and the rail as the tab bar along the bottom:
  // four sections and More, the rest one press away in the finder. The sidebar
  // is a sheet between the bar and the tab bar, and the words of the search
  // give way to its glyph.
  `@media (max-width:767.98px){${F}{grid-template-columns:minmax(0,1fr);grid-template-rows:44px minmax(0,1fr) calc(56px + env(safe-area-inset-bottom));grid-template-areas:"bar" "pane" "rail"}` +
    `${F}>[data-slot=rail]{grid-template-rows:none;grid-template-columns:minmax(0,1fr) auto;align-items:center;padding-bottom:env(safe-area-inset-bottom);border-right:0;border-top:1px solid ${FRAME.edge}}` +
    `${F}>[data-slot=rail]>[data-slot=places]{grid-row:auto;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);grid-auto-rows:auto;justify-items:stretch;overflow:hidden;padding-top:0}` +
    `${F}>[data-slot=rail]>[data-slot=places]>*{width:auto;min-width:0}` +
    `${F}>[data-slot=rail]>[data-slot=places]>:nth-child(n+6){display:none}` +
    `${F}>[data-slot=rail] [data-slot=more]{order:9}` +
    `${F}>[data-slot=rail]>[data-slot=strip]{display:none}` +
    `${F}>[data-slot=rail]>[data-slot=foot]{grid-row:auto;padding:0}` +
    `${F}>[data-slot=list]{position:fixed;top:44px;left:0;right:0;bottom:calc(56px + env(safe-area-inset-bottom));width:100%}` +
    `${F}>[data-slot=list]>*{width:100%!important}` +
    `${F}>[data-slot=scrim]{top:44px;bottom:calc(56px + env(safe-area-inset-bottom))}` +
    `${F} [data-slot=places-list],${F} [data-frame-md]{display:none!important}` +
    `${F} [data-slot=find]>:not(svg){display:none!important}${F} [data-slot=find]{justify-content:center}}`,
].join('')

/** The shell's one animation, for a control that is busy. See rule 6. */
export const SPIN = 'hanzo-spin 700ms linear infinite'

/**
 * Inject the shell's base stylesheet once (idempotent).
 *
 * An INSERTION effect, so the rules are in the document before React lays out
 * the tree that needs them. With a plain effect they landed after the first
 * paint, and a frame whose grid lives here drew one frame of its columns
 * stacked in source order before snapping into place.
 */
export function useShellStyles(): void {
  useInsertionEffect(() => inject(STYLE_ID, CSS), [])
}

/**
 * The frame's layout, under its own id. A host that mounted another copy of
 * this package first already holds a `hanzo-shell-styles` element without these
 * rules, and the once-only check would read it as done.
 */
export function useFrameStyles(): void {
  useInsertionEffect(() => inject('hanzo-frame-styles', FRAME_CSS), [])
}

function inject(id: string, css: string): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = css
  document.head.appendChild(el)
}
