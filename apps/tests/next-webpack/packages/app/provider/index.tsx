import { useColorScheme } from 'react-native'
import {
  CustomToast,
  HanzoguiProvider,
  type HanzoguiProviderProps,
  ToastProvider,
  config,
  isWeb,
} from '@my/ui'
import { ToastViewport } from './ToastViewport'

export function Provider({
  children,
  defaultTheme = 'light',
  ...rest
}: Omit<HanzoguiProviderProps, 'config'> & { defaultTheme?: string }) {
  const colorScheme = useColorScheme()
  const theme = defaultTheme || (colorScheme === 'dark' ? 'dark' : 'light')

  return (
    <HanzoguiProvider config={config} defaultTheme={theme} {...rest}>
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={isWeb ? [] : ['mobile']}
      >
        {children}
        <CustomToast />
        <ToastViewport />
      </ToastProvider>
    </HanzoguiProvider>
  )
}
