import { useContext } from 'react'

import { ThemeSettingContext } from './ThemeSettingContext.tsx'
import type { UseThemeProps } from './UseThemeProps.tsx'

/**
 * @deprecated renamed to `useThemeSetting` to avoid confusion with core `useTheme` hook
 */

export const useTheme = (): UseThemeProps => useContext(ThemeSettingContext)

export const useThemeSetting = (): UseThemeProps => useContext(ThemeSettingContext)
