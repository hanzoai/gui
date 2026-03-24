// web-only use platform:

import type { MatchMedia } from '@hanzogui/web'

export const matchMedia: MatchMedia = globalThis['matchMedia']
