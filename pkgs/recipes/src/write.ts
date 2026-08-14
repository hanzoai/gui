import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { findProjectRoot, readConfig, resolveInstallDir } from './project.js'
import type { InstallPlan, Recipe } from './types.js'

export type WriteOptions = {
  /** Override the install dir; if omitted, resolved from the user's project. */
  installDir?: string
  /** Override project root for resolution. */
  cwd?: string
}

async function getInstallDir(opts: WriteOptions): Promise<string> {
  if (opts.installDir) return opts.installDir
  const root = await findProjectRoot(opts.cwd)
  return resolveInstallDir(root, await readConfig(root))
}

/** Writes one recipe's files. Returns absolute paths written. */
export async function installRecipe(
  recipe: Recipe,
  opts: WriteOptions = {}
): Promise<string[]> {
  const installDir = await getInstallDir(opts)
  const written: string[] = []
  for (const file of recipe.files) {
    const dest = path.join(installDir, file.path)
    const dir = path.dirname(dest)
    if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(dest, file.source)
    written.push(dest)
  }
  return written
}

/** Writes a recipe and all its transitive dependents from a resolved plan. */
export async function installPlan(
  plan: InstallPlan,
  opts: WriteOptions = {}
): Promise<string[]> {
  const written: string[] = []
  for (const r of [plan.recipe, ...plan.transitiveRecipes]) {
    written.push(...(await installRecipe(r, opts)))
  }
  return written
}
