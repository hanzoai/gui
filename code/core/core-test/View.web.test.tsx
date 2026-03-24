process.env.HANZO_GUI_TARGET = 'web'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ViewProps } from '@hanzogui/core'
import { View, GuiProvider, createGui } from '@hanzogui/core'

const conf = createGui(getDefaultGuiConfig())

const TestViewRenders = ({
  renderCount,
  ...props
}: ViewProps & { renderCount: { current: number } }) => {
  return (
    <GuiProvider config={conf} defaultTheme="light">
      <View data-test-renders={renderCount} {...props} />
    </GuiProvider>
  )
}

describe('View', () => {
  test('renders once on mount', async () => {
    const renderCount = { current: 0 }
    render(<TestViewRenders renderCount={renderCount} />)
    expect(renderCount.current).toBe(1)
  })

  // test(`doesn't re-render on media query change if CSS`, async () => {
  //   const renderCount = { current: 0 }

  //   render(
  //     <TestViewRenders
  //       renderCount={renderCount}
  //       backgroundColor="blue"
  //       $sm={{ backgroundColor: 'red' }}
  //     />
  //   )

  //   expect(renderCount.current).toBe(1)

  //   // re-configuring re-runs the media queries...
  //   configureMedia(conf)

  //   expect(renderCount.current).toBe(1)
  // })

  // test(`does re-render on media query change if not CSS`, async () => {
  //   const renderCount = { current: 0 }

  //   render(
  //     <TestViewRenders
  //       renderCount={renderCount}
  //       backgroundColor="blue"
  //       // @ts-ignore
  //       $sm={{ gap: '$2' }}
  //     />
  //   )

  //   expect(renderCount.current).toBe(1)

  //   // re-configuring re-runs the media queries...
  //   // configureMedia({
  //   //   ...conf,
  //   //   media: {
  //   //     def
  //   //   },
  //   // })
  //   // expect(renderCount.current).toBe(2)
  // })
})
