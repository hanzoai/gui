import type { GuiProviderProps } from '@hanzo/gui'
import { GuiProvider } from '@hanzo/gui'
import { ToastProvider } from '@hanzogui/toast'

import config from '../gui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<GuiProviderProps>, 'config'>) {
  return (
    <GuiProvider config={config} defaultTheme="light" {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </GuiProvider>
  )
}
