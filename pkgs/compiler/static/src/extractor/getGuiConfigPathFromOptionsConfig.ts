import { isAbsolute, join } from 'node:path'

import { statSync } from 'node:fs'
import type { GuiOptions } from '../types'

export function getGuiConfigPathFromOptionsConfig(
  config: NonNullable<GuiOptions['config']>
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
