import { setDisableTintTheme } from '@hanzogui/logo'
import { useEffect } from 'react'
import { useRecipesStore } from '~/features/recipes/RecipesStore'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

// site-wide theme hook - applies custom themes from the theme builder across the whole site
export const useSiteTheme = () => {
  const recipesStore = useRecipesStore()
  const store = useThemeBuilderStore()
  const themeName: any = `studiodemointernal${store.themeSuiteUID}`
  const enabled = !recipesStore.disableCustomTheme && store.themeSuiteUID

  // disable tint sub-themes when custom theme is active (it doesn't have them)
  useEffect(() => {
    setDisableTintTheme(!!enabled)
  }, [enabled])

  return {
    enabled,
    // when enabled, use the studio theme (optionally with accent)
    // when disabled, return null so the parent theme is used
    themeName: enabled
      ? recipesStore.disableTint
        ? themeName
        : `${themeName}_accent`
      : null,
  } as const
}
