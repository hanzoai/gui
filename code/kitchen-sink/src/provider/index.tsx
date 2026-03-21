import type { TamaguiProviderProps } from '@hanzo/gui'
import { TamaguiProvider } from '@hanzo/gui'
import { ToastProvider } from '@hanzo/gui-toast'

import config from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </TamaguiProvider>
  )
}
