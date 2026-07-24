// @hanzogui/chrome — the ONE unified public-site chrome shared across Hanzo
// marketing surfaces (hanzo.ai, hanzo.chat, lux, zoo, …).
//
//   import { HanzoNav, HanzoFooter, ChatHero, HanzoWidget } from '@hanzogui/chrome'
//
// Built in Tamagui `styled()` + a committed monochrome token module (Geist,
// zinc-on-black), matching the canonical hanzo.ai landing. Presentational and
// host-agnostic: all content (nav items, footer columns, CTA links, pills) and
// all effects (analytics, navigation) are injected as props / callbacks.
//
// Sibling package @hanzogui/shell owns the AUTHENTICATED tenant chrome
// (HanzoAppBar, TenantHeader, org switcher); this package owns the PUBLIC
// marketing chrome. Separation of concerns — one name each.

export { HanzoNav } from './HanzoNav'
export type { HanzoNavProps, HanzoNavLoginProps, HanzoNavPrimaryProps } from './HanzoNav'

export { HanzoFooter } from './HanzoFooter'
export type { HanzoFooterProps } from './HanzoFooter'

export { ChatHero } from './ChatHero'
export type { ChatHeroProps, HeroPill, HeroIcon } from './ChatHero'

export { HanzoWidget } from './HanzoWidget'
export type { HanzoWidgetProps } from './HanzoWidget'

export type { NavItem, NavLink, NavColumn } from './types'

// Design tokens — the monochrome palette + Geist stack, in case a host wants to
// match the chrome exactly in its own sections.
export { palette, c as chromeColors, FONT as CHROME_FONT } from './tokens'
