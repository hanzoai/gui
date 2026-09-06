import type { config } from '@my/config'

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}
