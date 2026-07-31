import type { GuiBuildOptions } from 'hanzogui'

export default {
  components: ['hanzogui'],
  logTimings: true,
  config: '@hanzogui/dev-config',
  outputCSS: './hanzogui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // bento lists some last issues
  // useReactNativeWebLite: true,
} as GuiBuildOptions
