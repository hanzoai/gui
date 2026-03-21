import type { config } from '@my/config'

export type Conf = typeof config

declare module '@hanzo/gui' {
  interface TamaguiCustomConfig extends Conf {}
}
