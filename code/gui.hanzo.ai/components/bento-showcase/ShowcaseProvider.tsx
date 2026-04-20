import { createContext } from 'hanzogui'

export type ShowcaseTheme = 'default' | 'monokai' | 'dracula'

export const [ShowcaseProvider, useShowCaseView] = createContext<{
  theme: ShowcaseTheme
  setTheme: React.Dispatch<React.SetStateAction<ShowcaseTheme>>
}>('ShowcaseProvider', {
  theme: 'default',
  setTheme(_) {},
})
