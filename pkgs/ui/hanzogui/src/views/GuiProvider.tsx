import type { GuiProviderProps } from '@hanzogui/core'
import { GuiProvider as OGProvider } from '@hanzogui/core'
import { PortalProvider } from '@hanzogui/portal'
import { ZIndexStackContext } from '@hanzogui/z-index-stack'

export const GuiProvider = ({ children, ...props }: GuiProviderProps) => {
  return (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )
}
