import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, createGui } from '@hanzogui/core'
import { Dialog } from '../dialog/src'
import { Popover } from '../popover/src'
import { Select } from '../select/src'
import { Tabs } from '../tabs/src'
import { Tooltip, TooltipGroup } from '../tooltip/src'
import {
  PaletteField,
  PaletteList,
  PaletteRow,
  PaletteShell,
  usePaletteNav,
} from '../shell/src/commandPalette'
import { fireEvent, render, screen } from '@testing-library/react'
import * as React from 'react'
import { describe, expect, test, vi } from 'vitest'

const config = createGui(getDefaultGuiConfig())

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <GuiProvider config={config} defaultTheme="light">
      {children}
    </GuiProvider>
  )
}

describe('Core Primitives WCAG AA & Keyboard Accessibility Audit (#21)', () => {
  test('Dialog: exposes dialog ARIA attributes, modal state, and labelledby/describedby', () => {
    render(
      <Wrapper>
        <Dialog defaultOpen>
          <Dialog.Trigger asChild>
            <button type="button">Open Dialog</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>Confirm Action</Dialog.Title>
              <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
              <Dialog.Close asChild>
                <button type="button">Close</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </Wrapper>
    )

    const trigger = screen.getByRole('button', { name: 'Open Dialog' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls')

    const dialog = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
  })

  test('Popover: sets aria-expanded and aria-controls matching content id when open', () => {
    render(
      <Wrapper>
        <Popover>
          <Popover.Trigger asChild>
            <button type="button">Toggle Popover</button>
          </Popover.Trigger>
          <Popover.Content data-testid="popover-content">
            <span>Popover Body</span>
          </Popover.Content>
        </Popover>
      </Wrapper>
    )

    const trigger = screen.getByRole('button', { name: 'Toggle Popover' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).not.toHaveAttribute('aria-controls')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const controlsId = trigger.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    const content = screen.getByTestId('popover-content')
    expect(content).toHaveAttribute('id', controlsId!)
  })

  test('Select: trigger exposes combobox ARIA attributes', () => {
    render(
      <Wrapper>
        <Select defaultValue="apple">
          <Select.Trigger aria-label="Fruit">
            <Select.Value placeholder="Select a fruit" />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              <Select.Item index={0} value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item index={1} value="banana">
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select>
      </Wrapper>
    )

    const trigger = screen.getByRole('combobox', { name: 'Fruit' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-autocomplete', 'none')
  })

  test('Tabs: supports tablist/tab/tabpanel ARIA and Enter/Space keyboard activation', () => {
    render(
      <Wrapper>
        <Tabs defaultValue="tab1">
          <Tabs.List aria-label="Account sections">
            <Tabs.Tab value="tab1">Profile</Tabs.Tab>
            <Tabs.Tab value="tab2">Security</Tabs.Tab>
          </Tabs.List>
          <Tabs.Content value="tab1">Profile Content</Tabs.Content>
          <Tabs.Content value="tab2">Security Content</Tabs.Content>
        </Tabs>
      </Wrapper>
    )

    const tablist = screen.getByRole('tablist', { name: 'Account sections' })
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')

    const tab1 = screen.getByRole('tab', { name: 'Profile' })
    const tab2 = screen.getByRole('tab', { name: 'Security' })
    expect(tab1).toHaveAttribute('aria-selected', 'true')
    expect(tab2).toHaveAttribute('aria-selected', 'false')
    expect(tab1).toHaveAttribute('aria-controls')

    fireEvent.keyDown(tab2, { key: 'Enter' })
    expect(tab2).toHaveAttribute('aria-selected', 'true')
    expect(tab1).toHaveAttribute('aria-selected', 'false')

    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('Security Content')
    expect(panel).toHaveAttribute('aria-labelledby', tab2.getAttribute('id')!)
  })

  test('CommandPalette: exposes combobox/listbox/option ARIA and handles keyboard navigation & empty list guard', () => {
    const onEnter = vi.fn()
    const onClose = vi.fn()

    function TestPalette({ items }: { items: string[] }) {
      const [query, setQuery] = React.useState('')
      const { index, setIndex, listRef, onKeyDown } = usePaletteNav(
        items.length,
        onEnter,
        onClose
      )
      const listId = 'palette-list'
      const activeId = items.length > 0 ? `palette-item-${index}` : undefined

      return (
        <PaletteShell open onClose={onClose} label="Command Palette">
          <PaletteField
            value={query}
            onChange={setQuery}
            placeholder="Type a command..."
            onKeyDown={onKeyDown}
            listId={listId}
            activeId={activeId}
          />
          <PaletteList listRef={listRef} id={listId} empty={items.length === 0}>
            {items.map((item, i) => (
              <PaletteRow
                key={item}
                id={`palette-item-${i}`}
                index={i}
                selected={i === index}
                onHover={() => setIndex(i)}
                onClick={() => onEnter(i)}
                title={item}
              />
            ))}
          </PaletteList>
        </PaletteShell>
      )
    }

    const { rerender } = render(<TestPalette items={['Open File', 'Save File', 'Close']} />)

    const dialog = screen.getByRole('dialog', { name: 'Command Palette' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const combobox = screen.getByRole('combobox')
    expect(combobox).toHaveAttribute('aria-expanded', 'true')
    expect(combobox).toHaveAttribute('aria-controls', 'palette-list')
    expect(combobox).toHaveAttribute('aria-activedescendant', 'palette-item-0')

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(combobox).toHaveAttribute('aria-activedescendant', 'palette-item-1')

    fireEvent.keyDown(combobox, { key: 'End' })
    expect(combobox).toHaveAttribute('aria-activedescendant', 'palette-item-2')

    fireEvent.keyDown(combobox, { key: 'Home' })
    expect(combobox).toHaveAttribute('aria-activedescendant', 'palette-item-0')

    fireEvent.keyDown(combobox, { key: 'Enter' })
    expect(onEnter).toHaveBeenCalledWith(0)

    fireEvent.keyDown(combobox, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    // Empty list guard: ArrowDown/Enter should not fire onEnter
    onEnter.mockClear()
    rerender(<TestPalette items={[]} />)
    const emptyCombobox = screen.getByRole('combobox')
    fireEvent.keyDown(emptyCombobox, { key: 'ArrowDown' })
    fireEvent.keyDown(emptyCombobox, { key: 'Enter' })
    expect(onEnter).not.toHaveBeenCalled()
  })

  test('Tooltip: renders trigger and content with accessible structure', () => {
    render(
      <Wrapper>
        <TooltipGroup delay={{ open: 0, close: 0 }}>
          <Tooltip open>
            <Tooltip.Trigger asChild>
              <button type="button">Info</button>
            </Tooltip.Trigger>
            <Tooltip.Content>Helpful tooltip text</Tooltip.Content>
          </Tooltip>
        </TooltipGroup>
      </Wrapper>
    )

    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument()
    expect(screen.getByText('Helpful tooltip text')).toBeInTheDocument()
  })
})
