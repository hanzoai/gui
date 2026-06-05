/// <reference types="vitest" />
// E2E config — drives a real browser (Playwright) against the running local
// runtime. Separate from the unit config (which is jsdom, src/ only).
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['e2e/**/*.e2e.test.ts'],
    testTimeout: 130000,
    hookTimeout: 30000,
    pool: 'forks',
  },
});
