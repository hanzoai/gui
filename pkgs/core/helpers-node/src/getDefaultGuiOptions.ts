import type { GuiOptions } from '@hanzogui/types'

import { getDefaultGuiConfigPath } from './getGuiDefaultPath'

export async function getDefaultGuiOptions({
  cwd = '.',
}: {
  cwd: string
}): Promise<GuiOptions> {
  return {
    platform: 'native',
    components: ['hanzogui'],
    config: await getDefaultGuiConfigPath({ cwd }),
  }
}
