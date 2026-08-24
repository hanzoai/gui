import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledRNW', type: 'useCase' })
})

test(`RNW + styled() + styleable() twice`, async ({ page }) => {
  const inputStyles = await getStyles(page.locator('#styled-rnw-input'))
  expect(inputStyles.fontFamily).toBe(
    `"Zen Pixel Square", "Zen Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
  )
  expect(inputStyles.paddingLeft).toBe(`14px`)
  expect(inputStyles.paddingTop).toBe(`12px`)
})
