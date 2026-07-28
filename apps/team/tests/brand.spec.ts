import { expect, test } from '@playwright/test'
import { brandFor } from '../src/brand'

/*
 * Brand is a function of hostname. These run against REAL hostnames — Chromium's
 * host-resolver rules point the app's hosts at the dev server — so what is under
 * test is the wiring and not a stand-in for it.
 *
 * The negatives carry the weight. One brand's mark appearing on another's host is
 * the failure this exists to prevent, and asserting only the positives would pass
 * for an implementation that renders "Hanzo Team" unconditionally.
 */

test('each host renders its own brand', async ({ page }) => {
  for (const [host, name] of [
    ['hanzo.team', 'Hanzo Team'],
    ['team.hanzo.ai', 'Hanzo Team'],
    ['tracker.hanzo.ai', 'Tracker'],
    ['team.lux.network', 'Lux Team'],
  ]) {
    await page.goto(`http://${host}:3000/`)
    await expect(page.locator('nav[aria-label="Views"]')).toContainText(name)
  }
})

test('tracker.hanzo.ai does not render Hanzo Team', async ({ page }) => {
  await page.goto('http://tracker.hanzo.ai:3000/')
  const nav = page.locator('nav[aria-label="Views"]')
  await expect(nav).toContainText('Tracker')
  await expect(nav).not.toContainText('Hanzo Team')
})

test('a non-Hanzo host never renders the Hanzo mark', async ({ page }) => {
  await page.goto('http://team.lux.network:3000/')
  await expect(page.locator('nav[aria-label="Views"]')).toContainText('Lux Team')
  // The mark is chosen by brand.org and the pack ships only Hanzo's, so there is
  // no path that can put it here.
  await expect(page.locator('[data-mark="hanzo"]')).toHaveCount(0)
  await expect(page.locator('[data-mark="lux"]')).toBeVisible()
})

test('a Hanzo host does render the Hanzo mark', async ({ page }) => {
  await page.goto('http://hanzo.team:3000/')
  await expect(page.locator('[data-mark="hanzo"]')).toBeVisible()
})

test('an unclaimed host resolves to no brand', () => {
  // Pure resolution, so it is asserted directly rather than through a page. The
  // rendering tests above cover the wiring from window.location.hostname.
  expect(brandFor('evil.example.com')).toBeUndefined()
  // Another Hanzo surface's host: this app does not serve it, so it gets no brand
  // here even though it is a legitimate Hanzo domain.
  expect(brandFor('hanzo.chat')).toBeUndefined()
  expect(brandFor('')).toBeUndefined()
  expect(brandFor(undefined)).toBeUndefined()

  // A subdomain of a claimed host still belongs to it.
  expect(brandFor('eu.hanzo.team')?.id).toBe('team')

  // The specific host wins over the broader one it sits under. This is exactly
  // where @hanzogui/shell's findSurfaceByHost resolves "Hanzo" instead.
  expect(brandFor('tracker.hanzo.ai')?.id).toBe('tracker')
  expect(brandFor('team.hanzo.ai')?.id).toBe('team')
})
