import { GuiProvider, View, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

import { getDefaultGuiConfig } from '../config-default'

const config = createGui(getDefaultGuiConfig('native'))

// TODO since upgrade to react-native 76 this stopped working

describe('animation props', () => {
  test.skip(`renders with no props`, () => {
    const tree = render(
      <GuiProvider config={config} defaultTheme="light">
        <View />
      </GuiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot('<View />')
  })

  // this looks wrong
  test.skip(`renders with animation props`, () => {
    const tree = render(
      <GuiProvider config={config} defaultTheme="light">
        <View transition="quick" x={0} />
      </GuiProvider>
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
