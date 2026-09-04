import type { PropMappedValue } from '../types.tsx'

// no-op on web - border shorthand is passed through as CSS
export function parseBorderShorthand(_value: string): PropMappedValue | undefined {
  return undefined
}
