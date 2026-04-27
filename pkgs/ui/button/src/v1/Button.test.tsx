import { getDefaultHanzoguiConfig } from '@hanzogui/config-default'
import { createHanzogui } from '@hanzogui/core'
import { describe, expect, test } from 'vitest'

const conf = createHanzogui(getDefaultHanzoguiConfig())

describe('Button', () => {
  test(`123`, () => {
    expect(true).toBeTruthy()
  })

  // test(`Adapts to a when given accessibilityRole="link"`, async () => {
  //   const { container } = render(
  //     <HanzoguiProvider config={conf} defaultTheme="light">
  //       <Button href="http://google.com" accessibilityRole="link" />
  //     </HanzoguiProvider>
  //   )

  //   expect(container.firstChild).toMatchSnapshot()
  // })
})
