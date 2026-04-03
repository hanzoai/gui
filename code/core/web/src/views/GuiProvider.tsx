import { useIsomorphicLayoutEffect } from '@hanzogui/constants'
import { ClientOnly } from '@hanzogui/use-did-finish-ssr'
import React, { useEffect } from 'react'
import { getSetting } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { stopAccumulatingRules } from '../helpers/insertStyleRule'
import { updateMediaListeners } from '../hooks/useMedia'
import { resolveAnimationDriver } from '../helpers/resolveAnimationDriver'
import type { AnimationDriver, GuiProviderProps } from '../types'
import { GuiRoot } from './GuiRoot'
import { ThemeProvider } from './ThemeProvider'

// cache first theme key per config to avoid Object.keys allocation on every render
let _cachedFirstKey: string | undefined
let _cachedConfig: any

function firstThemeKey(config: any): string | undefined {
  if (config !== _cachedConfig) {
    _cachedConfig = config
    _cachedFirstKey = config?.themes ? Object.keys(config.themes)[0] : undefined
  }
  return _cachedFirstKey
}

export function GuiProvider({
  children,
  disableInjectCSS,
  config,
  className,
  defaultTheme: defaultThemeProp,
  reset,
  insets,
}: GuiProviderProps) {
  // fall back to first theme when defaultTheme is null/undefined
  // (e.g. useColorScheme() returns null on first render in RN 0.83+)
  const defaultTheme = defaultThemeProp || firstThemeKey(config) || 'light'
  useIsomorphicLayoutEffect(() => {
    stopAccumulatingRules()
    updateMediaListeners()
  }, [])

  const memoizedInsets = React.useMemo(
    () => insets,
    [insets?.top, insets?.right, insets?.bottom, insets?.left]
  )

  // Get the default animation driver from config
  // config.animations is already normalized to the default driver in createGui
  // resolveAnimationDriver handles edge cases where raw multi-driver object leaks through
  const defaultAnimationDriver: AnimationDriver | null = React.useMemo(
    () => resolveAnimationDriver(config?.animations),
    [config?.animations]
  )

  useEffect(() => {
    defaultAnimationDriver?.onMount?.()
  }, [])

  let contents = (
    <ComponentContext.Provider
      animationDriver={defaultAnimationDriver}
      insets={memoizedInsets}
    >
      <ThemeProvider defaultTheme={defaultTheme} reset={reset} className={className}>
        <GuiRoot theme={defaultTheme} isRootRoot>
          {children}
        </GuiRoot>
      </ThemeProvider>
    </ComponentContext.Provider>
  )

  if (getSetting('disableSSR')) {
    // never changes so conditional render fine, no re-parenting risk
    contents = <ClientOnly enabled>{contents}</ClientOnly>
  }

  return (
    <>
      {contents}

      {process.env.GUI_TARGET !== 'native' && config && !disableInjectCSS && (
        <style
          // react 19 feature to hoist style tags to header:
          // https://react.dev/reference/react-dom/components/style
          // @ts-ignore
          precedence="default"
          href="gui-css"
          key="gui-css"
        >
          {config.getCSS()}
        </style>
      )}
    </>
  )
}
