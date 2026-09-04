export * from './useNativeRef.ts'
export * from './types.ts'

// stub for bundler consistency - on native, this is a no-op that just returns ref and composedRef
export { useNativeRef as useWebRef } from './useNativeRef.ts'
export function getWebElement(): never {
  throw new Error('getWebElement is only available on web')
}
