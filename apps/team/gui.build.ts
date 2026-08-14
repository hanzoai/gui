import type { GuiBuildOptions } from '@hanzogui/core'

export default {
  components: ['@hanzo/gui'],
  config: './src/gui.config.ts',
  disableExtraction: true,
} satisfies GuiBuildOptions
