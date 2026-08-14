import type { GuiProviderProps } from '@hanzo/gui'
import { GuiProvider } from '@hanzo/gui'
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
