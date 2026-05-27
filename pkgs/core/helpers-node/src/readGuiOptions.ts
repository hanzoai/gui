import { join } from 'node:path'

import type { GuiOptions } from '@hanzogui/types'
import { pathExists, readJSON } from 'fs-extra'

import { getDefaultGuiOptions } from './getDefaultGuiOptions'

export async function readGuiOptions({ cwd = '.' }: { cwd: string }): Promise<{
  exists: boolean
  options: GuiOptions
}> {
  const filePath = join(cwd, 'gui.json')

  if (!(await pathExists(filePath))) {
    return {
      exists: false,
      options: await getDefaultGuiOptions({ cwd }),
    }
  }

  try {
    const options = (await readJSON(filePath)) as GuiOptions

    if (!Array.isArray(options.components)) {
      throw new Error(`Invalid components: not string[]`)
    }

    return {
      exists: true,
      options: {
        ...(!options.config && (await getDefaultGuiOptions({ cwd }))),
        ...options,
      },
    }
  } catch (err: any) {
    console.error(`Error reading gui.json: ${err.message} ${err.stack}`)

    return {
      exists: false,
      options: await getDefaultGuiOptions({ cwd }),
    }
  }
}
