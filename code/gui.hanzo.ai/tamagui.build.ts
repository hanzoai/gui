import type { TamaguiBuildOptions } from '@hanzo/gui'

export default {
  components: ['@hanzo/gui'],
  logTimings: true,
  config: '@hanzo/gui-dev-config',
  outputCSS: './tamagui.generated.css',
  disableExtraction: process.env.NODE_ENV !== 'production',
  enableDynamicEvaluation: true,
  // bento lists some last issues
  // useReactNativeWebLite: true,
} as TamaguiBuildOptions
