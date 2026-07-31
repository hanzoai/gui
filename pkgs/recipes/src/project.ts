import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { DEFAULT_CONFIG_FILENAMES, DEFAULT_INSTALL_DIR } from './config.js'
import type { ProjectConfig } from './types.js'

/** Walks up from `start` until it finds a workspace root, git root, or any package.json. */
export async function findProjectRoot(start: string = process.cwd()): Promise<string> {
  let dir = start
  while (dir !== path.parse(dir).root) {
    const pkgPath = path.join(dir, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'))
        if (pkg.workspaces || existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir
      } catch {}
    }
    if (existsSync(path.join(dir, '.git'))) return dir
    dir = path.dirname(dir)
  }
  return start
}

/** Reads the first config file that exists in `root`. Returns `{}` if none. */
export async function readConfig(root: string): Promise<ProjectConfig> {
  for (const name of DEFAULT_CONFIG_FILENAMES) {
    const p = path.join(root, name)
    if (existsSync(p)) {
      try {
        return JSON.parse(await fs.readFile(p, 'utf8')) as ProjectConfig
      } catch {}
    }
  }
  return {}
}

/** Pure resolver: given a root and config, where do recipes install? */
export function resolveInstallDir(root: string, config: ProjectConfig): string {
  return path.join(root, config.installDir ?? DEFAULT_INSTALL_DIR)
}
