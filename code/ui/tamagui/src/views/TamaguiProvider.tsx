import type { TamaguiProviderProps } from '@hanzo/gui-core'
import { TamaguiProvider as OGProvider } from '@hanzo/gui-core'
import { PortalProvider } from '@hanzo/gui-portal'
import { ZIndexStackContext } from '@hanzo/gui-z-index-stack'

export const TamaguiProvider = ({ children, ...props }: TamaguiProviderProps) => {
  return (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )
}
