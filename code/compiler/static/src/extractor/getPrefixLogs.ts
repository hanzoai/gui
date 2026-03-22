import { Color, colorString } from '@hanzo/gui-cli-color'
import type { GuiOptions } from '../types'

export function getPrefixLogs(options?: GuiOptions) {
  return (
    options?.prefixLogs ??
    ` 🐥 [hanzo-gui]  ${colorString(Color.FgYellow, options?.platform || 'web')}`
  )
}
