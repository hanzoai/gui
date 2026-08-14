import '@testing-library/jest-dom'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, createGui } from '@hanzogui/core'
import { RadioGroup } from '@hanzogui/radio-group'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

const config = createGui(getDefaultGuiConfig())

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RadioGroup indicator', () => {
  test('does not forward theme interaction props to the DOM', () => {
    const errors: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args.join(' '))
    })

    const rendered = render(
      <GuiProvider config={config} defaultTheme="light">
        <RadioGroup defaultValue="one" aria-label="choices">
          <RadioGroup.Item value="one">
            <RadioGroup.Indicator data-testid="radio-indicator" />
          </RadioGroup.Item>
        </RadioGroup>
      </GuiProvider>
    )

    expect(rendered.getByTestId('radio-indicator')).toBeVisible()
    expect(errors.filter((message) => message.includes('pressTheme'))).toEqual([])
  })
})
