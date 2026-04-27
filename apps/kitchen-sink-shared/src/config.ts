import { defaultConfig } from '@hanzogui/config/v5'
import { animations } from '@hanzogui/config/v5-rn'
import { createHanzogui } from 'hanzogui'

export const config = createHanzogui({
  ...defaultConfig,
  animations,
})

export type Conf = typeof config

declare module 'hanzogui' {
  interface HanzoguiCustomConfig extends Conf {}
}
