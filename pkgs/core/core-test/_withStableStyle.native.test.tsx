process.env.TAMAGUI_TARGET = 'native'

import { getDefaultHanzoguiConfig } from '@hanzogui/config-default'
import { HanzoguiProvider, _withStableStyle, createHanzogui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, test, vi } from 'vitest'

const defaultConfig = getDefaultHanzoguiConfig('native')
const config = createHanzogui(defaultConfig)

describe('_withStableStyle', () => {
  test('renders correctly with HanzoguiProvider', () => {
    const Wrapped = _withStableStyle(
      View,
      (theme) => [
        { width: 100, height: 100, backgroundColor: theme.background?.get?.() ?? 'red' },
      ],
      true
    )

    const tree = render(
      <HanzoguiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </HanzoguiProvider>
    )

    expect(tree.toJSON()).toBeTruthy()
  })

  test('does not crash without HanzoguiProvider (graceful fallback)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapped = _withStableStyle(View, () => [{ width: 50, height: 50 }], true)

    expect(() => {
      render(<Wrapped />)
    }).not.toThrow()

    warnSpy.mockRestore()
  })

  test('theme values resolve correctly under HanzoguiProvider', () => {
    let resolvedBg: any = null

    const Wrapped = _withStableStyle(
      View,
      (theme) => {
        resolvedBg = theme.background?.get?.()
        return [{ backgroundColor: resolvedBg }]
      },
      true
    )

    render(
      <HanzoguiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </HanzoguiProvider>
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
      <HanzoguiProvider defaultTheme="light" config={config}>
        <Wrapped _expressions={[true, false, 42]} />
      </HanzoguiProvider>
    )

    expect(receivedExpressions).toEqual([true, false, 42])
  })
})
