import type { GuiBuildOptions } from 'hanzogui'

export default {
  components: ['hanzogui'],
  logTimings: true,
  config: '@hanzogui/dev-config',
  outputCSS: './gui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // recipes lists some last issues
  // useReactNativeWebLite: true,
} as GuiBuildOptions
