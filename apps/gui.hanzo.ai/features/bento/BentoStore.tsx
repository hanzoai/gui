import { createUseStore } from '@hanzogui/use-store'

class BentoStore {
  heroVisible = true
  heroHeight = 800
  disableTint = true
  disableCustomTheme = false
}

export const useBentoStore = createUseStore(BentoStore)
