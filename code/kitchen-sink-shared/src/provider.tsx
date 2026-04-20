import type { HanzoguiProviderProps } from 'hanzogui'
import { HanzoguiProvider } from 'hanzogui'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<HanzoguiProviderProps> & { config?: any }) {
  return (
    <HanzoguiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      {children}
    </HanzoguiProvider>
  )
}
