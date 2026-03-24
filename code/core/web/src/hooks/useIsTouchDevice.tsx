import { isTouchable, isWeb } from '@hanzogui/constants'
import { useDidFinishSSR } from '@hanzogui/use-did-finish-ssr'

export const useIsTouchDevice = () => {
  return !isWeb ? true : useDidFinishSSR() ? isTouchable : false
}
