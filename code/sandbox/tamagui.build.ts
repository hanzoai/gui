import type { TamaguiBuildOptions } from '@hanzo/gui-core'

export default {
  components: ['@hanzo/gui'],
  config: './config/tamagui/tamagui.config.ts',
  outputCSS: './app/tamagui.generated.css',
  // enable extraction (CSS optimization with flattening)
  disableExtraction: false,
} satisfies TamaguiBuildOptions
