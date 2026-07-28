import { expect, test, type Page } from '@playwright/test'

/*
 * The chrome: it renders, the sidebar navigates, cmd+k opens, the switcher lists
 * workspaces grouped by org, and a Svelte view mounts in the content area.
 *
 * The account RPC is served at the network boundary. Everything above it — the
 * client, the grouping, the menu — is the real code; only the transport is stood
 * in for, because a real token needs an interactive hanzo.id sign-in.
 */

const RPC = '**/v1/team/account'

async function signedIn(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem('hanzo-team-token', 'test-token')
  })
  await page.route(RPC, async (route) => {
    const method = (route.request().postDataJSON() as { method: string }).method
    if (method === 'getLoginInfoByToken') {
      await route.fulfill({
        json: { result: { account: 'z@zoo.ngo', name: 'Z', socialId: 's1' } },
      })
      return
    }
    if (method === 'getUserWorkspaces') {
      await route.fulfill({
        json: {
          result: [
            { uuid: 'u1', name: 'Hanzo Core', url: 'core', org: 'hanzo', region: '', mode: 'active', isDisabled: false },
            { uuid: 'u2', name: 'Hanzo Labs', url: 'labs', org: 'hanzo', region: '', mode: 'active', isDisabled: false },
            { uuid: 'u3', name: 'Zoo Research', url: 'zoo', org: 'zoo', region: '', mode: 'active', isDisabled: false },
          ],
        },
      })
      return
    }
    await route.fulfill({ json: { error: { code: 'account:status:UnknownMethod' } } })
  })
}

test('the shell renders its frame', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('nav[aria-label="Views"]')).toBeVisible()
  await expect(page.locator('header[role="banner"]')).toBeVisible()
  await expect(page.locator('[data-shell="content"]')).toBeVisible()
  await expect(page.locator('[data-shell="title"]')).toHaveText('Home')
})

test('navigating every view raises nothing on the console', async ({ page }) => {
  // A thrown ReferenceError blanks the page while element assertions elsewhere go
  // on passing against a stale tree, so a suite without this guard can be green
  // over a broken app. Both engines report here: a Svelte mount failure and a
  // React render failure land on the same console.
  const noise: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') noise.push(m.text())
  })
  page.on('pageerror', (e) => noise.push(`pageerror: ${e.message}`))

  await page.goto('/')
  for (const id of ['session', 'facts', 'home']) {
    await page.click(`[data-view="${id}"]`)
    await expect(page.locator('[data-shell="content"]')).toBeVisible()
  }

  expect(noise).toEqual([])
})

test('the sidebar drives which view is active', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-view="home"]')).toHaveAttribute('aria-current', 'page')

  await page.click('[data-view="session"]')
  await expect(page.locator('[data-shell="title"]')).toHaveText('Session')
  await expect(page.locator('[data-view="session"]')).toHaveAttribute('aria-current', 'page')
  // Selection is exclusive — two views cannot both be current.
  await expect(page.locator('[aria-current="page"]')).toHaveCount(1)
})

test('a Svelte view mounts in the content area and matches its React twin', async ({ page }) => {
  await page.goto('/')

  await page.click('[data-view="session"]')
  await expect(page.locator('[data-facts="engine"]')).toHaveText('React')
  const react = await page.locator('[data-shell="content"] dl').innerText()

  await page.click('[data-view="facts"]')
  await expect(page.locator('[data-facts="engine"]')).toHaveText('Svelte')
  const svelte = await page.locator('[data-shell="content"] dl').innerText()

  // Same facts, same layout, only the engine label differs. That equivalence is
  // what says a half-migrated shell still looks like one product.
  expect(svelte.replace('Svelte', 'React')).toBe(react)
})

test('cmd+k opens the palette and navigates', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-palette="input"]')).toHaveCount(0)

  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.locator('[data-palette="input"]')).toBeVisible()

  await page.locator('[data-palette="input"]').fill('Svelte')
  await page.click('[data-palette-view="facts"]')

  await expect(page.locator('[data-palette="input"]')).toHaveCount(0)
  await expect(page.locator('[data-shell="title"]')).toHaveText('Session · Svelte')
})

test('signed out, the shell offers hanzo.id and no credential form', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-account="out"]')).toBeVisible()
  // hanzo.id is the only door: there is deliberately no local password to type.
  await expect(page.locator('input[type="password"]')).toHaveCount(0)
})

test('sign-in delegates to the backend hop rather than to hanzo.id directly', async ({ page }) => {
  await page.goto('/')
  // Stop at the first hop so the assertion is about where we send the browser.
  await page.route('**/v1/team/account/auth/openid', (route) =>
    route.fulfill({ status: 200, body: 'intercepted' }),
  )
  await page.click('[data-account="out"]')
  await page.waitForURL(/\/v1\/team\/account\/auth\/openid$/)
  expect(page.url()).toContain('/v1/team/account/auth/openid')
})

test('the switcher lists workspaces grouped by org and switches', async ({ page }) => {
  await signedIn(page)
  await page.goto('/')

  await expect(page.locator('[data-account="in"]')).toContainText('Z')
  await page.click('[data-account="in"]')

  await expect(page.locator('[data-workspace="core"]')).toBeVisible()
  await expect(page.locator('[data-workspace="zoo"]')).toBeVisible()
  await expect(page.locator('[data-account-link="settings"]')).toBeVisible()
  await expect(page.locator('[data-account-link="out"]')).toBeVisible()

  // Grouped by owning org, because getUserWorkspaces unions across orgs.
  const menu = page.locator('[role="menu"]')
  await expect(menu).toContainText('hanzo')
  await expect(menu).toContainText('zoo')

  // The first workspace is current until another is chosen.
  await expect(page.locator('[data-workspace="core"]')).toHaveAttribute('aria-current', 'true')
  await page.click('[data-workspace="zoo"]')

  await page.click('[data-view="session"]')
  await expect(page.locator('[data-facts="workspace"]')).toHaveText('zoo')
})

test('the workspace reaches a Svelte view as a prop', async ({ page }) => {
  await signedIn(page)
  await page.goto('/')
  await expect(page.locator('[data-account="in"]')).toBeVisible()

  await page.click('[data-view="facts"]')
  await expect(page.locator('[data-facts="workspace"]')).toHaveText('core')
  await expect(page.locator('[data-facts="token"]')).toHaveText('present')
})
