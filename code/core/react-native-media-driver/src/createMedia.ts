import type { MediaQueryObject } from '@hanzo/gui-web'
import { setupMatchMedia } from '@hanzo/gui-web'

import { matchMedia } from './matchMedia'

/**
 * @deprecated you no longer need to call createMedia or import @hanzo/gui-react-native-media-driver at all.
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
