import './_layout.css'

import { SchemeProvider, useUserScheme } from '@vxrn/color-scheme'
import { Slot } from 'one'
import { GuiProvider } from 'hanzogui'
import { Shell } from '~/components/Shell'
import config from '~/src/gui.config'

export default function Layout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
        <title>Hanzo Team</title>
      </head>

      <body>
        <SchemeProvider>
          <Providers>
            <Shell>
              <Slot />
            </Shell>
          </Providers>
        </SchemeProvider>
      </body>
    </html>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  const userScheme = useUserScheme()
  return (
    <GuiProvider config={config} defaultTheme={userScheme.value}>
      {children}
    </GuiProvider>
  )
}
