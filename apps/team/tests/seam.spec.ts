import { expect, test, type Page } from '@playwright/test'

/*
 * The seam's lifecycle contract.
 *
 * Leaking one Svelte instance per navigation is the failure mode that matters, and
 * it is invisible in the DOM: React removes the seam's host element, so the page
 * looks clean while the orphaned instance keeps its effects and listeners. These
 * assertions read the instance and listener counters instead, which is the only
 * way the leak is observable.
 */

const HARNESS = '/tests/probe/index.html'

interface Counters {
  live: number
  mounts: number
  destroys: number
  listeners: number
}

const counters = (page: Page): Promise<Counters> =>
  page.evaluate(() => (globalThis as unknown as { probe: Counters }).probe)

test('a Svelte view mounts inside React and receives its props', async ({ page }) => {
  await page.goto(HARNESS)
  await expect(page.locator('[data-probe="workspace"]')).toHaveText('ws-0')
  await expect(page.locator('[data-probe="token"]')).toHaveText('absent')
})

test('a prop change reaches a live view without remounting it', async ({ page }) => {
  await page.goto(HARNESS)
  await expect(page.locator('[data-probe="workspace"]')).toHaveText('ws-0')

  const before = await counters(page)
  await page.click('[data-probe-action="bump"]')

  await expect(page.locator('[data-probe="workspace"]')).toHaveText('ws-1')

  const after = await counters(page)
  // The value changed, so props were delivered. Nothing was rebuilt to deliver
  // them — a seam that remounted on every prop change would show mounts climbing.
  expect(after.mounts).toBe(before.mounts)
  expect(after.destroys).toBe(before.destroys)
  expect(after.live).toBe(1)
})

test('cycling mount and unmount 25 times leaks no instance and no listener', async ({ page }) => {
  await page.goto(HARNESS)
  await expect(page.locator('[data-probe="workspace"]')).toBeVisible()

  for (let i = 0; i < 25; i++) {
    await page.click('[data-probe-action="toggle"]') // unmount
    await expect(page.locator('[data-probe-state="off"]')).toBeAttached()
    await page.click('[data-probe-action="toggle"]') // mount
    await expect(page.locator('[data-probe-state="on"]')).toBeAttached()
  }

  const mid = await counters(page)
  expect(mid.mounts).toBe(26) // the first mount plus 25 more
  expect(mid.destroys).toBe(25)
  expect(mid.live).toBe(1) // exactly the one on screen
  expect(mid.listeners).toBe(1)

  // Take the last one away too: nothing at all should remain alive.
  await page.click('[data-probe-action="toggle"]')
  await expect(page.locator('[data-probe="workspace"]')).toHaveCount(0)

  const end = await counters(page)
  expect(end.destroys).toBe(26)
  expect(end.live).toBe(0)
  expect(end.listeners).toBe(0)
})
