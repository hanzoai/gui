import { animationsMotion } from '@hanzogui/config/v5-motion'
import { Image } from '@hanzogui/image'
import './_layout.css'
import './gui.generated.css'

// import { Toaster } from '@hanzogui/toast'
import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { LoadProgressBar, SafeAreaView, Slot } from 'one'
import { Configuration, isWeb, GuiProvider, XStack, YStack } from '@hanzo/gui'
import { ToggleThemeButton } from '~/components/ToggleThemeButton'
import config from '~/config/gui/gui.config'
import oneBall from '~/public/app-icon.png'

export default function Layout() {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        <LoadProgressBar />

        <SchemeProvider>
          <GuiRootProvider>
            <YStack bg="$color1" minH="100%" gap="$4" flex={1}>
              <SafeAreaView>
                {/* <Toaster position="top-center" /> */}

                <XStack items="center" justify="center" gap="$4" py="$4">
                  <Image src={oneBall} width={42} height={42} />
                  <ToggleThemeButton />
                </XStack>

                <Configuration animationDriver={animationsMotion}>
                  <Slot />
                </Configuration>
              </SafeAreaView>
            </YStack>
          </GuiRootProvider>
        </SchemeProvider>
      </body>
    </html>
  )
}

const GuiRootProvider = ({ children }: { children: React.ReactNode }) => {
  const userScheme = useUserScheme()

  return (
    <GuiProvider disableInjectCSS config={config} defaultTheme={userScheme.value}>
      {children}
    </GuiProvider>
  )
}
