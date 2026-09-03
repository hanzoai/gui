import type { GuiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  logTimings: true,
  config: '@hanzogui/dev-config',
  outputCSS: './hanzogui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // useReactNativeWebLite: true,
} as GuiBuildOptions
