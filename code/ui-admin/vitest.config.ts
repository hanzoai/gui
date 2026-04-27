import { defineConfig } from 'vitest/config'

// jsdom env is required because useFetch + tz both touch
// `window` / `localStorage`. Tests that don't need the DOM still
// run fine in jsdom; the perf cost is negligible for this many.
//
// `react-native` aliases to `react-native-web` so Hanzo GUI primitives
// resolve their RN imports to the web shim under jsdom — without this
// every test importing `<XStack>` etc. fails at module load.
//
// `react-native-svg` aliases to the Hanzo workspace shim because
// upstream react-native-svg pulls in fabric/codegen native components
// that don't exist on react-native-web (same reason as the Vite build
// alias in admin-tasks/vite.config.ts).
export default defineConfig({
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@hanzogui/react-native-svg',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
  },
})
