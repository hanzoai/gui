import type { MatchMedia } from '@hanzogui/web'

import { NativeMediaQueryList } from './mediaQueryList'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
