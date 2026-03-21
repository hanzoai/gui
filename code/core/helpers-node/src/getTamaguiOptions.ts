import { readTamaguiOptions } from './readTamaguiOptions'

export async function getTamaguiOptions({
  cwd = '.',
}: {
  cwd?: string
}): Promise<import('@hanzo/gui-types/types').TamaguiOptions> {
  return (await readTamaguiOptions({ cwd })).options
}
