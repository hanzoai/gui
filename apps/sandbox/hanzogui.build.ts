import type { GuiBuildOptions } from '@hanzogui/core'

export default {
  components: ['@hanzo/gui'],
  config: './config/hanzogui/hanzogui.config.ts',
  outputCSS: './app/hanzogui.generated.css',
  // enable extraction (CSS optimization with flattening)
  disableExtraction: false,
} satisfies GuiBuildOptions
