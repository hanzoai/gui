import { useClientValue } from '@hanzo/gui-core'

export const useOfflineMode = () => {
  return useClientValue(() => window.location.search?.includes(`offline`))
}
