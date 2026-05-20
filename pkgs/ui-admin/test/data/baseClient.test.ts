// baseClient — the typed wrapper around any hanzoai/base API. Tests
// cover the seam points: prefix normalisation, Authorization header
// injection, ApiError surfacing, and 401 → onUnauthorized.

import { describe, expect, it, vi } from 'vitest'
import { createBaseClient, ApiError } from '../../src/data/baseClient'

function makeFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.fn((url: string, init?: RequestInit) => Promise.resolve(handler(url, init)))
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('createBaseClient', () => {
  it('normalises the api prefix', () => {
    expect(createBaseClient({ apiPrefix: '/v1/auto' }).apiPrefix).toBe('/v1/auto')
    expect(createBaseClient({ apiPrefix: 'v1/auto' }).apiPrefix).toBe('/v1/auto')
    expect(createBaseClient({ apiPrefix: '/v1/auto/' }).apiPrefix).toBe('/v1/auto')
    expect(createBaseClient({ apiPrefix: '//v1//auto//' }).apiPrefix).toBe('/v1/auto')
    expect(createBaseClient().apiPrefix).toBe('/v1')
  })

  it('attaches Bearer token from getToken()', async () => {
    const fetchImpl = makeFetch(() => jsonResponse({ items: [] }))
    const client = createBaseClient({
      apiPrefix: '/v1/auto',
      getToken: () => 'TOK',
      fetchImpl,
    })
    await client.listCollections()
    const [, init] = fetchImpl.mock.calls[0]
    const headers = init?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer TOK')
  })

  it('does not double-prefix Bearer when token already prefixed', async () => {
    const fetchImpl = makeFetch(() => jsonResponse({ items: [] }))
    const client = createBaseClient({
      apiPrefix: '/v1',
      getToken: () => 'Bearer ALREADY',
      fetchImpl,
    })
    await client.listCollections()
    const [, init] = fetchImpl.mock.calls[0]
    const headers = init?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer ALREADY')
  })

  it('omits Authorization when getToken returns empty', async () => {
    const fetchImpl = makeFetch(() => jsonResponse({ items: [] }))
    const client = createBaseClient({ apiPrefix: '/v1', getToken: () => '', fetchImpl })
    await client.listCollections()
    const [, init] = fetchImpl.mock.calls[0]
    const headers = init?.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('surfaces non-2xx as ApiError and fires onUnauthorized on 401', async () => {
    const fetchImpl = makeFetch(() => jsonResponse({ message: 'nope' }, 401))
    const onUnauthorized = vi.fn()
    const client = createBaseClient({ apiPrefix: '/v1', fetchImpl, onUnauthorized })
    await expect(client.listCollections()).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('routes record CRUD to /collections/:name/records/:id', async () => {
    const calls: Array<[string, string | undefined]> = []
    const fetchImpl = makeFetch((url, init) => {
      calls.push([url, init?.method])
      return jsonResponse({ id: 'r1', collectionId: 'c', collectionName: 'flows', created: '', updated: '' })
    })
    const client = createBaseClient({ apiPrefix: '/v1/auto', fetchImpl })
    await client.createRecord('flows', { name: 'x' })
    await client.updateRecord('flows', 'r1', { name: 'y' })
    await client.deleteRecord('flows', 'r1')
    expect(calls).toEqual([
      ['/v1/auto/collections/flows/records', 'POST'],
      ['/v1/auto/collections/flows/records/r1', 'PATCH'],
      ['/v1/auto/collections/flows/records/r1', 'DELETE'],
    ])
  })

  it('getBrand swallows errors and returns empty info', async () => {
    const fetchImpl = makeFetch(() => jsonResponse({ message: 'no brand' }, 404))
    const client = createBaseClient({ apiPrefix: '/v1/auto', fetchImpl })
    const brand = await client.getBrand()
    expect(brand).toEqual({})
  })
})
