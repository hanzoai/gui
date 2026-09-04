// @hanzogui/chrome — presentational marketing SECTIONS (hero, widget, footer).
//
//   import { HanzoFooter, ChatHero, HanzoWidget } from '@hanzogui/chrome'
//
// THE HEADER LIVES IN @hanzogui/shell. `HanzoNav` used to live here and was a
// second, drifting implementation of the public header: uppercase section
// heads, its own hover palette, a "Log in" dropdown next to a second CTA
// dropdown. Two packages both claiming to be "the ONE public chrome" is how the
// navs diverged in the first place, so it is deleted rather than restyled —
// there is one header, `HanzoHeader` from @hanzogui/shell, and one set of
// tokens behind it (shell's `theme.ts`).
//
// Built in Gui `styled()` + a committed monochrome token module (Zen,
// zinc-on-black). Presentational and host-agnostic: all content and all effects
// are injected as props / callbacks.

export { HanzoFooter } from './HanzoFooter.tsx'
export type { HanzoFooterProps } from './HanzoFooter.tsx'

export { ChatHero } from './ChatHero.tsx'
export type { ChatHeroProps, HeroPill, HeroIcon } from './ChatHero.tsx'

export { HanzoWidget } from './HanzoWidget.tsx'
export type { HanzoWidgetProps } from './HanzoWidget.tsx'

export type { NavItem, NavLink, NavColumn } from './types.ts'

// Design tokens — the monochrome palette + Zen stack, in case a host wants to
// match the chrome exactly in its own sections.
export { palette, c as chromeColors, FONT as CHROME_FONT } from './tokens.ts'
