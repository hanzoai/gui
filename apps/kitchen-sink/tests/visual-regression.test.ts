import { test, expect } from '@playwright/test'

/**
 * Visual-regression gate — HIP-0504 §rule 6.
 *
 * Decomplecting the design system (re-basing @hanzo/ui onto @hanzo/gui, then
 * the brand overlays) MUST NOT change the user-visible pixels. This suite
 * renders the component gallery and asserts each surface matches a committed
 * baseline within tolerance.
 *
 * Workflow:
 *   1. On the PRE-migration ref, capture the baseline:
 *        pnpm exec playwright test visual-regression --update-snapshots
 *      Commit the generated __screenshots__/ as the contract.
 *   2. On every migration PR, run the suite unchanged. Any pixel drift beyond
 *      tolerance fails the gate — the implementation changed, the output did not.
 *
 * Non-animated (default project) so snapshots are deterministic; animations are
 * frozen at capture time. Run once with the default driver, not across drivers.
 */

// Stable, brand-agnostic surfaces of the gallery. Extend as demos gain anchors.
const SURFACES = [
  { name: 'gallery-full', path: '/' },
  { name: 'buttons', path: '/#buttons' },
  { name: 'inputs', path: '/#inputs' },
  { name: 'cards', path: '/#cards' },
  { name: 'dialogs', path: '/#dialogs' },
  { name: 'sheets', path: '/#sheets' },
  { name: 'typography', path: '/#typography' },
]

// Tolerance: tiny sub-pixel AA differences across runs are allowed; structural
// or color drift is not. Keep this tight — the contract is "same look/feel".
const SNAPSHOT_OPTS = {
  animations: 'disabled' as const,
  maxDiffPixelRatio: 0.01,
  fullPage: true,
}

for (const surface of SURFACES) {
  test(`look/feel stable — ${surface.name}`, async ({ page }) => {
    await page.goto(surface.path)
    // Let fonts + layout settle so the baseline is deterministic.
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot(`${surface.name}.png`, SNAPSHOT_OPTS)
  })
}
