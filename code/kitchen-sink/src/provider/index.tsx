import type { HanzoguiProviderProps } from 'hanzogui'
import { HanzoguiProvider } from 'hanzogui'

import config from '../hanzogui.config'
import { useInsets } from './useInsets'

export function Provider({
  children,
  ...rest
}: Omit<Partial<HanzoguiProviderProps>, 'config'>) {
  const insets = useInsets()

  return (
    <HanzoguiProvider config={config} defaultTheme="light" insets={insets} {...rest}>
      {children}
    </HanzoguiProvider>
  )
}
