// Hanzo GUI v7 config for the @hanzogui/admin shared chrome.
//
// This file exists for one reason: typing. The shared chrome under
// pkgs/ui-admin/ is published as a library (`@hanzogui/admin`) and
// runs its own `tsc --noEmit` in isolation. Without a config file
// here, the umbrella `hanzogui` types cannot resolve a concrete
// `HanzoguiCustomConfig` — every shorthand prop (`p`, `px`, `bg`,
// `rounded`, `items`, `justify`, `gap`, `maxW`, ...) widens and the
// type checker rejects valid JSX. Each consumer app already declares
// its own augmentation (see apps/admin-tasks/hanzogui.config.ts) but
// that augmentation is invisible to this package's standalone build.
//
// The runtime never executes this file. We import the canonical v5
// default (the same shape every Hanzo GUI surface uses) and re-declare
// the module augmentation so this package's tsc run sees the full
// shorthand contract. No theme overrides, no token mutation — brand
// recoloring lives at the consumer level via CSS variables, never by
// spreading themes through a JS module (that breaks getThemeProxied()).

import { defaultConfig } from '@hanzogui/config/v5'
import { createHanzogui } from 'hanzogui'

export const config = createHanzogui(defaultConfig)

export default config

export type Conf = typeof config

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}
}
declare module '@hanzogui/web' {
  interface HanzoguiCustomConfig extends Conf {}
}
