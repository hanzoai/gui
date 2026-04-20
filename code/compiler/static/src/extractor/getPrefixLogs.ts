import { Color, colorString } from '@hanzogui/cli-color'
import type { HanzoguiOptions } from '../types'

export function getPrefixLogs(options?: HanzoguiOptions) {
  return (
    options?.prefixLogs ??
    ` 🐥 [hanzogui]  ${colorString(Color.FgYellow, options?.platform || 'web')}`
  )
}
