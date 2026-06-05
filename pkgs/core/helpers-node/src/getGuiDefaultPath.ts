import { join } from 'node:path'

import { pathExists } from 'fs-extra'

let cachedPath = ''

export async function getDefaultGuiConfigPath({
  cwd = '.',
  cache = true,
}: {
  cwd?: string
  // TODO this isn't passed down / could avoid
  cache?: boolean
}): Promise<string> {
  if (cache && cachedPath) {
    return cachedPath
  }

  const defaultPaths = ['gui.config.ts', join('src', 'gui.config.ts')].map((p) =>
    join(cwd, p)
  )
  const existing = (
    await Promise.all(defaultPaths.map((path) => pathExists(path)))
  ).findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found gui.config.ts`)
  }

  cachedPath = found
  return found
}
