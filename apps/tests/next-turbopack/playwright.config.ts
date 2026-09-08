import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: /\.integration\.test\.ts$/,
  // a test's time covers its hooks, so the first one also pays to launch
  // chromium. each test then loads the page twice - once to reach an origin it
  // can clear storage on, once to read the theme that follows - and a dev
  // server serves every module unbundled.
  timeout: 90000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3456',
    headless: true,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'bun run dev',
        // wait for the route to answer rather than for the socket to open:
        // turbopack compiles the page on its first request.
        url: 'http://localhost:3456',
        reuseExistingServer: true,
        timeout: 120000,
      },
})
