import type { AnimationDriver } from '../types.tsx'

const noAnimationDriver = (method: string): any => {
  console.warn(
    `No animation driver configured. To use ${method}, you must pass \`animations\` to createGui. See: https://hanzogui.dev/docs/core/animations`
  )
}

const createEmptyAnimationDriver = (): AnimationDriver => ({
  isReactNative: false,
  inputStyle: 'css',
  outputStyle: 'css',
  isStub: true,
  animations: {},
  useAnimations: () => noAnimationDriver('animations'),
  usePresence: () => noAnimationDriver('usePresence'),
  ResetPresence: () => noAnimationDriver('ResetPresence'),
  useAnimatedNumber: () => noAnimationDriver('useAnimatedNumber'),
  useAnimatedNumberStyle: () => noAnimationDriver('useAnimatedNumberStyle'),
  useAnimatedNumbersStyle: () => noAnimationDriver('useAnimatedNumbersStyle'),
  useAnimatedNumberReaction: () => noAnimationDriver('useAnimatedNumberReaction'),
})

export const defaultAnimationDriver = createEmptyAnimationDriver()
