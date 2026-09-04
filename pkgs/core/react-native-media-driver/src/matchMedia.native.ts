import type { MatchMedia } from '@hanzogui/web'

import { NativeMediaQueryList } from './mediaQueryList.ts'

export const matchMedia: MatchMedia = (query) => {
  return new NativeMediaQueryList(query)
}
