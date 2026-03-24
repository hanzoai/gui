import { readGuiOptions } from './readGuiOptions'

export async function getGuiOptions({
  cwd = '.',
}: {
  cwd?: string
}): Promise<import('@hanzogui/types/types').GuiOptions> {
  return (await readGuiOptions({ cwd })).options
}
