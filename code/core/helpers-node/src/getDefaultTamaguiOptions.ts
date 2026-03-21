import type { TamaguiOptions } from '@hanzo/gui-types'

import { getDefaultTamaguiConfigPath } from './getTamaguiDefaultPath'

export async function getDefaultTamaguiOptions({
  cwd = '.',
}: {
  cwd: string
}): Promise<TamaguiOptions> {
  return {
    platform: 'native',
    components: ['@hanzo/gui'],
    config: await getDefaultTamaguiConfigPath({ cwd }),
  }
}
