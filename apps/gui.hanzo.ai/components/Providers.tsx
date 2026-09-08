import { InitialPathContext, NEUTRAL, SeasonProvider } from '@hanzogui/logo'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { useEffect } from 'react'
import { GuiProvider } from '@hanzo/gui'
import tamaConf from '~/config/hanzogui.config'
import { PostHogProvider } from '~/features/posthog/PostHogProvider'
import { SearchProvider } from '~/features/site/search/SearchProvider'
import { restoreAppearance } from '~/features/site/theme/accent'
import { ToastProvider } from '~/features/studio/ToastProvider'

export const Providers = (props: { children: any }) => {
  // The head script paints the type and density knobs before first paint but
  // leaves the colour alone, so the accent lands here, on the first mount.
  useEffect(restoreAppearance, [])

  return (
    <InitialPathContext.Provider value={NEUTRAL}>
      <SchemeProvider defaultScheme="dark">
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
