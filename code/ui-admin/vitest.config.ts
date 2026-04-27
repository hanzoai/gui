import { defineConfig } from 'vitest/config'

// jsdom env is required because useFetch + tz both touch
// `window` / `localStorage`. Tests that don't need the DOM still
// run fine in jsdom; the perf cost is negligible for this many.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
  },
})
