import type { MediaQueryObject } from '@hanzogui/web'
import { setupMatchMedia } from '@hanzogui/web'

import { matchMedia } from './matchMedia'

/**
 * @deprecated you no longer need to call createMedia or import @hanzogui/react-native-media-driver at all.
 * Hanzo GUI now automatically handles setting this up, you can just pass a plain object to createGui.
 */
export function createMedia<
  A extends {
    [key: string]: MediaQueryObject
  },
>(media: A): A {
  // this should ideally return a diff object that is then passed to createGui
  // but works for now we dont really support swapping out media drivers
  setupMatchMedia(matchMedia)
  return media
}
