import type { GuiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  logTimings: true,
  config: '@hanzogui/dev-config',
  outputCSS: './gui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // bento lists some last issues
  // useReactNativeWebLite: true,
} as GuiBuildOptions
