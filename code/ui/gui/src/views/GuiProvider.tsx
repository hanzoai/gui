import type { GuiProviderProps } from '@hanzo/gui-core'
import { GuiProvider as OGProvider } from '@hanzo/gui-core'
import { PortalProvider } from '@hanzo/gui-portal'
import { ZIndexStackContext } from '@hanzo/gui-z-index-stack'

export const GuiProvider = ({ children, ...props }: GuiProviderProps) => {
  return (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )
}
