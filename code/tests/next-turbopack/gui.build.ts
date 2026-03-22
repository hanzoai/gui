import type { GuiBuildOptions } from '@hanzo/gui-core'

export default {
  components: ['@my/ui'],
  config: './gui.config.ts',
  outputCSS: './public/gui.generated.css',
} satisfies GuiBuildOptions
