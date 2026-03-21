import { Color, colorString } from '@hanzo/gui-cli-color'
import type { TamaguiOptions } from '../types'

export function getPrefixLogs(options?: TamaguiOptions) {
  return (
    options?.prefixLogs ??
    ` 🐥 [tamagui]  ${colorString(Color.FgYellow, options?.platform || 'web')}`
  )
}
