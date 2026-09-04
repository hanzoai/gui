import { Appearance } from 'react-native'
import { getRootThemeState } from './useThemeState.ts'

export function doesRootSchemeMatchSystem() {
  // only used on native for now
  return getRootThemeState()?.scheme === Appearance.getColorScheme()
}
