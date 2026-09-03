import type { ThemeName } from '@hanzo/gui'
import { setDisableTintTheme } from '@hanzogui/logo'
import { useEffect } from 'react'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

/** Applies the theme builder's current suite across the whole site. */
export const useSiteTheme = () => {
  const store = useThemeBuilderStore()
  // A studio suite is registered at runtime under this name, which the static
  // ThemeName union cannot know, so the name is asserted to it.
  const themeName = `studiodemointernal${store.themeSuiteUID}` as ThemeName
  const enabled = Boolean(store.themeSuiteUID)

  // A custom suite carries no tint sub-themes, so tinting is off while one is active.
  useEffect(() => {
    setDisableTintTheme(enabled)
  }, [enabled])

  return {
    enabled,
    // The studio theme with its accent while enabled; null lets the parent theme apply.
    themeName: enabled ? (`${themeName}_accent` as ThemeName) : null,
  } as const
}
