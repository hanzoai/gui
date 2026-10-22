import '@testing-library/jest-dom'
import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, Text, View, createGui } from '@hanzogui/core'
import { XGroup } from '@hanzogui/group'
import { ListItem } from '@hanzogui/list-item'
import { Progress } from '@hanzogui/progress'
import { DirectionProvider, useDirection } from '@hanzogui/use-direction'
import { act, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

const conf = createGui(getDefaultGuiConfig())

const Gui = ({ children }: { children: React.ReactNode }) => (
  <GuiProvider config={conf} defaultTheme="light">
    {children}
  </GuiProvider>
)

// every rule gui has inserted into the document, as text
const css = () =>
  [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n') +
  [...document.styleSheets]
    .flatMap((sheet) => {
      try {
        return [...sheet.cssRules].map((r) => r.cssText)
      } catch {
        return []
      }
    })
    .join('\n')

const rulesFor = (el: Element) => {
  const text = css()
  return [...el.classList].flatMap((cls) =>
    text.split('\n').filter((line) => line.includes(`.${cls}`))
  )
}

afterEach(() => {
  document.documentElement.removeAttribute('dir')
})

function Reads() {
  return <Text testID="dir">{useDirection()}</Text>
}

describe('useDirection', () => {
  it('follows the document direction an i18n layer sets, without a provider', async () => {
    const { getByTestId } = render(
      <Gui>
        <Reads />
      </Gui>
    )
    expect(getByTestId('dir')).toHaveTextContent('ltr')
    act(() => {
      document.documentElement.dir = 'rtl'
    })
    await waitFor(() => expect(getByTestId('dir')).toHaveTextContent('rtl'))
    act(() => {
      document.documentElement.dir = 'ltr'
    })
    await waitFor(() => expect(getByTestId('dir')).toHaveTextContent('ltr'))
  })

  it('lets a provider or a local prop overrule the document', () => {
    document.documentElement.dir = 'rtl'
    const { getByTestId } = render(
      <Gui>
        <DirectionProvider dir="ltr">
          <Reads />
        </DirectionProvider>
      </Gui>
    )
    expect(getByTestId('dir')).toHaveTextContent('ltr')
  })
})

describe('logical layout', () => {
  it('a horizontal group joins its items on their inline sides', () => {
    const { getByTestId } = render(
      <Gui>
        <XGroup>
          <XGroup.Item>
            <View testID="first" borderRadius={8} width={10} height={10} />
          </XGroup.Item>
          <XGroup.Item>
            <View testID="last" borderRadius={8} width={10} height={10} />
          </XGroup.Item>
        </XGroup>
      </Gui>
    )
    const first = rulesFor(getByTestId('first')).join('\n')
    const last = rulesFor(getByTestId('last')).join('\n')
    expect(first).toMatch(/border-start-end-radius:\s*0px/)
    expect(first).toMatch(/border-end-end-radius:\s*0px/)
    expect(last).toMatch(/border-start-start-radius:\s*0px/)
    expect(last).toMatch(/border-end-start-radius:\s*0px/)
    expect(`${first}\n${last}`).not.toMatch(/border-(top|bottom)-(left|right)-radius:\s*0px/)
  })

  it('a list item spaces its icons on their inline sides', () => {
    const Icon = () => <View testID="icon" width={4} height={4} />
    const { getAllByTestId } = render(
      <Gui>
        <ListItem icon={Icon} iconAfter={Icon}>
          Row
        </ListItem>
      </Gui>
    )
    const [before, after] = getAllByTestId('icon').map((el) => el.parentElement!)
    expect(rulesFor(before).join('\n')).toMatch(/margin-inline-end:/)
    expect(rulesFor(after).join('\n')).toMatch(/margin-inline-start:/)
    expect(rulesFor(before).concat(rulesFor(after)).join('\n')).not.toMatch(
      /margin-(left|right):/
    )
  })

  it('a progress bar fills from the inline start under either direction', () => {
    const indicator = (dir: 'ltr' | 'rtl') => {
      document.documentElement.dir = dir
      const { container, unmount } = render(
        <Gui>
          <Progress value={50} width={200}>
            <Progress.Indicator />
          </Progress>
        </Gui>
      )
      const el = container.querySelector('[data-slot="progress-indicator"]')!
      const transform = rulesFor(el).join('\n') + (el.getAttribute('style') ?? '')
      unmount()
      return transform
    }
    expect(indicator('ltr')).toMatch(/translateX\(-75%\)/)
    expect(indicator('rtl')).toMatch(/translateX\(75%\)/)
  })
})
