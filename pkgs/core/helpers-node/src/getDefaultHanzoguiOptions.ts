import type { HanzoguiOptions } from '@hanzogui/types'

import { getDefaultHanzoguiConfigPath } from './getHanzoguiDefaultPath'

export async function getDefaultHanzoguiOptions({
  cwd = '.',
}: {
  cwd: string
}): Promise<HanzoguiOptions> {
  return {
    platform: 'native',
    components: ['hanzogui'],
    config: await getDefaultHanzoguiConfigPath({ cwd }),
  }
}
