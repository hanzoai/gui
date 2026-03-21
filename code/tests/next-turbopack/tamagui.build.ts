import type { TamaguiBuildOptions } from '@hanzo/gui-core'

export default {
  components: ['@my/ui'],
  config: './tamagui.config.ts',
  outputCSS: './public/tamagui.generated.css',
} satisfies TamaguiBuildOptions
