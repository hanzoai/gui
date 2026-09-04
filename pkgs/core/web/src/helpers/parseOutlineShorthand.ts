import type { PropMappedValue } from '../types.tsx'

// no-op on web - outline shorthand is passed through as CSS
export function parseOutlineShorthand(_value: string): PropMappedValue | undefined {
  return undefined
}
