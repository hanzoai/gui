import { HanzoguiProvider, View, createHanzogui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

import { getDefaultHanzoguiConfig } from '../config-default'

const config = createHanzogui(getDefaultHanzoguiConfig('native'))

// TODO since upgrade to react-native 76 this stopped working

describe('animation props', () => {
  test.skip(`renders with no props`, () => {
    const tree = render(
      <HanzoguiProvider config={config} defaultTheme="light">
        <View />
      </HanzoguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot('<View />')
  })

  // this looks wrong
  test.skip(`renders with animation props`, () => {
    const tree = render(
      <HanzoguiProvider config={config} defaultTheme="light">
        <View transition="quick" x={0} />
      </HanzoguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "transform": [
              {
                "translateX": 0,
              },
            ],
          }
        }
      />
    `)
  })
})
