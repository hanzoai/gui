import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Focus Leave Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'MenuFocusLeaveCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  /**
   * Bug 1: When leaving the menu entirely, focus style stays on last element.
   * Expected: When mouse leaves the menu, no items should have the focus highlight.
   */
  test('focus style clears when mouse leaves menu entirely', async ({ page }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const item1 = page.getByTestId('menu-item-1')

    // hover item 1 - it should be focused and highlighted
    await item1.hover()
    await page.waitForTimeout(100)
    await expect(item1).toBeFocused()

    const item1BgWhenFocused = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    const hasHighlightAttr = await item1.getAttribute('data-highlighted')
    expect(hasHighlightAttr).toBe('')

    // move mouse outside the menu using raw mouse.move to avoid the portal overlay issue
    // get the menu bounds and move outside of them
    const menuBox = await menuContent.boundingBox()
    if (!menuBox) throw new Error('Could not get menu bounds')

    // move mouse below and to the left of the menu (outside the content)
    await page.mouse.move(menuBox.x - 50, menuBox.y + menuBox.height + 50)
    await page.waitForTimeout(200)

    // CRITICAL: item1 should no longer have the highlight
    const item1BgAfterLeave = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    const hasHighlightAttrAfter = await item1.getAttribute('data-highlighted')

    // the highlight attribute should be removed
    expect(hasHighlightAttrAfter).toBeNull()
    // the background should be different (default, not highlighted)
    expect(item1BgAfterLeave).not.toBe(item1BgWhenFocused)
  })

  /**
   * Bug 2: Two items can appear focused when moving quickly from one submenu
   * trigger to another submenu trigger below it while the first submenu is
   * animating open.
   *
   * Scenario:
   * 1. Hover first submenu trigger (it starts opening its submenu)
   * 2. Move quickly down to the second submenu trigger below
   * 3. Only ONE item should have the focus highlight, not both
   */
  test('only one item highlighted when moving from submenu trigger to another below', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const submenuTrigger1 = page.getByTestId('submenu-trigger-1')
    const submenuTrigger2 = page.getByTestId('submenu-trigger-2')

    // hover the first submenu trigger
    await submenuTrigger1.hover()
    await page.waitForTimeout(50) // brief hover, not enough for submenu to fully open

    // confirm trigger is focused
    await expect(submenuTrigger1).toBeFocused()

    // move quickly to the second submenu trigger below
    const trigger1Box = await submenuTrigger1.boundingBox()
    const trigger2Box = await submenuTrigger2.boundingBox()

    if (trigger1Box && trigger2Box) {
      // move mouse in a quick path from trigger 1 to trigger 2
      await page.mouse.move(
        trigger1Box.x + trigger1Box.width / 2,
        trigger1Box.y + trigger1Box.height
      )
      await page.mouse.move(
        trigger2Box.x + trigger2Box.width / 2,
        trigger2Box.y + trigger2Box.height / 2
      )
    }

    await page.waitForTimeout(150)

    // CRITICAL: only submenuTrigger2 should be highlighted, not both
    const trigger1Highlight = await submenuTrigger1.getAttribute('data-highlighted')
    const trigger2Highlight = await submenuTrigger2.getAttribute('data-highlighted')

    // the second trigger should be highlighted
    expect(trigger2Highlight).toBe('')

    // the first trigger should NOT be highlighted
    expect(trigger1Highlight).toBeNull()
  })

  /**
   * Bug 2b: More specific test - when moving at a very specific speed
   * during the submenu opening animation, both triggers can appear focused.
   */
  test('no double highlight during submenu open with rapid downward movement', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const submenuTrigger1 = page.getByTestId('submenu-trigger-1')
    const submenuTrigger2 = page.getByTestId('submenu-trigger-2')

    // get bounding boxes
    const trigger1Box = await submenuTrigger1.boundingBox()
    const trigger2Box = await submenuTrigger2.boundingBox()

    if (!trigger1Box || !trigger2Box) {
      throw new Error('Could not get bounding boxes')
    }

    // hover first submenu trigger to start opening
    await page.mouse.move(
      trigger1Box.x + trigger1Box.width / 2,
      trigger1Box.y + trigger1Box.height / 2
    )
    await page.waitForTimeout(60) // just after the 100ms open delay starts

    // now move down at varying speeds to try to trigger the bug
    // the bug happens at a specific speed where submenu is animating
    for (let i = 0; i < 5; i++) {
      const y = trigger1Box.y + trigger1Box.height / 2 + i * 5
      await page.mouse.move(trigger1Box.x + trigger1Box.width / 2, y)
      await page.waitForTimeout(15)
    }

    // move to second submenu trigger
    await page.mouse.move(
      trigger2Box.x + trigger2Box.width / 2,
      trigger2Box.y + trigger2Box.height / 2
    )
    await page.waitForTimeout(150)

    // count how many items have the highlight
    const allHighlighted = await menuContent.locator('[data-highlighted]').count()

    // CRITICAL: should only be 1 highlighted item
    expect(allHighlighted).toBeLessThanOrEqual(1)

    // if trigger2 is highlighted, trigger1 should not be
    const trigger2Highlight = await submenuTrigger2.getAttribute('data-highlighted')
    if (trigger2Highlight === '') {
      const trigger1Highlight = await submenuTrigger1.getAttribute('data-highlighted')
      expect(trigger1Highlight).toBeNull()
    }
  })
})
