import type { HanzoguiBuildOptions } from 'hanzogui'

export default {
  components: ['hanzogui'],
  config: './hanzogui.config.ts',
  outputCSS: './hanzogui.generated.css',
} satisfies HanzoguiBuildOptions
