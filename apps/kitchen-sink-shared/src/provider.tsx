import type { GuiProviderProps } from 'hanzogui'
import { GuiProvider } from 'hanzogui'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<GuiProviderProps> & { config?: any }) {
  return (
    <GuiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      {children}
    </GuiProvider>
  )
}
