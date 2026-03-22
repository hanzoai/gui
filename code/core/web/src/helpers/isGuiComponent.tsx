import type { StaticConfig } from '../types'

export function isGuiComponent<A>(
  comp: A,
  name?: string
): comp is A & {
  staticConfig: StaticConfig
} {
  const config = comp?.['staticConfig'] as StaticConfig | undefined
  return Boolean(config && (name ? name === config.componentName : true))
}
