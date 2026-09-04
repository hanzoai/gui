import { Color, colorString } from '@hanzogui/cli-color'
import type { GuiOptions } from '../types.ts'

export function getPrefixLogs(options?: GuiOptions) {
  return (
    options?.prefixLogs ??
    ` 🐥 [hanzogui]  ${colorString(Color.FgYellow, options?.platform || 'web')}`
  )
}
