import { createContext } from 'hanzogui'

export type RecipesShowcaseContext = {
  showAppropriateModal: () => void
  isProUser: boolean
}

export const [RecipesShowcaseProvider, useRecipesShowcase] =
  createContext<RecipesShowcaseContext>('RecipesProvider', {
    showAppropriateModal: () => {},
    isProUser: false,
  })
