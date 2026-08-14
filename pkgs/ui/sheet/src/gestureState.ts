/**
 * Re-export gesture state from @hanzogui/native.
 * Sheet uses this for backward compatibility with existing code.
 */

import { getGestureHandler, type GestureState } from '@hanzogui/native'

export type { GestureState as GestureHandlerState } from '@hanzogui/native'

const SHEET_GESTURE_STATE_KEY = '__hanzogui_sheet_gesture_state__'

function getSheetGestureHandlerState(): GestureState {
  const g = globalThis as typeof globalThis & {
    [SHEET_GESTURE_STATE_KEY]?: GestureState
  }

  return g[SHEET_GESTURE_STATE_KEY] ?? getGestureHandler().state
}

// backward compat helpers
export function isGestureHandlerEnabled(): boolean {
  return getSheetGestureHandlerState().enabled
}

export function getGestureHandlerState(): GestureState {
  return getSheetGestureHandlerState()
}

export function setGestureHandlerState(updates: Partial<GestureState>): void {
  const g = globalThis as typeof globalThis & {
    [SHEET_GESTURE_STATE_KEY]?: GestureState
  }

  const sheetState = g[SHEET_GESTURE_STATE_KEY]
  if (sheetState) {
    Object.assign(sheetState, updates)
    return
  }

  getGestureHandler().set(updates)
}

// alias for backward compatibility
export const setGestureState = setGestureHandlerState
