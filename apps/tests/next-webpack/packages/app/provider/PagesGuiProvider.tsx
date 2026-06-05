'use client'

import '@hanzogui/core/reset.css'
import '@hanzogui/font-inter/css/400.css'
import '@hanzogui/font-inter/css/700.css'
import '@hanzogui/polyfill-dev'

import type { ReactNode } from 'react'
import { NextThemeProvider, useRootTheme } from '@hanzogui/next-theme'
import { config } from '@my/ui'
import { Provider } from 'app/provider'

// Pages Router provider - uses next/script with beforeInteractive (no skipNextHead)
export const PagesGuiProvider = ({ children }: { children: ReactNode }) => {
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
