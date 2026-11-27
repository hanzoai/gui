import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { createGui, GuiProvider } from '@hanzogui/core'
import { Button } from '@hanzogui/button'
import { Dialog } from '@hanzogui/dialog'
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

function renderDialog(
  props: { open?: boolean; onEscapeKeyDown?: (e: any) => void } = {}
) {
  return render(
    <GuiProvider config={conf} defaultTheme="light">
      <Dialog defaultOpen={props.open ?? true}>
        <Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content data-testid="content">
            <Dialog.Title>Delete account</Dialog.Title>
            <Dialog.Description>This cannot be undone.</Dialog.Description>
            <Dialog.Close data-testid="close">Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </GuiProvider>
  )
}

describe('Dialog accessibility', () => {
  it('exposes a modal dialog named by its title and described by its description', async () => {
    renderDialog()
    const content = await screen.findByTestId('content')

    expect(content).toHaveAttribute('role', 'dialog')
    expect(content).toHaveAttribute('aria-modal', 'true')

    const title = screen.getByText('Delete account')
    const description = screen.getByText('This cannot be undone.')
    expect(content).toHaveAttribute('aria-labelledby', title.id)
    expect(content).toHaveAttribute('aria-describedby', description.id)
  })

  it('moves focus into the dialog and traps Tab inside it', async () => {
    renderDialog()
    const content = await screen.findByTestId('content')
    const close = await screen.findByTestId('close')

    await waitFor(() => expect(content.contains(document.activeElement)).toBe(true))

    close.focus()
    fireEvent.keyDown(close, { key: 'Tab' })
    await waitFor(() => expect(content.contains(document.activeElement)).toBe(true))
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    renderDialog()
    const content = await screen.findByTestId('content')
    await waitFor(() => expect(content.contains(document.activeElement)).toBe(true))

    fireEvent.keyDown(document.activeElement ?? content, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByTestId('content')).not.toBeInTheDocument()
    })
    await waitFor(() => expect(screen.getByTestId('trigger')).toHaveFocus())
  })

  it('has a labelled close control', async () => {
    renderDialog()
    await screen.findByTestId('content')
    expect(screen.getByTestId('close')).toHaveAttribute('aria-label', 'Dialog Close')
  })

  it('renders its trigger as a button that advertises the popup', async () => {
    render(
      <GuiProvider config={conf} defaultTheme="light">
        <Dialog>
          <Dialog.Trigger asChild>
            <Button data-testid="trigger">open</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </GuiProvider>
    )
    const trigger = screen.getByTestId('trigger')
    expect(trigger).toHaveAttribute('role', 'button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
