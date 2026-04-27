import type { HanzoguiBuildOptions } from '@hanzogui/core'

export default {
  components: ['@my/ui'],
  config: './hanzogui.config.ts',
  outputCSS: './public/hanzogui.generated.css',
} satisfies HanzoguiBuildOptions
