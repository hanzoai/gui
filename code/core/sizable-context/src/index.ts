import { createStyledContext, type SizeTokens } from '@hanzogui/core'

export const SizableContext = createStyledContext({
  size: undefined as SizeTokens | undefined,
})
