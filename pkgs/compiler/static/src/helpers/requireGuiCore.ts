// this allows us to swap between core native and web in the same process:

import type { GuiPlatform } from '../types'

export function requireGuiCore(
  platform: GuiPlatform,
  ogRequire: Function = require
): typeof import('@hanzogui/core') {
  if (!platform) {
    throw new Error(`No platform given to requireGuiCore`)
  }

  // avoid tree shaking out themes
  const og1 = process.env.GUI_IS_SERVER
  const og2 = process.env.GUI_KEEP_THEMES
  process.env.GUI_IS_SERVER ||= '1'
  process.env.GUI_KEEP_THEMES ||= '1'

  const exported = ogRequire(
    platform === 'native' ? '@hanzogui/core/native' : '@hanzogui/core'
  )

  // restore back
  process.env.GUI_IS_SERVER = og1
  process.env.GUI_KEEP_THEMES = og2

  return exported
}
