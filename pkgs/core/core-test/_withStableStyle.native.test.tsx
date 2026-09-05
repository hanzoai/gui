process.env.GUI_TARGET = 'native'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, _withStableStyle, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, test, vi } from 'vitest'

const defaultConfig = getDefaultGuiConfig('native')
const config = createGui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    mediaQueryDefaultActive: {
      xs: true,
      gtLg: false,
    },
  },
})

describe('_withStableStyle', () => {
  test('renders correctly with GuiProvider', async () => {
    const Wrapped = _withStableStyle(
      View,
      (theme) => [
        { width: 100, height: 100, backgroundColor: theme.background?.get?.() ?? 'red' },
      ],
      true
    )

    const tree = await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </GuiProvider>
    )

    expect(tree.toJSON()).toBeTruthy()
  })

  test('does not crash without GuiProvider (graceful fallback)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapped = _withStableStyle(View, () => [{ width: 50, height: 50 }], true)

    await expect(async () => {
      await render(<Wrapped />)
    }).not.toThrow()

    warnSpy.mockRestore()
  })

  test('theme values resolve correctly under GuiProvider', async () => {
    let resolvedBg: any = null

    const Wrapped = _withStableStyle(
      View,
      (theme) => {
        resolvedBg = theme.background?.get?.()
        return [{ backgroundColor: resolvedBg }]
      },
      true
    )

    await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </GuiProvider>
    )

    expect(resolvedBg).toBeTruthy()
  })

  test('expressions are passed through correctly', async () => {
    let receivedExpressions: any[] = []

    const Wrapped = _withStableStyle(View, (_theme, expressions) => {
      receivedExpressions = expressions
      return [expressions[0] ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }]
    })

    await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped _expressions={[true, false, 42]} />
      </GuiProvider>
    )

    expect(receivedExpressions).toEqual([true, false, 42])
  })

  test('media expressions require both the media query and runtime condition', async () => {
    let receivedExpressions: any[] = []

    const Wrapped = _withStableStyle(
      View,
      (_theme, expressions) => {
        receivedExpressions = expressions
        return []
      },
      false,
      true
    )

    await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Wrapped
          _expressions={[
            ['gtLg', true],
            ['xs', true],
            ['xs', false],
          ]}
        />
      </GuiProvider>
    )

    expect(receivedExpressions).toEqual([false, true, false])
  })
})
