import { createPalettes, createSimpleThemeBuilder } from './createThemes.ts'
import { defaultComponentThemes } from './defaultComponentThemes.ts'
import { defaultTemplates } from './defaultTemplates.ts'
import { defaultTemplatesStronger } from './defaultTemplatesStronger.ts'
import { defaultTemplatesStrongest } from './defaultTemplatesStrongest.ts'
import type { BuildThemeSuiteProps } from './types.ts'

// for studio
// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need

export function createStudioThemes(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)

  const templates =
    props.templateStrategy === 'stronger'
      ? defaultTemplatesStronger
      : props.templateStrategy === 'strongest'
        ? defaultTemplatesStrongest
        : defaultTemplates

  return createSimpleThemeBuilder({
    palettes,
    templates,
    componentThemes: defaultComponentThemes,
    accentTheme: !!props.palettes.accent,
  })
}
