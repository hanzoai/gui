process.env.GUI_TARGET = 'native'

import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { View, createGui } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { GuiProvider } from '../core/src/index'
import { getGestureHandler } from '../native/src/gestureState'

const config = createGui(getDefaultGuiConfig('native'))
const GESTURE_ENABLED_FREEZE_KEY = '__hanzogui_gesture_enabled_freeze__'

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

function setGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    Gesture: null,
    GestureDetector: null,
    ScrollView: null,
  })
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  vi.restoreAllMocks()
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('gesture handler enabled freeze', () => {
  test('ignores late disable after GuiProvider mounts', async () => {
    setGestureHandlerEnabled(true)

    await render(
      <GuiProvider config={config} defaultTheme="light">
        <View />
      </GuiProvider>
    )

    expect((globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]).toMatchObject({
      frozen: true,
      enabled: true,
    })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    getGestureHandler().disable()

    expect(getGestureHandler().isEnabled).toBe(true)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'Configure gesture handler mode before the first render.'
    )
  })
})
