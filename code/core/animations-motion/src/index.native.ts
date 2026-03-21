// native stub - animations-motion only works on web (uses framer-motion/motion library)
// on native, use @hanzo/gui-animations-react-native or @hanzo/gui-animations-reanimated

import type { AnimationDriver } from '@hanzo/gui-web'

let hasWarnedOnce = false

export function createAnimations<A extends Record<string, any>>(
  _animations: A
): AnimationDriver<A> {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarnedOnce) {
      hasWarnedOnce = true
      console.warn(
        '[@hanzo/gui-animations-motion] This animation driver only works on web. On native, use @hanzo/gui-animations-react-native or @hanzo/gui-animations-reanimated instead.'
      )
    }
  }

  // return a noop driver
  // @ts-expect-error its an error anyway
  return {
    isReactNative: false,
    animations: _animations,
    View: undefined as any,
    Text: undefined as any,
  }
}
