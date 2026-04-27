import { expect, test } from '@playwright/test'

test('ScrollView showsHorizontalScrollIndicator={false} hides scrollbar', async ({
  page,
}) => {
  await page.goto('/test/scrollview-hide-scrollbar')
  await page.waitForSelector('[data-testid="scroll-h-hidden"]')

  const el = page.locator('[data-testid="scroll-h-hidden"]')
  const scrollbarWidth = await el.evaluate(
    (el) => window.getComputedStyle(el).scrollbarWidth
  )

  expect(scrollbarWidth).toBe('none')
})

test('ScrollView showsVerticalScrollIndicator={false} hides scrollbar', async ({
  page,
}) => {
  await page.goto('/test/scrollview-hide-scrollbar')
  await page.waitForSelector('[data-testid="scroll-v-hidden"]')

  const el = page.locator('[data-testid="scroll-v-hidden"]')
  const scrollbarWidth = await el.evaluate(
    (el) => window.getComputedStyle(el).scrollbarWidth
  )

  expect(scrollbarWidth).toBe('none')
})

test('ScrollView showsHorizontalScrollIndicator={true} does NOT hide scrollbar', async ({
  page,
}) => {
  await page.goto('/test/scrollview-hide-scrollbar')
  await page.waitForSelector('[data-testid="scroll-h-visible"]')

  const el = page.locator('[data-testid="scroll-h-visible"]')
  const scrollbarWidth = await el.evaluate(
    (el) => window.getComputedStyle(el).scrollbarWidth
  )

  expect(scrollbarWidth).not.toBe('none')
})
