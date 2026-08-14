import type { ThemeProps } from '@hanzo/gui'
import { Theme, useThemeName } from '@hanzo/gui'

import { accentThemeName } from '../accentThemeName'
import { useHasAccent } from '../hooks/useHasAccent'

export function useAccentTheme(): ThemeProps & { isInAccent?: boolean } {
  const hasAccent = useHasAccent()
  const currentThemeName = useThemeName()
  const isInAccent = currentThemeName.includes(accentThemeName)

  if (hasAccent) {
    return {
      isInAccent,
      name: isInAccent ? 'accent' : accentThemeName,
    }
  }

  return {
    // name: currentThemeName,
  }
}

export function AccentTheme({ children }: { children: React.ReactNode }) {
  const { isInAccent, ...themeProps } = useAccentTheme()

  if (isInAccent) {
    return <>{children}</>
  }

  return <Theme {...themeProps}>{children}</Theme>
}
