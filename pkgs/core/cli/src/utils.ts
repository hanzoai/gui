import type { HanzoguiOptions, HanzoguiProjectInfo } from '@hanzogui/static'
import type { CLIResolvedOptions, CLIUserOptions } from '@hanzogui/types'
import chalk from 'chalk'
import fs, { pathExists, readJSON } from 'fs-extra'
import { join } from 'node:path'

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  hanzoguiOptions,
  host,
  debug,
  loadHanzoguiOptions,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const dotDir = join(root, '.hanzogui')
  let pkgJson = {}
  let config = ''
  try {
    config = await getDefaultHanzoguiConfigPath()
    pkgJson = await readJSON(join(root, 'package.json'))
  } catch {
    if (loadHanzoguiOptions) {
      console.warn(
        chalk.yellow(
          `Warning: no hanzogui.config.ts found in ${root}. Commands that need a config may fail.`
        )
      )
    }
  }

  const filledOptions = {
    platform: 'native',
    components: ['hanzogui'],
    config,
    ...hanzoguiOptions,
  } satisfies HanzoguiOptions

  let finalOptions: HanzoguiOptions = filledOptions
  if (loadHanzoguiOptions) {
    const { loadHanzoguiBuildConfigSync } = require('@hanzogui/static/loadHanzogui')
    finalOptions = loadHanzoguiBuildConfigSync(filledOptions)
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

async function getDefaultHanzoguiConfigPath() {
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

export const loadHanzogui = async (
  opts: Partial<HanzoguiOptions>
): Promise<HanzoguiProjectInfo | null> => {
  const { loadHanzogui: loadHanzoguiStatic } = require('@hanzogui/static/loadHanzogui')
  const loaded = await loadHanzoguiStatic({
    components: ['hanzogui'],
    ...opts,
    config: opts.config ?? (await getDefaultHanzoguiConfigPath()),
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
