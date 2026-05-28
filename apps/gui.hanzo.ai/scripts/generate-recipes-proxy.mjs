import { mkdirSync } from 'node:fs'
import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  const hasRecipes = existsSync(RECIPES_PATH)

  // Ensure dist exists
  mkdirSync(HELPERS_DIST_PATH, { recursive: true })

  const proxyPath = resolve(HELPERS_DIST_PATH, 'recipes-proxy.ts')
  const existingContent = existsSync(proxyPath) ? readFileSync(proxyPath, 'utf-8') : ''
  const isStub = existingContent.includes('Stub file for when recipes is not available')
  const hasCurrentRouteProvider = existingContent.includes('CurrentRouteProvider')

  // Skip if already generated with correct state and has all exports
  if (existingContent && isStub === !hasRecipes && hasCurrentRouteProvider) {
    return { hasRecipes }
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

  return { hasRecipes }
}

// Run if called directly (postinstall script)
const isMain =
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '') ||
  process.argv[1]?.endsWith('generate-recipes-proxy.mjs')
if (isMain) {
  generateRecipesProxy()
}
