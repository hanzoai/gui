import { guiPlugin } from '@hanzo/gui-vite-plugin'
// @ts-ignore vite types require moduleResolution bundler
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: true,
  plugins: [
    // guiPlugin({
    //   components: ['@hanzo/gui-sandbox-ui', '@hanzo/gui'],
    //   config: 'src/gui.config.ts',
    //   optimize: process.env.EXTRACT === '1',
    // }),
  ].filter(Boolean),
})
