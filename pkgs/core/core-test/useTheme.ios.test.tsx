import { GuiProvider, Theme, View, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'
import { getDefaultGuiConfig } from '../config-default'

const defaultConfig = getDefaultGuiConfig('native')

const config = createGui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    fastSchemeChange: true,
  },
})

describe('useTheme', () => {
  test(`nested non-changing scheme with fast scheme change doesn't de-opt`, () => {
    const tree = render(
      <GuiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <View backgroundColor="$background" />
        </Theme>
      </GuiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        ref={[Function]}
        style={
          {
            "backgroundColor": {
              "dynamic": {
                "dark": "#000",
                "light": "#fff",
              },
            },
          }
        }
      />
    `)
  })

  test(`nested fast scheme change de-opts`, () => {
    const tree = render(
      <GuiProvider defaultTheme="light" config={config}>
        <Theme name="dark">
          <View backgroundColor="$background" />
        </Theme>
      </GuiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        ref={[Function]}
        style={
          {
            "backgroundColor": "#000",
          }
        }
      />
    `)
  })
})
