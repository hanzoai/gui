import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  plugins: [
    hanzoguiPlugin({
      components: ['hanzogui'],
      config: 'src/hanzogui.config.ts',
      useReactNativeWebLite: true,
    }),
  ].filter(Boolean),
})
