import { GuiProvider, Theme, View, createGui, useThemeName } from '@hanzogui/core'
import { act, render } from '@testing-library/react-native'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'
import { getDefaultGuiConfig } from '../config-default'

const defaultConfig = getDefaultGuiConfig('native')
const config = createGui({
  ...defaultConfig,
  settings: { ...defaultConfig.settings, fastSchemeChange: true },
})

// faithfully replicate the shipped native portal fix (GorhomPortalItem.native.tsx):
// capture the resolved theme name at the source site, re-establish it with an
// absolute <Theme name> on the host side. this guards that the repropagation
// does NOT de-opt the DynamicColorIOS fast path (a scheme swap must stay a
// native OS swap, not a React re-render).
let portalItemRenders = 0
function PortalItemSim({ children }: { children: any }) {
  portalItemRenders++
  const themeName = useThemeName()
  return <Theme name={themeName}>{children}</Theme>
}

let innerRenders = 0
function Inner() {
  innerRenders++
  return <View backgroundColor="$background" />
}

const bgOf = (tree: any) => {
  let node = tree
  while (node && Array.isArray(node)) node = node[0]
  return node?.props?.style?.backgroundColor
}

describe('native portal theme repropagation', () => {
  test('wrapping in <Theme name={useThemeName()}> preserves DynamicColorIOS (no de-opt)', async () => {
    const baseline = await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <View backgroundColor="$background" />
        </Theme>
      </GuiProvider>
    )
    const wrapped = await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <PortalItemSim>
            <View backgroundColor="$background" />
          </PortalItemSim>
        </Theme>
      </GuiProvider>
    )
    const baseBg = bgOf(baseline.toJSON())
    const wrappedBg = bgOf(wrapped.toJSON())
    // identical => the wrapper keeps the OS-swappable dynamic object; an OS
    // light<->dark swap resolves natively with zero React renders.
    expect(wrappedBg).toEqual(baseBg)
    expect(wrappedBg).toEqual({ dynamic: { light: '#fff', dark: '#000' } })
  })

  test('mounting the portal wrapper adds no extra renders', async () => {
    portalItemRenders = 0
    innerRenders = 0
    await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Theme name="blue">
          <PortalItemSim>
            <Inner />
          </PortalItemSim>
        </Theme>
      </GuiProvider>
    )
    expect(portalItemRenders).toBe(1)
    expect(innerRenders).toBe(1)
  })

  test('a genuine parent theme-name change propagates into portaled content', async () => {
    portalItemRenders = 0
    innerRenders = 0
    let setName: (n: string) => void = () => {}
    function Harness() {
      const [name, _set] = useState('blue')
      setName = _set
      return (
        <Theme name={name}>
          <PortalItemSim>
            <Inner />
          </PortalItemSim>
        </Theme>
      )
    }
    await render(
      <GuiProvider defaultTheme="light" config={config}>
        <Harness />
      </GuiProvider>
    )
    expect(innerRenders).toBe(1)
    await act(async () => {
      setName('red')
    })
    // a real name change reaches the portaled content (correctness): the inner
    // node re-renders exactly once more. scheme swaps (test above) never do.
    expect(innerRenders).toBe(2)
  })
})
