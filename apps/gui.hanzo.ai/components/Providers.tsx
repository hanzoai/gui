import { InitialPathContext, SeasonProvider } from '@hanzogui/logo'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { GuiProvider } from 'hanzogui'
import tamaConf from '~/gui.config'
import { TelemetryProvider } from '@hanzogui/telemetry'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  return (
    <InitialPathContext.Provider value={3}>
      <SchemeProvider>
        <TelemetryProvider>
          <SeasonProvider>
            <WebsiteGuiProvider>
              <SearchProvider>{props.children}</SearchProvider>
            </WebsiteGuiProvider>
          </SeasonProvider>
        </TelemetryProvider>
      </SchemeProvider>
    </InitialPathContext.Provider>
  )
}

function WebsiteGuiProvider(props: { children: any }) {
  const { value } = useUserScheme()

  return (
    <GuiProvider disableInjectCSS defaultTheme={value} config={tamaConf}>
      <ToastProvider>{props.children}</ToastProvider>
    </GuiProvider>
  )
}
