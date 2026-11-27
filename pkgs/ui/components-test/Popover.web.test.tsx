import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { createGui, GuiProvider } from '@hanzogui/core'
import { Button } from '@hanzogui/button'
import { Popover } from '@hanzogui/popover'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const conf = createGui(getDefaultGuiConfig())

// popper reads layout, which jsdom does not do
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

function renderPopover(props: { asChild?: boolean } = {}) {
  return render(
    <GuiProvider config={conf} defaultTheme="light">
      <Popover>
        {props.asChild ? (
          <Popover.Trigger asChild>
            <Button data-testid="trigger">open</Button>
          </Popover.Trigger>
        ) : (
          <Popover.Trigger data-testid="trigger">open</Popover.Trigger>
        )}
        <Popover.Content data-testid="content">
          <span>content</span>
        </Popover.Content>
      </Popover>
    </GuiProvider>
  )
}

describe('Popover keyboard access', () => {
  it('exposes the trigger as a focusable button', () => {
    renderPopover()
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('role', 'button')
    expect(trigger).toHaveAttribute('tabindex', '0')
  })

  it('opens from the keyboard with Enter and closes with Enter again', async () => {
    renderPopover()
    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    expect(trigger).toHaveFocus()

    fireEvent.keyDown(trigger, { key: 'Enter' })
    const content = await screen.findByTestId('content')
    expect(content).toBeVisible()

    fireEvent.keyDown(trigger, { key: 'Enter' })
    await waitFor(() => {
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
  })

  it('opens with Space', async () => {
    renderPopover()
    fireEvent.keyDown(screen.getByTestId('trigger'), { key: ' ' })
    expect(await screen.findByTestId('content')).toBeVisible()
  })

  it('only toggles once when the child is already a native button', async () => {
    renderPopover({ asChild: true })
    const trigger = screen.getByTestId('trigger')
    expect(trigger.tagName).toBe('BUTTON')

    // a native button turns Enter into a click itself; the keydown handler must
    // not toggle a second time or the popover opens and immediately closes
    fireEvent.keyDown(trigger, { key: 'Enter' })
    fireEvent.click(trigger)
    expect(await screen.findByTestId('content')).toBeVisible()
  })

  it('closes on Escape and gives focus back to the trigger', async () => {
    renderPopover()
    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const content = await screen.findByTestId('content')
    await waitFor(() => expect(content).toBeVisible())

    fireEvent.keyDown(content, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
