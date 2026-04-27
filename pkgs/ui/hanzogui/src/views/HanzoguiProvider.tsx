import type { HanzoguiProviderProps } from '@hanzogui/core'
import { HanzoguiProvider as OGProvider } from '@hanzogui/core'
import { PortalProvider } from '@hanzogui/portal'
import { ZIndexStackContext } from '@hanzogui/z-index-stack'

export const HanzoguiProvider = ({ children, ...props }: HanzoguiProviderProps) => {
  return (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )
}
