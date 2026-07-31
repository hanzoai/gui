import type { GuiProviderProps } from 'hanzogui'
import { GuiProvider } from 'hanzogui'

import config from '../hanzogui.config'
import { useInsets } from './useInsets'

export function Provider({
  children,
  ...rest
}: Omit<Partial<GuiProviderProps>, 'config'>) {
  const insets = useInsets()

  return (
    <GuiProvider config={config} defaultTheme="light" insets={insets} {...rest}>
      {children}
    </GuiProvider>
  )
}
