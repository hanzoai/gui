import type { Plugin } from 'esbuild'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import {
  createPathsMatcher,
  getTsconfig,
  type Cache,
  type PathsMatcher,
  type TsConfigResult,
} from 'get-tsconfig'

const extensions = ['.tsx', '.ts', '.jsx', '.js']

const isFile = (path: string) => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

/** The source file an extensionless path names: the path itself, then each extension, then an index file. */
export function probe(base: string): string | null {
  for (const ext of ['', ...extensions]) {
    if (isFile(base + ext)) return base + ext
  }
  for (const ext of extensions) {
    const index = join(base, `index${ext}`)
    if (isFile(index)) return index
  }
  return null
}

const configs: Cache<TsConfigResult | null> = new Map()
const matchers = new Map<string, PathsMatcher | null>()

/** Maps a specifier through `compilerOptions.paths` of the tsconfig (or jsconfig) nearest `dir` to a source file. */
export function resolveAlias(specifier: string, dir: string): string | null {
  if (!matchers.has(dir)) {
    // A dependency's tsconfig may extend a preset it does not ship; that is
    // no paths to map, not a reason to fail the bundle.
    let tsconfig: TsConfigResult | null = null
    try {
      tsconfig =
        getTsconfig(dir, 'tsconfig.json', configs) ??
        getTsconfig(dir, 'jsconfig.json', configs)
    } catch {}
    matchers.set(dir, tsconfig && createPathsMatcher(tsconfig))
  }
  for (const candidate of matchers.get(dir)?.(specifier) ?? []) {
    const file = probe(candidate)
    if (file) return file
  }
  return null
}

export function TsconfigPathsPlugin(): Plugin {
  return {
    name: 'tsconfig-paths',
    setup({ onResolve }) {
      onResolve({ filter: /.*/ }, ({ path, resolveDir }) => {
        // @hanzogui packages are externalized, never resolved through tsconfig
        if (path.startsWith('@hanzogui/')) return null
        const file = resolveAlias(path, resolveDir || process.cwd())
        return file ? { path: file } : null
      })
    },
  }
}
