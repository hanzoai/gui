import type { HanzoguiBuildOptions } from '@hanzogui/core'

export default {
  components: ['hanzogui'],
  config: './config/hanzogui/hanzogui.config.ts',
  outputCSS: './app/hanzogui.generated.css',
  // enable extraction (CSS optimization with flattening)
  disableExtraction: false,
} satisfies HanzoguiBuildOptions
