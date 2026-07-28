import { defineConfig } from '@playwright/test'

// Brand is a function of hostname, so the tests need REAL hostnames rather than a
// stand-in for one. `--host-resolver-rules` points the app's actual hosts at the
// local dev server, which is what makes tests/brand.spec.ts able to assert that
// tracker.hanzo.ai does not render Hanzo Team's mark.
const hosts = ['hanzo.team', 'team.hanzo.ai', 'tracker.hanzo.ai', 'team.lux.network']

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    launchOptions: {
      // No spaces after the commas — Chromium takes them as part of the next host.
      args: [`--host-resolver-rules=${hosts.map((h) => `MAP ${h} 127.0.0.1`).join(',')}`],
    },
  },
  webServer: {
    // Bind IPv4 explicitly. Vite's default `localhost` resolves to [::1] here, and
    // the resolver rules above send the browser to 127.0.0.1 — mismatched families
    // present as ERR_CONNECTION_REFUSED rather than as a bind error.
    command: 'vite --host 127.0.0.1 --port 3000 --strictPort',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
