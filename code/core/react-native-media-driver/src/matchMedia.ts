// web-only use platform:

import type { MatchMedia } from '@hanzo/gui-web'

export const matchMedia: MatchMedia = globalThis['matchMedia']
