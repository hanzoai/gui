import { readHanzoguiOptions } from './readHanzoguiOptions'

export async function getHanzoguiOptions({
  cwd = '.',
}: {
  cwd?: string
}): Promise<import('@hanzogui/types/types').HanzoguiOptions> {
  return (await readHanzoguiOptions({ cwd })).options
}
