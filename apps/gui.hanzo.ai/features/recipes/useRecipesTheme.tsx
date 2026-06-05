import { useTint } from '@hanzogui/logo'
import { useRecipesStore } from './RecipesStore'
import { useThemeBuilderStore } from '../studio/theme/store/ThemeBuilderStore'

export const useRecipesTheme = () => {
  const recipesStore = useRecipesStore()
  const { tint } = useTint()
  const store = useThemeBuilderStore()
  const themeName: any = `studiodemointernal${store.themeSuiteUID}`
  const enabled = !recipesStore.disableCustomTheme && store.themeSuiteUID

  return {
    bgColor: themeName ? '$color1' : '$colorBg',
    enabled,
    themeName: enabled
      ? recipesStore.disableTint
        ? themeName
        : `${themeName}_accent`
      : recipesStore.disableTint
        ? tint
        : null,
  } as const
}
