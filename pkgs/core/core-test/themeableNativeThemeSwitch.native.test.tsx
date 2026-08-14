process.env.GUI_TARGET = 'native'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, View, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { expect, test } from 'vitest'

// regression: themeable() passes data-disable-theme to the inner component of
// every .styleable() HOC. on native that flag must be IGNORED — honoring it
// skips the theme subscription, and since components are React.memo'd nothing
// re-renders the leaf on theme change, leaving resolved token colors stale.
// (web is safe via CSS variables.) guards the native branch of disableThemeProp
// in createComponent.

const config = createGui(getDefaultGuiConfig('native'))

const Custom = View.styleable((props, ref) => <View ref={ref} {...props} />)

const findBg = (node: any): any => {
  if (!node) return undefined
  const styles = Array.isArray(node.props?.style) ? node.props.style : [node.props?.style]
  for (const s of styles.flat(Infinity)) {
    if (s && s.backgroundColor) return s.backgroundColor
  }
  for (const child of node.children || []) {
    const found = findBg(child)
    if (found) return found
  }
  return undefined
}

test('styleable HOC leaf updates token color on theme switch (native)', () => {
  const ui = (theme: string) => (
    <GuiProvider config={config} defaultTheme={theme}>
      <Custom backgroundColor="$color" width={10} height={10} />
    </GuiProvider>
  )
  const { rerender, toJSON } = render(ui('light'))
  const before = findBg(toJSON())
  rerender(ui('dark'))
  const after = findBg(toJSON())
  expect(before).toBeTruthy()
  expect(after).toBeTruthy()
  expect(after).not.toBe(before)
})
