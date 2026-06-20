import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const RECIPES_COMPONENT_PREFIX = '@hanzogui/recipes/component/'

/**
 * Recursively collect .ts/.tsx source files under a directory, skipping
 * node_modules and build output.
 * @param {string} dir
 * @param {string[]} acc
 * @returns {string[]}
 */
function collectSourceFiles(dir, acc = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return acc
  }
  for (const name of entries) {
    if (name === 'node_modules' || name === 'dist' || name === 'recipes-output') continue
    const full = join(dir, name)
    let s
    try {
      s = statSync(full)
    } catch {
      continue
    }
    if (s.isDirectory()) {
      collectSourceFiles(full, acc)
    } else if (name.endsWith('.ts') || name.endsWith('.tsx')) {
      acc.push(full)
    }
  }
  return acc
}

/**
 * Scan the app for deep `@hanzogui/recipes/component/*` imports and the named
 * bindings each subpath must provide, so concrete stub modules can be generated
 * when the (optional, pro-only) recipes repo is absent.
 *
 * Three import shapes are detected:
 *   1. namespace  -> import * as NS from '<subpath>'  (then NS.Member usages)
 *   2. named      -> import { A, B } from '<subpath>'
 *   3. re-export  -> export { A } from '<subpath>'
 *
 * @param {string} appDir
 * @returns {Record<string, string[]>} subpath -> sorted unique export names
 */
function scanRecipesSubpaths(appDir) {
  const subpaths = {}
  for (const file of collectSourceFiles(appDir)) {
    let src
    try {
      src = readFileSync(file, 'utf-8')
    } catch {
      continue
    }
    if (!src.includes(RECIPES_COMPONENT_PREFIX)) continue

    // namespace imports + member accesses
    for (const m of src.matchAll(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g)) {
      const [, ns, sp] = m
      if (!sp.startsWith(RECIPES_COMPONENT_PREFIX)) continue
      subpaths[sp] ??= new Set()
      const memberRe = new RegExp('\\b' + ns + '\\.([A-Za-z_][A-Za-z0-9_]*)', 'g')
      for (const u of src.matchAll(memberRe)) subpaths[sp].add(u[1])
    }

    // named imports and re-exports
    for (const m of src.matchAll(/(?:import|export)\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g)) {
      const [, names, sp] = m
      if (!sp.startsWith(RECIPES_COMPONENT_PREFIX)) continue
      subpaths[sp] ??= new Set()
      for (const raw of names.split(',')) {
        const name = raw.trim().split(/\s+as\s+/)[0].trim()
        if (name) subpaths[sp].add(name)
      }
    }
  }
  return Object.fromEntries(
    Object.entries(subpaths).map(([k, v]) => [k, [...v].sort()])
  )
}

/**
 * Generate concrete stub modules for deep `@hanzogui/recipes/component/*`
 * subpaths used by the showcase tree, returning a map from subpath -> absolute
 * stub file path. Each stub exports a no-op component (carrying a `.fileName`
 * field so `Member.fileName` reads don't throw) as the default and as every
 * named binding the app imports — concrete on-disk named exports are required
 * because rolldown statically validates `export { X } from` / `import { X }`
 * and does not transform virtual `\0`-modules through commonjs interop.
 *
 * @param {Object} options
 * @param {string} options.appDir - app root (dir containing components/, vite.config.ts)
 * @param {string} options.outDir - directory to write stub modules into
 * @returns {Record<string, string>} subpath -> absolute stub path
 */
export function generateSubpathStubs({ appDir, outDir }) {
  const map = scanRecipesSubpaths(appDir)
  mkdirSync(outDir, { recursive: true })
  const result = {}
  for (const [subpath, names] of Object.entries(map)) {
    const flat = subpath.slice(RECIPES_COMPONENT_PREFIX.length).replace(/[^A-Za-z0-9]+/g, '_')
    const stubPath = resolve(outDir, `${flat}.tsx`)
    // Hook-shaped exports (useFoo) are called, not rendered, and their result is
    // often destructured (e.g. `const { sm } = useGroupMedia(...)`), so they must
    // return a (proxy) object rather than the null-rendering component stub.
    const namedExports = names
      .filter((n) => n !== 'default')
      .map((n) =>
        /^use[A-Z0-9]/.test(n)
          ? `export const ${n} = recipesSubpathHook`
          : `export const ${n} = RecipesSubpathStub`
      )
      .join('\n')
    writeFileSync(
      stubPath,
      `// AUTO-GENERATED stub for ${subpath}
// Recipes is optional (pro users only); the real components live in the
// separate recipes repo. Regenerate via scripts/generate-recipes-proxy.mjs.
function RecipesSubpathStub() {
  return null
}
RecipesSubpathStub.fileName = ''

// Hook stub: returns an object that yields undefined for any destructured key,
// so callers like \`const { sm } = useGroupMedia(...)\` never throw.
const recipesSubpathHook = () =>
  new Proxy({}, { get: () => undefined }) as any

export default RecipesSubpathStub
${namedExports}
`
    )
    result[subpath] = stubPath
  }
  return result
}

/**
 * Generate recipes proxy files based on whether the recipes repo is available.
 * Can be called from vite config or run directly as a script.
 *
 * @param {Object} options
 * @param {string} options.basePath - Base path for resolution (defaults to script directory)
 * @param {boolean} options.silent - Suppress console output
 * @returns {{ hasRecipes: boolean }} - Whether recipes repo was found
 */
export function generateRecipesProxy(options = {}) {
  const { basePath = __dirname, silent = false } = options

  const RECIPES_PATH = resolve(basePath, '../../../../recipes')
  const HELPERS_DIST_PATH = resolve(basePath, '../helpers/dist')
  const APP_DIR = resolve(basePath, '..')
  const hasRecipes = existsSync(RECIPES_PATH)

  // Ensure dist exists
  mkdirSync(HELPERS_DIST_PATH, { recursive: true })

  // When recipes is absent, generate concrete stub modules for every deep
  // `@hanzogui/recipes/component/*` subpath the app imports, so the showcase
  // tree (which is always in the build graph via RecipesComponentSection) can
  // resolve its named imports/re-exports.
  const subpathStubs = hasRecipes
    ? {}
    : generateSubpathStubs({
        appDir: APP_DIR,
        outDir: resolve(HELPERS_DIST_PATH, 'recipes-subpath-stubs'),
      })

  const proxyPath = resolve(HELPERS_DIST_PATH, 'recipes-proxy.ts')
  const existingContent = existsSync(proxyPath) ? readFileSync(proxyPath, 'utf-8') : ''
  const isStub = existingContent.includes('Stub file for when recipes is not available')
  const hasCurrentRouteProvider = existingContent.includes('CurrentRouteProvider')

  // Skip if already generated with correct state and has all exports
  if (existingContent && isStub === !hasRecipes && hasCurrentRouteProvider) {
    return { hasRecipes, subpathStubs }
  }

  if (!hasRecipes) {
    // Generate stub proxy files for when recipes is not available
    // Recipes is optional (pro users only) - /recipes pages will show placeholders
    writeFileSync(
      proxyPath,
      `// Stub file for when recipes is not available
// Recipes is optional and only needed for pro features - /recipes pages will not work without it
export * as Data from '../../components/recipes-showcase/data'
export * as Sections from '../../components/recipes-showcase/sections'

// Stub useCurrentRouteParams hook
export function useCurrentRouteParams() {
  return {}
}

// Stub CurrentRouteProvider component (just renders children)
export function CurrentRouteProvider({ children }: { children: React.ReactNode; section?: string; part?: string }) {
  return children
}
`
    )

    writeFileSync(
      resolve(HELPERS_DIST_PATH, 'recipes-proxy-data.ts'),
      `export * from '../../components/recipes-showcase/data'\n`
    )

    if (!silent) {
      console.info(
        'Recipes not found - /recipes pages will not work (optional, pro users only)'
      )
    }
  } else {
    // Generate recipes-proxy.ts using alias that works in both dev and build
    writeFileSync(
      proxyPath,
      `export * from '@hanzogui/recipes/raw'
export { useCurrentRouteParams, CurrentRouteProvider } from '@hanzogui/recipes/provider'
export * as Data from '../../components/recipes-showcase/data'
export * as Sections from '../../components/recipes-showcase/sections'
`
    )

    writeFileSync(
      resolve(HELPERS_DIST_PATH, 'recipes-proxy-data.ts'),
      `export * from '../../components/recipes-showcase/data'\n`
    )

    if (!silent) {
      console.info('Generated recipes proxy with full recipes support')
    }
  }

  return { hasRecipes, subpathStubs }
}

// Run if called directly (postinstall script)
const isMain =
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '') ||
  process.argv[1]?.endsWith('generate-recipes-proxy.mjs')
if (isMain) {
  generateRecipesProxy()
}
