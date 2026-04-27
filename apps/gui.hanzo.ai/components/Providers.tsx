import { InitialPathContext, SeasonProvider } from '@hanzogui/logo'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { HanzoguiProvider } from 'hanzogui'
import tamaConf from '~/hanzogui.config'
import { PostHogProvider } from '~/features/posthog/PostHogProvider'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  return (
    <InitialPathContext.Provider value={3}>
      <SchemeProvider>
        <PostHogProvider>
          <SeasonProvider>
            <WebsiteHanzoguiProvider>
              <SearchProvider>{props.children}</SearchProvider>
            </WebsiteHanzoguiProvider>
          </SeasonProvider>
        </PostHogProvider>
      </SchemeProvider>
    </InitialPathContext.Provider>
  )
}

function WebsiteHanzoguiProvider(props: { children: any }) {
  const { value } = useUserScheme()

  return (
    <HanzoguiProvider disableInjectCSS defaultTheme={value} config={tamaConf}>
      <ToastProvider>{props.children}</ToastProvider>
    </HanzoguiProvider>
  )
}
