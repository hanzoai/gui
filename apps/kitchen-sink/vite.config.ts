import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
// @ts-ignore vite types require moduleResolution bundler
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: true,
  plugins: [
    // hanzoguiPlugin({
    //   components: ['@hanzogui/sandbox-ui', 'hanzogui'],
    //   config: 'src/hanzogui.config.ts',
    //   optimize: process.env.EXTRACT === '1',
    // }),
  ].filter(Boolean),
})
