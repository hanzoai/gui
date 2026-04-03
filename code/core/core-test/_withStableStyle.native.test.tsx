process.env.GUI_TARGET = 'native'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, _withStableStyle, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, test, vi } from 'vitest'

const defaultConfig = getDefaultGuiConfig('native')
const config = createGui(defaultConfig)

describe('_withStableStyle', () => {
  test('renders correctly with GuiProvider', () => {
    const Wrapped = _withStableStyle(View, (theme) => [
      { width: 100, height: 100, backgroundColor: theme.background?.get?.() ?? 'red' },
    ])

    const tree = render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </GuiProvider>
    )

    expect(tree.toJSON()).toBeTruthy()
  })

  test('does not crash without GuiProvider (graceful fallback)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapped = _withStableStyle(View, () => [{ width: 50, height: 50 }])

    expect(() => {
      render(<Wrapped />)
    }).not.toThrow()

    warnSpy.mockRestore()
  })

  test('theme values resolve correctly under GuiProvider', () => {
    let resolvedBg: any = null

    const Wrapped = _withStableStyle(View, (theme) => {
      resolvedBg = theme.background?.get?.()
      return [{ backgroundColor: resolvedBg }]
    })

    render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </GuiProvider>
    )

    expect(resolvedBg).toBeTruthy()
  })

  test('expressions are passed through correctly', () => {
    let receivedExpressions: any[] = []

    const Wrapped = _withStableStyle(View, (_theme, expressions) => {
      receivedExpressions = expressions
      return [expressions[0] ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }]
    })

    render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped _expressions={[true, false, 42]} />
      </GuiProvider>
    )

    expect(receivedExpressions).toEqual([true, false, 42])
  })
})
