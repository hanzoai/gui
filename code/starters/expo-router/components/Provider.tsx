import { useColorScheme } from 'react-native'
import { GuiProvider, type GuiProviderProps } from '@hanzo/gui'
import { ToastProvider, ToastViewport } from '@hanzo/gui-toast'
import { CurrentToast } from './CurrentToast'
import { config } from '../gui.config'

export function Provider({
  children,
  ...rest
}: Omit<GuiProviderProps, 'config' | 'defaultTheme'>) {
  const colorScheme = useColorScheme()

  return (
    <GuiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={[
          // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
          // 'mobile'
        ]}
      >
        {children}
        <CurrentToast />
        <ToastViewport top="$8" left={0} right={0} />
      </ToastProvider>
    </GuiProvider>
  )
}
