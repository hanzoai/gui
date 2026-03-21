'use client'

import '@hanzo/gui-core/reset.css'
import '@hanzo/gui-font-inter/css/400.css'
import '@hanzo/gui-font-inter/css/700.css'
import '@hanzo/gui-polyfill-dev'

import type { ReactNode } from 'react'
import { NextThemeProvider, useRootTheme } from '@hanzo/gui-next-theme'
import { config } from '@my/ui'
import { Provider } from 'app/provider'

// Pages Router provider - uses next/script with beforeInteractive (no skipNextHead)
export const PagesTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      // Don't skip - let next/script handle injection with beforeInteractive
      defaultTheme="light"
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme || 'light'}>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}
