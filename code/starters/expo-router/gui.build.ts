import type { GuiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  config: './gui.config.ts',
  outputCSS: './gui.generated.css',
} satisfies GuiBuildOptions
