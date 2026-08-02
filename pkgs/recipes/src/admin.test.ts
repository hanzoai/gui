import { test, expect, beforeEach, afterEach } from 'bun:test'
import { authAdmin, ensureCollection, upsertRecipe } from './admin.js'

const BASE = 'https://example.test'

let calls: Array<{ url: string; method?: string; body?: string }> = []
let responses: Response[]
const originalFetch = globalThis.fetch

beforeEach(() => {
  calls = []
  responses = []
  globalThis.fetch = ((url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method, body: init?.body as string | undefined })
    const r = responses.shift()
    if (!r) throw new Error(`No response queued for ${url}`)
    return Promise.resolve(r)
  }) as typeof fetch
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
const empty = (status: number) => new Response('', { status })

test('authAdmin POSTs to /v1/base/admins/auth-with-password and returns token', async () => {
  responses = [json({ token: 'tok-abc' })]
  const token = await authAdmin({ baseUrl: BASE, email: 'z@hanzo.ai', password: 'pw' })
  expect(token).toBe('tok-abc')
  expect(calls[0].url).toBe(`${BASE}/v1/base/admins/auth-with-password`)
  expect(calls[0].method).toBe('POST')
  expect(JSON.parse(calls[0].body!)).toEqual({ identity: 'z@hanzo.ai', password: 'pw' })
})

test('authAdmin throws on bad credentials', async () => {
  responses = [new Response('bad', { status: 401 })]
  try {
    await authAdmin({ baseUrl: BASE, email: 'z@hanzo.ai', password: 'wrong' })
    throw new Error('expected throw')
  } catch (e: any) {
    expect(e.message).toContain('Admin auth failed')
    expect(e.message).toContain('401')
  }
})

test('ensureCollection returns "existed" when collection probe is 200', async () => {
  responses = [json({ name: 'gui_recipes' })]
  expect(await ensureCollection({ baseUrl: BASE, token: 't' })).toBe('existed')
  expect(calls).toHaveLength(1)
})

test('ensureCollection POSTs schema when probe is 404, returns "created"', async () => {
  responses = [empty(404), json({ id: 'new' })]
  expect(await ensureCollection({ baseUrl: BASE, token: 't' })).toBe('created')
  expect(calls[1].method).toBe('POST')
  expect(calls[1].url).toBe(`${BASE}/v1/base/collections`)
  const sent = JSON.parse(calls[1].body!)
  expect(sent.name).toBe('gui_recipes')
  expect(sent.schema.find((f: any) => f.name === 'slug').unique).toBe(true)
})

test('upsertRecipe POSTs new record when no existing match', async () => {
  responses = [
    json({ items: [], page: 1, perPage: 1, totalItems: 0, totalPages: 0 }),
    json({ id: 'new-id' }),
  ]
  const result = await upsertRecipe(
    { baseUrl: BASE, token: 't' },
    {
      slug: 'x',
      name: 'X',
      description: '',
      category: 'misc',
      npmDeps: [],
      recipeDeps: [],
      files: [],
    }
  )
  expect(result).toBe('created')
  expect(calls[1].method).toBe('POST')
  expect(calls[1].url).toBe(`${BASE}/v1/base/collections/gui_recipes/records`)
})

test('upsertRecipe PATCHes existing record when slug matches', async () => {
  responses = [
    json({
      items: [{ id: 'existing-id' }],
      page: 1,
      perPage: 1,
      totalItems: 1,
      totalPages: 1,
    }),
    json({ id: 'existing-id' }),
  ]
  const result = await upsertRecipe(
    { baseUrl: BASE, token: 't' },
    {
      slug: 'x',
      name: 'X',
      description: '',
      category: 'misc',
      npmDeps: [],
      recipeDeps: [],
      files: [],
    }
  )
  expect(result).toBe('updated')
  expect(calls[1].method).toBe('PATCH')
  expect(calls[1].url).toBe(`${BASE}/v1/base/collections/gui_recipes/records/existing-id`)
})
