import { defaultConfig } from '@hanzogui/config/v5'
import { animations } from '@hanzogui/config/v5-rn'
import { createGui } from '@hanzo/gui'

export const config = createGui({
  ...defaultConfig,
  animations,
})

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}
