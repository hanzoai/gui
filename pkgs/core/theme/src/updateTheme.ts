import type { ThemeDefinition, ThemeName } from '@hanzogui/web'

import { _mutateTheme } from './_mutateTheme.ts'

export function updateTheme({
  name,
  theme,
}: {
  name: ThemeName | (string & {})
  theme: Partial<Record<keyof ThemeDefinition, any>>
}) {
  return _mutateTheme({ name, theme, insertCSS: true, mutationType: 'update' })
}
