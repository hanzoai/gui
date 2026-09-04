import React from 'react'
import { isWeb } from '@hanzogui/constants'

import { getWindowSize, subscribe } from './helpers.ts'
import type { WindowSize } from './types.ts'
import { initialValue } from './initialValue.ts'

export { configureInitialWindowDimensions } from './initialValue.ts'

export function useWindowDimensions({
  serverValue = initialValue,
}: { serverValue?: WindowSize } = {}): WindowSize {
  return React.useSyncExternalStore(subscribe, getWindowSize, () =>
    isWeb ? serverValue : getWindowSize()
  )
}
