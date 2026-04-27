// this allows us to swap between core native and web in the same process:

import type { HanzoguiPlatform } from '../types'

export function requireHanzoguiCore(
  platform: HanzoguiPlatform,
  ogRequire: Function = require
): typeof import('@hanzogui/core') {
  if (!platform) {
    throw new Error(`No platform given to requireHanzoguiCore`)
  }

  // avoid tree shaking out themes
  const og1 = process.env.TAMAGUI_IS_SERVER
  const og2 = process.env.TAMAGUI_KEEP_THEMES
  process.env.TAMAGUI_IS_SERVER ||= '1'
  process.env.TAMAGUI_KEEP_THEMES ||= '1'

  const exported = ogRequire(
    platform === 'native' ? '@hanzogui/core/native' : '@hanzogui/core'
  )

  // restore back
  process.env.TAMAGUI_IS_SERVER = og1
  process.env.TAMAGUI_KEEP_THEMES = og2

  return exported
}
