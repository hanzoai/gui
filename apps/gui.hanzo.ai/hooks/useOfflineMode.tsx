import { useClientValue } from '@hanzogui/core'

export const useOfflineMode = () => {
  return useClientValue(() => window.location.search?.includes(`offline`))
}
