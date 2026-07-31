import { Adapt } from '@hanzogui/adapt'
import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, createGui } from '@hanzogui/core'
import { PortalProvider } from '@hanzogui/portal'
import { Select } from '@hanzogui/select'
import { Sheet } from '@hanzogui/sheet'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const conf = createGui(getDefaultGuiConfig())

async function renderSelect(element: React.ReactElement) {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <GuiProvider config={conf} defaultTheme="light">
        <PortalProvider shouldAddRootHost>{element}</PortalProvider>
      </GuiProvider>
    )
  })

  return rendered!
}

function hasDisplayNone(style: any) {
  if (!style) return false
  if (Array.isArray(style)) {
    return style.some(hasDisplayNone)
  }
  return style.display === 'none'
}

function isHidden(node: TestRenderer.ReactTestInstance) {
  let current: TestRenderer.ReactTestInstance | null = node
  while (current) {
    if (current.props.display === 'none' || hasDisplayNone(current.props.style)) {
      return true
    }
    current = current.parent
  }
  return false
}

function visibleTextExists(rendered: TestRenderer.ReactTestRenderer, text: string) {
  return (
    rendered.root.findAll((node) => {
      const children = node.props.children
      const hasText = Array.isArray(children)
        ? children.includes(text)
        : children === text
      return hasText && !isHidden(node)
    }).length > 0
  )
}

describe('Select native content', () => {
  test('does not render closed items through the native portal fallback', async () => {
    const rendered = await renderSelect(
      <Select value="">
        <Select.Trigger>
          <Select.Value placeholder="Search..." />
        </Select.Trigger>

        <Adapt when="sm">
          <Sheet>
            <Sheet.Frame>
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport>
            <Select.Item index={0} value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select>
    )

    expect(visibleTextExists(rendered, 'Apple')).toBe(false)
  })

  test('renders the selected item label while closed', async () => {
    const rendered = await renderSelect(
      <Select value="apple">
        <Select.Trigger>
          <Select.Value placeholder="Search..." />
        </Select.Trigger>

        <Select.Content>
          <Select.Viewport>
            <Select.Item index={0} value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select>
    )

    expect(visibleTextExists(rendered, 'Apple')).toBe(true)
    expect(visibleTextExists(rendered, 'apple')).toBe(false)
  })
})
