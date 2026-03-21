import { createStyledContext, type SizeTokens } from '@hanzo/gui-core'

export const SizableContext = createStyledContext({
  size: undefined as SizeTokens | undefined,
})
