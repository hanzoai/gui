import { RECIPES_COLLECTION, resolveBaseUrl } from './config.js'
import { findProjectRoot, readConfig, resolveInstallDir } from './project.js'
import type { InstallPlan, Recipe, RecipeSummary } from './types.js'

type ListResponse<T> = {
  items: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export type ReaderOptions = {
  baseUrl?: string
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw Object.assign(
      new Error(`Base request failed: ${res.status} ${res.statusText}`),
      {
        status: res.status,
      }
    )
  }
  return (await res.json()) as T
}

function records(baseUrl?: string): string {
  return `${resolveBaseUrl(baseUrl)}/v1/base/collections/${RECIPES_COLLECTION}/records`
}

export async function listRecipes(opts: ReaderOptions = {}): Promise<RecipeSummary[]> {
  const url = `${records(opts.baseUrl)}?perPage=200&sort=name&fields=id,slug,name,description,category`
  const data = await getJSON<ListResponse<RecipeSummary>>(url)
  return data.items
}

export async function getRecipe(slug: string, opts: ReaderOptions = {}): Promise<Recipe> {
  const filter = encodeURIComponent(`slug="${slug}"`)
  const url = `${records(opts.baseUrl)}?perPage=1&filter=${filter}`
  const data = await getJSON<ListResponse<Recipe>>(url)
  const recipe = data.items[0]
  if (!recipe) {
    throw Object.assign(new Error(`Recipe not found: ${slug}`), { status: 404 })
  }
  return recipe
}

export type ResolveOptions = ReaderOptions & {
  /** Override the install dir lookup; if omitted, resolved from the user's project. */
  installDir?: string
  /** Override the project root for path resolution. */
  cwd?: string
}

/** Walks recipeDeps transitively, computes target paths under the resolved install dir. */
export async function resolveRecipe(
  slug: string,
  opts: ResolveOptions = {}
): Promise<InstallPlan> {
  const seen = new Map<string, Recipe>()
  const queue = [slug]
  while (queue.length) {
    const next = queue.shift()!
    if (seen.has(next)) continue
    const recipe = await getRecipe(next, opts)
    seen.set(next, recipe)
    for (const dep of recipe.recipeDeps ?? []) {
      if (!seen.has(dep)) queue.push(dep)
    }
  }

  const installDir =
    opts.installDir ??
    (await (async () => {
      const root = await findProjectRoot(opts.cwd)
      return resolveInstallDir(root, await readConfig(root))
    })())

  const recipe = seen.get(slug)!
  const transitiveRecipes = Array.from(seen.values()).filter((r) => r.slug !== slug)
  const path = await import('node:path')
  const targetPaths = [recipe, ...transitiveRecipes].flatMap((r) =>
    r.files.map((f) => path.join(installDir, f.path))
  )

  return { recipe, transitiveRecipes, targetPaths }
}
