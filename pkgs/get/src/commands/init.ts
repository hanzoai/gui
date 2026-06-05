import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { findProjectRoot, DEFAULT_INSTALL_DIR } from '@hanzogui/recipes'
import { green, yellow } from '../lib/ansi.js'

export async function init(): Promise<void> {
  const root = await findProjectRoot()
  const dest = path.join(root, 'gui.config.json')
  if (existsSync(dest)) {
    process.stdout.write(yellow(`gui.config.json already exists at ${dest}\n`))
    return
  }
  await fs.writeFile(
    dest,
    JSON.stringify({ installDir: DEFAULT_INSTALL_DIR }, null, 2) + '\n'
  )
  process.stdout.write(green(`Wrote ${dest}\n`))
}
