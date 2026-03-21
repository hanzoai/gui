import type { MatchMedia } from '@hanzo/gui-web'

import { NativeMediaQueryList } from './mediaQueryList'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
