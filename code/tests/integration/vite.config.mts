import { guiPlugin } from '@hanzo/gui-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  plugins: [
    guiPlugin({
      components: ['@hanzo/gui'],
      config: 'src/gui.config.ts',
      useReactNativeWebLite: true,
    }),
  ].filter(Boolean),
})
