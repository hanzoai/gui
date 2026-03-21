import { isTouchable, isWeb } from '@hanzo/gui-constants'
import { useDidFinishSSR } from '@hanzo/gui-use-did-finish-ssr'

export const useIsTouchDevice = () => {
  return !isWeb ? true : useDidFinishSSR() ? isTouchable : false
}
