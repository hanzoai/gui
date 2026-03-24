import type { GuiBuildOptions } from '@hanzogui/core'

export default {
  components: ['@my/ui'],
  config: './gui.config.ts',
  outputCSS: './public/gui.generated.css',
} satisfies GuiBuildOptions
