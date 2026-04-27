import { isAbsolute, join } from 'node:path'

import { statSync } from 'node:fs'
import type { HanzoguiOptions } from '../types'

export function getHanzoguiConfigPathFromOptionsConfig(
  config: NonNullable<HanzoguiOptions['config']>
) {
  if (isAbsolute(config)) {
    return config
  }

  const fullPath = join(process.cwd(), config)

  try {
    if (statSync(fullPath).isFile()) {
      return fullPath
    }
  } catch {
    //
  }

  return config
}
