import { animations } from './animations.reanimated.ts'
import { configWithoutAnimations } from './config.ts'
export * from './media.ts'
export * from './createGenericFont.ts'
export * from './animations.reanimated.ts'

export const config = {
  ...configWithoutAnimations,
  animations,
}
