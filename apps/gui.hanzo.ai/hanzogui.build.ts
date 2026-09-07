import type { GuiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  logTimings: true,
  config: './config/hanzogui.config.ts',
  outputCSS: './hanzogui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // useReactNativeWebLite: true,
} as GuiBuildOptions
