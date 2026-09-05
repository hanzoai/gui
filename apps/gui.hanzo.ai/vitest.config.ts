import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': __dirname,
      // The web build of every gui package names react-native and the bundler answers with the web one.
      'react-native': 'react-native-web',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    root: __dirname,
  },
})
