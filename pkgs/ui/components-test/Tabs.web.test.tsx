import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { createGui, GuiProvider } from '@hanzogui/core'
import { Tabs } from '@hanzogui/tabs'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createGui(getDefaultGuiConfig())

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
  }
  unobserve() {}
  disconnect() {}
} as any

function renderTabs(props: { activationMode?: 'automatic' | 'manual' } = {}) {
  return render(
    <GuiProvider config={conf} defaultTheme="light">
      <Tabs defaultValue="b" {...props}>
        <Tabs.List data-testid="list">
          <Tabs.Tab value="a" data-testid="tab-a">
            A
          </Tabs.Tab>
          <Tabs.Tab value="b" data-testid="tab-b">
            B
          </Tabs.Tab>
          <Tabs.Tab value="c" data-testid="tab-c">
            C
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="a">panel A</Tabs.Content>
        <Tabs.Content value="b">panel B</Tabs.Content>
        <Tabs.Content value="c">panel C</Tabs.Content>
      </Tabs>
    </GuiProvider>
  )
}

const tabsInTabOrder = () =>
  ['tab-a', 'tab-b', 'tab-c'].filter(
    (id) => screen.getByTestId(id).getAttribute('tabindex') === '0'
  )

describe('Tabs keyboard navigation', () => {
  it('keeps a single tab stop, starting on the selected tab', () => {
    renderTabs()
    expect(tabsInTabOrder()).toEqual(['tab-b'])
    expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1')
    expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus with arrow keys without adding tab stops', async () => {
    renderTabs()
    const tabB = screen.getByTestId('tab-b')
    tabB.focus()

    fireEvent.keyDown(tabB, { key: 'ArrowRight' })

    await waitFor(() => expect(screen.getByTestId('tab-c')).toHaveFocus())
    // focus follows the arrow key, the tab stop stays on the selected tab
    expect(tabsInTabOrder()).toEqual(['tab-b'])
    expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1')
    expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1')
  })

  it('wraps with arrow keys and with Home/End', async () => {
    renderTabs()
    const tabB = screen.getByTestId('tab-b')
    tabB.focus()

    fireEvent.keyDown(tabB, { key: 'ArrowLeft' })
    await waitFor(() => expect(screen.getByTestId('tab-a')).toHaveFocus())

    fireEvent.keyDown(screen.getByTestId('tab-a'), { key: 'End' })
    await waitFor(() => expect(screen.getByTestId('tab-c')).toHaveFocus())

    fireEvent.keyDown(screen.getByTestId('tab-c'), { key: 'Home' })
    await waitFor(() => expect(screen.getByTestId('tab-a')).toHaveFocus())
  })

  it('selects the focused tab with Enter and Space, and moves the tab stop with it', async () => {
    renderTabs()
    const tabC = screen.getByTestId('tab-c')
    tabC.focus()
    fireEvent.keyDown(tabC, { key: 'Enter' })

    await waitFor(() =>
      expect(screen.getByTestId('tab-c')).toHaveAttribute('aria-selected', 'true')
    )
    expect(screen.getByTestId('tab-b')).toHaveAttribute('aria-selected', 'false')
    await waitFor(() => expect(tabsInTabOrder()).toEqual(['tab-c']))

    fireEvent.keyDown(screen.getByTestId('tab-a'), { key: ' ' })
    await waitFor(() =>
      expect(screen.getByTestId('tab-a')).toHaveAttribute('aria-selected', 'true')
    )
    await waitFor(() => expect(tabsInTabOrder()).toEqual(['tab-a']))
  })

  it('describes each tab and panel pair', () => {
    renderTabs()
    const tabB = screen.getByTestId('tab-b')
    const panel = screen.getByText('panel B')

    expect(tabB).toHaveAttribute('role', 'tab')
    expect(tabB).toHaveAttribute('aria-selected', 'true')
    expect(tabB).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('role', 'tabpanel')
    expect(panel).toHaveAttribute('aria-labelledby', tabB.id)
    expect(screen.getByTestId('list')).toHaveAttribute('role', 'tablist')
  })
})
