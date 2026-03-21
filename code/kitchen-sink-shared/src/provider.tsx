import type { TamaguiProviderProps } from '@hanzo/gui'
import { TamaguiProvider } from '@hanzo/gui'
import { ToastProvider } from '@hanzo/gui-toast'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<TamaguiProviderProps> & { config?: any }) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </TamaguiProvider>
  )
}
