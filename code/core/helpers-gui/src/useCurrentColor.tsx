import type { ColorTokens, UnionableString, Variable } from '@hanzo/gui-web'
import { getVariable, useTheme } from '@hanzo/gui-web'
import type { TextStyle } from 'react-native'

export const useCurrentColor = (colorProp: ColorProp) => {
  const theme = useTheme()
  const out = colorProp
    ? getVariable(colorProp)
    : theme[colorProp as any]?.get() || theme.color?.get()
  return out
}

export type ColorProp =
  | UnionableString
  | Variable
  | ColorTokens
  | TextStyle['color']
  | undefined
