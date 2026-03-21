import type { TamaguiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui.generated.css',
} satisfies TamaguiBuildOptions
