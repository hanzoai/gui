import { HanzoguiProvider, Theme, View, createHanzogui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'
import { getDefaultHanzoguiConfig } from '../config-default'

const defaultConfig = getDefaultHanzoguiConfig('native')

const config = createHanzogui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    fastSchemeChange: true,
  },
})

describe('useTheme', () => {
  test(`nested non-changing scheme with fast scheme change doesn't de-opt`, () => {
    const tree = render(
      <HanzoguiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <View backgroundColor="$background" />
        </Theme>
      </HanzoguiProvider>
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
      <HanzoguiProvider defaultTheme="light" config={config}>
        <Theme name="dark">
          <View backgroundColor="$background" />
        </Theme>
      </HanzoguiProvider>
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
