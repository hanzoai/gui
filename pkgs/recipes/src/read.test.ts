import { test, expect, beforeEach, afterEach, mock } from 'bun:test'
import { listRecipes, getRecipe, resolveRecipe } from './read.js'
import type { Recipe } from './types.js'

const BASE = 'https://example.test'

type FetchCall = { url: string; init?: RequestInit }

let calls: FetchCall[] = []
let responses: Array<(url: string) => Response>
const originalFetch = globalThis.fetch

beforeEach(() => {
  calls = []
  responses = []
  globalThis.fetch = ((url: string, init?: RequestInit) => {
    calls.push({ url, init })
    const handler = responses.shift()
    if (!handler) throw new Error(`No response queued for ${url}`)
    return Promise.resolve(handler(url))
  }) as typeof fetch
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const recipeFixture = (slug: string, recipeDeps: string[] = []): Recipe => ({
  id: `id-${slug}`,
  slug,
  name: slug,
  description: '',
  category: 'test',
  npmDeps: [],
  recipeDeps,
  files: [{ path: `${slug}.tsx`, source: `// ${slug}` }],
  created: '',
  updated: '',
})

test('listRecipes hits /v1/base path and returns items', async () => {
  responses = [() => jsonResponse({ items: [recipeFixture('a'), recipeFixture('b')], page: 1, perPage: 200, totalItems: 2, totalPages: 1 })]
  const recipes = await listRecipes({ baseUrl: BASE })
  expect(recipes).toHaveLength(2)
  expect(calls[0].url).toContain('/v1/base/collections/gui_recipes/records')
  expect(calls[0].url).not.toContain('/api/')
})

test('getRecipe filters by slug and returns first item', async () => {
  responses = [() => jsonResponse({ items: [recipeFixture('foo')], page: 1, perPage: 1, totalItems: 1, totalPages: 1 })]
  const recipe = await getRecipe('foo', { baseUrl: BASE })
  expect(recipe.slug).toBe('foo')
  expect(calls[0].url).toContain('filter=')
  expect(decodeURIComponent(calls[0].url)).toContain('slug="foo"')
})

test('getRecipe throws 404 when no items', async () => {
  responses = [() => jsonResponse({ items: [], page: 1, perPage: 1, totalItems: 0, totalPages: 0 })]
  try {
    await getRecipe('missing', { baseUrl: BASE })
    throw new Error('should have thrown')
  } catch (e: any) {
    expect(e.status).toBe(404)
    expect(e.message).toContain('missing')
  }
})

test('resolveRecipe walks transitive recipeDeps', async () => {
  responses = [
    () => jsonResponse({ items: [recipeFixture('parent', ['childA', 'childB'])], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
    () => jsonResponse({ items: [recipeFixture('childA', ['grandchild'])], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
    () => jsonResponse({ items: [recipeFixture('childB')], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
    () => jsonResponse({ items: [recipeFixture('grandchild')], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
  ]
  const plan = await resolveRecipe('parent', { baseUrl: BASE, installDir: '/tmp/test' })
  expect(plan.recipe.slug).toBe('parent')
  expect(plan.transitiveRecipes.map((r) => r.slug).sort()).toEqual(['childA', 'childB', 'grandchild'])
  expect(plan.targetPaths).toHaveLength(4)
  expect(plan.targetPaths.every((p) => p.startsWith('/tmp/test/'))).toBe(true)
})

test('resolveRecipe avoids re-fetching cycles', async () => {
  responses = [
    () => jsonResponse({ items: [recipeFixture('a', ['b'])], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
    () => jsonResponse({ items: [recipeFixture('b', ['a'])], page: 1, perPage: 1, totalItems: 1, totalPages: 1 }),
  ]
  const plan = await resolveRecipe('a', { baseUrl: BASE, installDir: '/tmp/test' })
  expect(plan.recipe.slug).toBe('a')
  expect(plan.transitiveRecipes.map((r) => r.slug)).toEqual(['b'])
  expect(calls).toHaveLength(2) // not 3 — cycle detected
})
