import { createRequire } from 'node:module'
import type { GuiOptions, GuiProjectInfo } from '@hanzogui/static'
import type { CLIResolvedOptions, CLIUserOptions } from '@hanzogui/types'
import chalk from 'chalk'
import fs, { pathExists, readJSON } from 'fs-extra/esm'
import { join } from 'node:path'
import { url } from './here.ts'

const need = createRequire(url)

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  hanzoguiOptions,
  host,
  debug,
  loadGuiOptions,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const dotDir = join(root, '.hanzogui')
  let pkgJson = {}
  let config = ''
  try {
    config = await getDefaultGuiConfigPath()
    pkgJson = await readJSON(join(root, 'package.json'))
  } catch {
    if (loadGuiOptions) {
      console.warn(
        chalk.yellow(
          `Warning: no hanzogui.config.ts found in ${root}. Commands that need a config may fail.`
        )
      )
    }
  }

  const filledOptions = {
    platform: 'native',
    components: ['@hanzo/gui'],
    config,
    ...hanzoguiOptions,
  } satisfies GuiOptions

  let finalOptions: GuiOptions = filledOptions
  if (loadGuiOptions) {
    const { loadGuiBuildConfigSync } = need('@hanzogui/static/loadGui')
    finalOptions = loadGuiBuildConfigSync(filledOptions)
  }

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    hanzoguiOptions: finalOptions,
    paths: {
      root,
      dotDir,
      conf: join(dotDir, 'hanzogui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export function ensure(condition: boolean, message: string) {
  if (!condition) {
    console.error(chalk.red.bold('Error:'), chalk.yellow(`${message}`))
    process.exit(1)
  }
}

const defaultPaths = ['hanzogui.config.ts', join('src', 'hanzogui.config.ts')]
let cachedPath = ''

async function getDefaultGuiConfigPath() {
  if (cachedPath) return cachedPath
  const existingPaths = await Promise.all(defaultPaths.map((path) => pathExists(path)))
  const existing = existingPaths.findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found hanzogui.config.ts`)
  }
  cachedPath = found
  return found
}

export const loadGui = async (
  opts: Partial<GuiOptions>
): Promise<GuiProjectInfo | null> => {
  const { loadGui: loadGuiStatic } = need('@hanzogui/static/loadGui')
  const loaded = await loadGuiStatic({
    components: ['@hanzo/gui'],
    ...opts,
    config: opts.config ?? (await getDefaultGuiConfigPath()),
  })
  return loaded
}

const disposers = new Set<Function>()

export function registerDispose(cb: () => void) {
  disposers.add(cb)
}

export function disposeAll() {
  disposers.forEach((cb) => cb())
}
