import type { GuiBuildOptions } from '@hanzogui/core'

export default {
  components: ['@hanzo/gui'],
  config: './config/gui/gui.config.ts',
  outputCSS: './app/gui.generated.css',
  // enable extraction (CSS optimization with flattening)
  disableExtraction: false,
} satisfies GuiBuildOptions
