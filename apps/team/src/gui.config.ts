import { defaultConfig } from '@hanzogui/config/v5'
import { createGui } from '@hanzo/gui'

// hanzo monochrome: dark #000 / #0a0a0a / #1f1f1f · light #fff / #f7f7f7 / #ebebeb
export const config = createGui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    dark: {
      ...defaultConfig.themes.dark,
      background: '#000000',
      color1: '#0a0a0a',
      borderColor: '#1f1f1f',
    },
    light: {
      ...defaultConfig.themes.light,
      background: '#ffffff',
      color1: '#f7f7f7',
      borderColor: '#ebebeb',
    },
  },
})

export type Conf = typeof config

declare module 'hanzogui' {
  interface GuiCustomConfig extends Conf {}
}

export default config
