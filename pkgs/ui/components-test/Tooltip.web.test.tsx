import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { createGui, GuiProvider } from '@hanzogui/core'
import { Tooltip } from '@hanzogui/tooltip'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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

describe('Tooltip accessibility', () => {
  it('puts the trigger in the tab order so the tip is reachable without a mouse', () => {
    render(
      <GuiProvider config={conf} defaultTheme="light">
        <Tooltip>
          <Tooltip.Trigger data-testid="trigger">info</Tooltip.Trigger>
          <Tooltip.Content>tip</Tooltip.Content>
        </Tooltip>
      </GuiProvider>
    )

    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('tabindex', '0')
    expect(trigger).toHaveAttribute('role', 'button')
    trigger.focus()
    expect(trigger).toHaveFocus()
  })

  it('marks the tip as a tooltip and points the trigger at it while open', async () => {
    render(
      <GuiProvider config={conf} defaultTheme="light">
        <Tooltip open>
          <Tooltip.Trigger data-testid="trigger">info</Tooltip.Trigger>
          <Tooltip.Content data-testid="content">tip</Tooltip.Content>
        </Tooltip>
      </GuiProvider>
    )

    const trigger = screen.getByTestId('trigger')
    await waitFor(() => {
      expect(trigger.getAttribute('aria-describedby')).toBeTruthy()
    })

    const wrapper = document.getElementById(trigger.getAttribute('aria-describedby')!)
    expect(wrapper).not.toBeNull()
    expect(wrapper).toHaveAttribute('role', 'tooltip')
    expect(screen.getByTestId('content')).toBeVisible()
  })

  it('dismisses the tip with Escape while focus stays on the trigger', async () => {
    const onOpenChange = vi.fn()
    render(
      <GuiProvider config={conf} defaultTheme="light">
        <Tooltip open onOpenChange={onOpenChange}>
          <Tooltip.Trigger data-testid="trigger">info</Tooltip.Trigger>
          <Tooltip.Content data-testid="content">tip</Tooltip.Content>
        </Tooltip>
      </GuiProvider>
    )

    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Escape' })

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
    expect(trigger).toHaveFocus()
  })
})
