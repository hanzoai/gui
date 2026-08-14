import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { hanzoguiPlugin } from '@hanzogui/vite-plugin'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [reactRouter(), hanzoguiPlugin()],
})
