import { RECIPES_COLLECTION, resolveBaseUrl } from './config.js'
import type { Recipe, RecipeInput } from './types.js'

export type AdminAuth = {
  baseUrl?: string
  token: string
}

export type AdminPasswordAuth = {
  baseUrl?: string
  email: string
  password: string
}

/** Exchanges admin email+password for a Base session token. */
export async function authAdmin({ baseUrl, email, password }: AdminPasswordAuth): Promise<string> {
  const url = `${resolveBaseUrl(baseUrl)}/v1/base/admins/auth-with-password`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  })
  if (!res.ok) {
    throw new Error(`Admin auth failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { token: string }
  return data.token
}

/** Idempotent: creates the gui_recipes collection if missing, no-ops otherwise. */
export async function ensureCollection(auth: AdminAuth): Promise<'created' | 'existed'> {
  const base = resolveBaseUrl(auth.baseUrl)
  const headers = { Authorization: auth.token, 'Content-Type': 'application/json' }
  const probe = await fetch(`${base}/v1/base/collections/${RECIPES_COLLECTION}`, { headers })
  if (probe.ok) return 'existed'

  const schema = {
    name: RECIPES_COLLECTION,
    type: 'base',
    schema: [
      { name: 'slug', type: 'text', required: true, unique: true, options: {} },
      { name: 'name', type: 'text', required: true, options: {} },
      { name: 'description', type: 'text', required: false, options: {} },
      { name: 'category', type: 'text', required: false, options: {} },
      { name: 'npmDeps', type: 'json', required: false, options: {} },
      { name: 'recipeDeps', type: 'json', required: false, options: {} },
      { name: 'files', type: 'json', required: true, options: {} },
    ],
    indexes: [`CREATE UNIQUE INDEX idx_${RECIPES_COLLECTION}_slug ON ${RECIPES_COLLECTION} (slug)`],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  }
  const res = await fetch(`${base}/v1/base/collections`, {
    method: 'POST',
    headers,
    body: JSON.stringify(schema),
  })
  if (!res.ok) {
    throw new Error(`Failed to create collection: ${res.status} ${await res.text()}`)
  }
  return 'created'
}

async function findExisting(auth: AdminAuth, slug: string): Promise<string | null> {
  const base = resolveBaseUrl(auth.baseUrl)
  const filter = encodeURIComponent(`slug="${slug}"`)
  const res = await fetch(
    `${base}/v1/base/collections/${RECIPES_COLLECTION}/records?perPage=1&filter=${filter}`,
    { headers: { Authorization: auth.token } }
  )
  if (!res.ok) return null
  const data = (await res.json()) as { items: Array<{ id: string }> }
  return data.items[0]?.id ?? null
}

/** Upsert by slug: PATCH if existing, POST if new. */
export async function upsertRecipe(
  auth: AdminAuth,
  recipe: RecipeInput
): Promise<'created' | 'updated'> {
  const base = resolveBaseUrl(auth.baseUrl)
  const headers = { Authorization: auth.token, 'Content-Type': 'application/json' }
  const body = JSON.stringify(recipe)
  const existing = await findExisting(auth, recipe.slug)
  if (existing) {
    const res = await fetch(
      `${base}/v1/base/collections/${RECIPES_COLLECTION}/records/${existing}`,
      { method: 'PATCH', headers, body }
    )
    if (!res.ok) throw new Error(`PATCH ${recipe.slug}: ${res.status} ${await res.text()}`)
    return 'updated'
  }
  const res = await fetch(`${base}/v1/base/collections/${RECIPES_COLLECTION}/records`, {
    method: 'POST',
    headers,
    body,
  })
  if (!res.ok) throw new Error(`POST ${recipe.slug}: ${res.status} ${await res.text()}`)
  return 'created'
}
