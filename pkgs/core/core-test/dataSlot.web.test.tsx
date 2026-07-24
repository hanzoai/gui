import { GuiProvider, View, createGui, styled } from '@hanzogui/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultGuiConfig } from '../config-default'

const config = createGui(getDefaultGuiConfig('web'))

const wrap = (ui: React.ReactNode) =>
  render(
    <GuiProvider config={config} defaultTheme="light">
      {ui}
    </GuiProvider>
  )

// Named styled() components self-describe with a neutral, standard `data-slot`
// (component name, kebab-cased) so a tracker like track.js `annotate` can capture
// DOM structure with zero per-app config. Mirrors shadcn's convention exactly.
describe('data-slot annotation', () => {
  test('a named component stamps data-slot = kebab(name)', () => {
    const Button = styled(View, { name: 'Button' })
    const { container } = wrap(<Button />)
    expect(container.querySelector('[data-slot="button"]')).not.toBeNull()
  })

  test('multi-word names kebab-case correctly', () => {
    const ListItem = styled(View, { name: 'ListItem' })
    const { container } = wrap(<ListItem />)
    expect(container.querySelector('[data-slot="list-item"]')).not.toBeNull()
  })

  test('an explicit data-slot overrides the default', () => {
    const Button = styled(View, { name: 'Button' })
    const { container } = wrap(<Button data-slot="add-to-cart" />)
    expect(container.querySelector('[data-slot="add-to-cart"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="button"]')).toBeNull()
  })

  test('base View (no componentName) carries no data-slot', () => {
    const { container } = wrap(<View id="raw" />)
    const el = container.querySelector('#raw')!
    expect(el).not.toBeNull()
    expect(el.hasAttribute('data-slot')).toBe(false)
  })

  // schema.org microdata is a standard prop pass-through: authors opt a component
  // into semantic meaning (Product, Offer, AddAction, SiteNavigationElement, ...)
  // and the attributes land on the host node untouched.
  test('schema.org microdata props forward to the host node', () => {
    const Card = styled(View, { name: 'Card' })
    const { container } = wrap(
      <Card itemScope itemType="https://schema.org/Product" itemProp="offers" />
    )
    const el = container.querySelector('[data-slot="card"]')!
    expect(el).not.toBeNull()
    expect(el.hasAttribute('itemscope')).toBe(true)
    expect(el.getAttribute('itemtype')).toBe('https://schema.org/Product')
    expect(el.getAttribute('itemprop')).toBe('offers')
  })
})
