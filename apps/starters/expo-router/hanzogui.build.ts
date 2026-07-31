import type { GuiBuildOptions } from 'hanzogui'

export default {
  components: ['hanzogui'],
  config: './hanzogui.config.ts',
  outputCSS: './hanzogui.generated.css',
} satisfies GuiBuildOptions
