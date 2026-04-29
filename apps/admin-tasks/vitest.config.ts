import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Standalone vitest config — we intentionally do NOT extend vite.config.ts
// because the hanzogui static-extractor plugin requires a workspace
// gui.config.ts at runtime which is unrelated to test execution. Tests
// only need React JSX support + jsdom.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@hanzogui/react-native-svg',
    },
    conditions: ['source', 'browser', 'module', 'import', 'default'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: [path.resolve(__dirname, 'src/test/setup.ts')],
    css: false,
    pool: 'threads',
    testTimeout: 10000,
  },
})
