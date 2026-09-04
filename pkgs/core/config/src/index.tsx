import { themes } from '@hanzogui/themes'

import { animations } from './animations.ts'
import { configWithoutAnimations } from './config.ts'

export { configWithoutAnimations } from './config.ts'
export * from './media.ts'
export * from './createGenericFont.ts'
export * from './animations.ts'

export const config = {
  ...configWithoutAnimations,
  // fixes typescript exporting this using internal /types/ path
  themes: themes as typeof themes,
  animations,
}
