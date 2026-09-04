import { createContextScope } from '@hanzogui/create-context'

import { SHEET_NAME } from './constants.tsx'
import type { SheetContextValue } from './useSheetProviderProps.tsx'

export const [createSheetContext, createSheetScope] = createContextScope(SHEET_NAME)

export const [SheetProvider, useSheetContext] = createSheetContext<SheetContextValue>(
  SHEET_NAME,
  {} as any
)
