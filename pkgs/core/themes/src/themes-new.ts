import { createThemeBuilder } from '@hanzogui/theme-builder'
import { componentThemeDefinitions } from './componentThemeDefinitions.tsx'
import { masks } from '@hanzogui/theme-builder'
import { palettes } from './palettes.tsx'
import { shadows } from './shadows.tsx'
import { maskOptions, templates } from './templates.tsx'
import { darkColors, lightColors } from './tokens.tsx'

const colorThemeDefinition = (colorName: string) => [
  {
    parent: 'light',
    palette: colorName,
    template: 'colorLight',
  },
  {
    parent: 'dark',
    palette: colorName,
    template: 'base',
  },
]

const themesBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks(masks)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: {
        ...lightColors,
        ...shadows.light,
      },
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: {
        ...darkColors,
        ...shadows.dark,
      },
    },
  })
  .addChildThemes({
    orange: colorThemeDefinition('orange'),
    yellow: colorThemeDefinition('yellow'),
    green: colorThemeDefinition('green'),
    blue: colorThemeDefinition('blue'),
    purple: colorThemeDefinition('purple'),
    pink: colorThemeDefinition('pink'),
    red: colorThemeDefinition('red'),

    // White-label brands, built exactly like the colors above so `<Theme
    // name="lux">` behaves like `<Theme name="blue">`. Applied SPARINGLY —
    // wrap an accent element, never the page; the canvas stays neutral.
    hanzo: colorThemeDefinition('hanzo'),
    lux: colorThemeDefinition('lux'),
    zoo: colorThemeDefinition('zoo'),
    pars: colorThemeDefinition('pars'),
  })
  .addChildThemes({
    alt1: {
      mask: 'soften',
      ...maskOptions.alt,
    },
    alt2: {
      mask: 'soften2',
      ...maskOptions.alt,
    },
    active: {
      mask: 'soften3',
      skip: {
        color: 1,
      },
    },
  })
  .addChildThemes(componentThemeDefinitions, {
    // to save bundle size but make alt themes not work on components
    // avoidNestingWithin: ['alt1', 'alt2'],
  })

// Annotated, not inferred: with the brand child themes added, the inferred type
// exceeds what tsc will serialize (TS7056). This file is the INPUT to
// `generate:new`, which emits the fully-typed snapshot in generated-new.ts —
// that is where consumers get precise theme names, so a structural type here
// costs nothing.
export const themes: Record<string, Record<string, string>> = themesBuilder.build()
