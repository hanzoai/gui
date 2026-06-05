import { createUseStore } from '@hanzogui/use-store'

class RecipesStore {
  heroVisible = true
  heroHeight = 800
  disableTint = true
  disableCustomTheme = false
}

export const useRecipesStore = createUseStore(RecipesStore)
