import type { GuiBuildOptions } from '@hanzogui/core'

const disableExtraction =
  process.env.NODE_ENV === 'development' &&
  (process.env.DISABLE_EXTRACTION ? JSON.parse(process.env.DISABLE_EXTRACTION) : true)

export default {
  config: './gui.config.ts',
  components: ['@hanzo/gui'],
  outputCSS: './public/gui.generated.css',
  importsWhitelist: ['constants.js', 'colors.js'],
  disableExtraction,
  excludeReactNativeWebExports: [
    'Switch',
    'ProgressBar',
    'Picker',
    'CheckBox',
    'Touchable',
    'Modal',
  ],
} satisfies GuiBuildOptions
