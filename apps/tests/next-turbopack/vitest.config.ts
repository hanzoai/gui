import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    include: ['**/*.unit.test.ts'],
    // Each test spawns the CLI, and one of them a Next build.
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
})
