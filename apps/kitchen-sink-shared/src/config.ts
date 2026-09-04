import { defaultConfig } from '@hanzogui/config/v5'
import { animations } from '@hanzogui/config/v5-rn'
import { createGui } from '@hanzo/gui'

export const config = createGui({
  ...defaultConfig,
  animations,
})

export type Conf = typeof config

declare module '@hanzo/gui' {
  interface GuiCustomConfig extends Conf {}
}
