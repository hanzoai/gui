process.env.GUI_TARGET = 'web'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { Theme, GuiProvider, createGui, useTheme, useThemeName } from '@hanzogui/core'
import { act, render } from '@testing-library/react'
import { memo, useState } from 'react'
import { describe, expect, test } from 'vitest'

const conf = createGui(getDefaultGuiConfig())

// faithfully replicate the portal repropagation wrapper.
function PortalItemSim({ children }: { children: any }) {
  const themeName = useThemeName()
  return <Theme name={themeName}>{children}</Theme>
}

// memoized so a parent re-render alone never re-renders these — the ONLY thing
// that can re-render them is their own theme subscription (forceUpdate). that
// isolates the .get() vs .val contract from reconciliation noise.
let getRenders = 0
const GetReader = memo(function GetReader() {
  getRenders++
  const theme = useTheme()
  // .get() on web => a CSS variable; NOT tracked, so no subscription.
  void theme.background.get()
  return null
})

let valRenders = 0
const ValReader = memo(function ValReader() {
  valRenders++
  const theme = useTheme()
  // .val => the raw value; tracked, so it subscribes and re-renders on change.
  void theme.background.val
  return null
})

describe('web theme .get() vs .val through the portal wrapper', () => {
  test('.get() absorbs a sub-theme NAME change with zero re-renders; .val re-renders', () => {
    getRenders = 0
    valRenders = 0
    let setName: (n: string) => void = () => {}
    function Harness() {
      const [name, _set] = useState('blue')
      setName = _set
      return (
        <Theme name={name}>
          <PortalItemSim>
            <GetReader />
            <ValReader />
          </PortalItemSim>
        </Theme>
      )
    }
    render(
      <GuiProvider config={conf} defaultTheme="light">
        <Harness />
      </GuiProvider>
    )
    expect(getRenders).toBe(1)
    expect(valRenders).toBe(1)

    act(() => setName('red'))

    // .get() reader: CSS variable resolves via the wrapper's theme class in the
    // DOM cascade — never tracked, memo blocks the parent re-render => still 1.
    // this is the optimization that is NOT just light<->dark: a blue->red
    // sub-theme change costs zero re-renders for a .get() consumer on web.
    expect(getRenders).toBe(1)
    // .val reader: tracked => its own subscription forceUpdate fires => 2.
    expect(valRenders).toBe(2)
  })
})
