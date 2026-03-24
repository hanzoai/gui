import { InitialPathContext, SeasonProvider } from '@hanzogui/logo'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { GuiProvider } from '@hanzo/gui'
import tamaConf from '~/config/gui.config'
import { PostHogProvider } from '~/features/posthog/PostHogProvider'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  return (
    <InitialPathContext.Provider value={3}>
      <SchemeProvider>
        <PostHogProvider>
          <SeasonProvider>
            <WebsiteGuiProvider>
              <SearchProvider>{props.children}</SearchProvider>
            </WebsiteGuiProvider>
          </SeasonProvider>
        </PostHogProvider>
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
