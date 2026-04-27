import { createContext } from 'hanzogui'

export type BentoShowcaseContext = {
  showAppropriateModal: () => void
  isProUser: boolean
}

export const [BentoShowcaseProvider, useBentoShowcase] =
  createContext<BentoShowcaseContext>('BentoProvider', {
    showAppropriateModal: () => {},
    isProUser: false,
  })
