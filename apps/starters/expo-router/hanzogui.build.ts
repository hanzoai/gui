import type { GuiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  config: './hanzogui.config.ts',
  outputCSS: './hanzogui.generated.css',
} satisfies GuiBuildOptions
