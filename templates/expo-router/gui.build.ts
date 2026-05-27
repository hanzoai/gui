import type { GuiBuildOptions } from 'hanzogui'

export default {
  components: ['gui'],
  config: './gui.config.ts',
  outputCSS: './gui.generated.css',
} satisfies GuiBuildOptions
