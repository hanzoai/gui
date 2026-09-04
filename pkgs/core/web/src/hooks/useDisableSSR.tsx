import { getSetting } from '../config.ts'
import type { ComponentContextI } from '../types.tsx'

export function getDisableSSR(componentContext?: ComponentContextI) {
  return componentContext?.disableSSR ?? getSetting('disableSSR')
}
