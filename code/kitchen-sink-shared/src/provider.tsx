import type { GuiProviderProps } from '@hanzo/gui'
import { GuiProvider } from '@hanzo/gui'
import { ToastProvider } from '@hanzogui/toast'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<GuiProviderProps> & { config?: any }) {
  return (
    <GuiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </GuiProvider>
  )
}
