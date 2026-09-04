import type { GuiOptions } from '@hanzogui/types'

import { readGuiOptions } from './readGuiOptions.ts'

export async function getGuiOptions({
  cwd = '.',
}: {
  cwd?: string
}): Promise<GuiOptions> {
  return (await readGuiOptions({ cwd })).options
}
