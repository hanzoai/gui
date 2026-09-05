process.env.GUI_TARGET = 'native'

import { Button } from '@hanzogui/button'
import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, createGui, styled } from '@hanzogui/core'
import { render } from '@testing-library/react-native'
import { forwardRef } from 'react'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { getGestureHandler } from '../native/src/gestureState'

const config = createGui(getDefaultGuiConfig('native'))
const GESTURE_ENABLED_FREEZE_KEY = '__hanzogui_gesture_enabled_freeze__'

const StyledButton = styled(Button, {
  name: 'StyledButtonHookRegression',
  variants: {
    disabled: {
      true: {
        opacity: 0.4,
      },
    },
  } as const,
})

const WrappedButton = forwardRef<any, { disabled?: boolean }>(({ disabled }, ref) => {
  return (
    <StyledButton ref={ref} disabled={disabled} onPress={() => {}}>
      Submit
    </StyledButton>
  )
})

function createGestureStub() {
  const gesture: any = {}

  for (const method of [
    'runOnJS',
    'maxDuration',
    'minDuration',
    'manualActivation',
    'hitSlop',
    'onBegin',
    'onStart',
    'onEnd',
    'onFinalize',
    'onTouchesDown',
    'onTouchesMove',
    'onTouchesUp',
    'onTouchesCancelled',
  ]) {
    gesture[method] = () => gesture
  }

  return gesture
}

function setGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    GestureDetector: enabled ? ({ children }: any) => children : null,
    Gesture: enabled
      ? {
          Tap: createGestureStub,
          LongPress: createGestureStub,
          Manual: createGestureStub,
          Exclusive: (...gestures: any[]) => gestures[0],
        }
      : null,
    ScrollView: null,
  })
}

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('styled(Button) disabled hook stability', () => {
  test.each([false, true])(
    'does not throw when disabled toggles inside a forwardRef wrapper (RNGH enabled: %s)',
    async (gestureEnabled) => {
      setGestureHandlerEnabled(gestureEnabled)

      const app = (disabled: boolean) => (
        <GuiProvider config={config} defaultTheme="light">
          <WrappedButton disabled={disabled} />
        </GuiProvider>
      )

      const rendered = await render(app(false))

      await expect(async () => {
        await rendered.rerender(app(true))
      }).not.toThrow()
    }
  )
})
