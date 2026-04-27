import { join } from 'node:path'

import type { HanzoguiOptions } from '@hanzogui/types'
import { pathExists, readJSON } from 'fs-extra'

import { getDefaultHanzoguiOptions } from './getDefaultHanzoguiOptions'

export async function readHanzoguiOptions({ cwd = '.' }: { cwd: string }): Promise<{
  exists: boolean
  options: HanzoguiOptions
}> {
  const filePath = join(cwd, 'hanzogui.json')

  if (!(await pathExists(filePath))) {
    return {
      exists: false,
      options: await getDefaultHanzoguiOptions({ cwd }),
    }
  }

  try {
    const options = (await readJSON(filePath)) as HanzoguiOptions

    if (!Array.isArray(options.components)) {
      throw new Error(`Invalid components: not string[]`)
    }

    return {
      exists: true,
      options: {
        ...(!options.config && (await getDefaultHanzoguiOptions({ cwd }))),
        ...options,
      },
    }
  } catch (err: any) {
    console.error(`Error reading hanzogui.json: ${err.message} ${err.stack}`)

    return {
      exists: false,
      options: await getDefaultHanzoguiOptions({ cwd }),
    }
  }
}
