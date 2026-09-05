import { readFileSync } from 'node:fs'
import Module, { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { runInThisContext } from 'node:vm'
import { transformSync } from 'esbuild'
import { url } from '../here.ts'

const need = createRequire(url)

type Target = string | { default?: string } | undefined
type Exports = Record<string, string | Record<string, Target> | undefined>

/**
 * The file a package's `react-native` export names for a request. Node's own
 * conditions never select it, so the native pass asks here and requires the
 * file by path. A request with no such export resolves as Node would.
 */
export function nativeEntry(request: string): string {
  const parts = request.split('/')
  const name = request.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
  const subpath = request.slice(name.length)
  let manifest: string
  try {
    manifest = need.resolve(`${name}/package.json`)
  } catch {
    return request
  }
  const exports = (need(manifest) as { exports?: Exports }).exports
  const entry = exports?.[`.${subpath}`]
  const native = typeof entry === 'string' ? undefined : entry?.['react-native']
  const file = typeof native === 'string' ? native : native?.default
  return file ? join(dirname(manifest), file) : request
}

/** Whether the nearest package.json above a file says `type: module`. */
const kinds = new Map<string, boolean>()
function kindOf(dir: string): boolean {
  const known = kinds.get(dir)
  if (known !== undefined) return known
  let found: boolean | undefined
  try {
    found =
      (JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { type?: string })
        .type === 'module'
  } catch {}
  const parent = dirname(dir)
  const result = found ?? (parent === dir ? false : kindOf(parent))
  kinds.set(dir, result)
  return result
}
const inModulePackage = (filename: string) => kindOf(dirname(filename))

/**
 * An emit of ours is ESM; a native one even says a bare require, as Metro
 * allows. While this hook is in place, a `.js` file of a module package that
 * Node is asked to require is translated to CommonJS on the way in and run
 * through the CommonJS wrapper directly, since the compile hook other loaders
 * patch would translate it again. It wraps whatever loader is current when it
 * is installed, so it must go in after esbuild-register's, and comes out first.
 */
export function hookModuleJs(): () => void {
  const extensions = (Module as unknown as { _extensions: Record<string, Loader> })
    ._extensions
  const loader = extensions['.js']
  extensions['.js'] = (module, filename) => {
    if (!inModulePackage(filename)) return loader(module, filename)
    const { code } = transformSync(readFileSync(filename, 'utf8'), {
      format: 'cjs',
      loader: 'js',
      target: 'node20',
      sourcefile: filename,
    })
    const own = createRequire(filename)
    const require = Object.assign((id: string) => module.require(id), {
      resolve: own.resolve,
      cache: own.cache,
    })
    const fn = runInThisContext(Module.wrap(code), { filename }) as (
      exports: unknown,
      require: unknown,
      module: NodeModule,
      filename: string,
      dirname: string
    ) => void
    fn.call(module.exports, module.exports, require, module, filename, dirname(filename))
  }
  return () => {
    extensions['.js'] = loader
  }
}

type Loader = (module: NodeModule, filename: string) => void
