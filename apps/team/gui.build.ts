import type { GuiBuildOptions } from '@hanzogui/core'

export default {
  components: ['hanzogui'],
  config: './src/gui.config.ts',
  disableExtraction: true,
} satisfies GuiBuildOptions
