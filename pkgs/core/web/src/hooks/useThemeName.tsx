import type { ThemeName } from '../types.tsx'
import { useThemeState } from './useThemeState.ts'

// can probably simplify this way down
const forceUpdateState = { forceClassName: true, deopt: true, needsUpdate: () => true }
const forceKeys = { current: new Set(['']) }

export function useThemeName(): ThemeName {
  return useThemeState(forceUpdateState, false, forceKeys)?.name || ''
}
