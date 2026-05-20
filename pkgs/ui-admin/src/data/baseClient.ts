// Base client — typed fetch wrappers for any hanzoai/base-backed
// service. One factory, one React context, one hook. The shape is
// lifted from apps/admin-base/src/lib/api.ts so every admin SPA
// (admin-base, admin-auto, admin-commerce, …) consumes the same path.
//
// Why a factory? The mount prefix differs per service:
//   - hanzoai/base default → /v1
//   - hanzoai/auto         → /v1/auto
//   - hanzoai/commerce     → /v1/commerce
// IAM is always a fixed sibling at /v1/iam regardless. A consumer
// constructs one client at app bootstrap and passes it through
// <BaseClientProvider>.
//
// Auth: the client doesn't manage tokens. It calls a caller-supplied
// `getToken()` on every request. The canonical store is the
// `IAM` class from `@hanzo/iam/browser` (see auth/AuthGate). This keeps
// transport (here) and identity (there) orthogonal.

import { createContext, createElement, useContext, type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Domain types — match base server schema
// ---------------------------------------------------------------------------

export interface ListResult<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

export interface CollectionField {
  id: string
  name: string
  type: string
  system: boolean
  hidden: boolean
  presentable: boolean
  required?: boolean
  [key: string]: unknown
}

export interface CollectionModel {
  id: string
  name: string
  type: string
  system: boolean
  fields: CollectionField[]
  indexes: string[]
  listRule: string | null
  viewRule: string | null
  createRule: string | null
  updateRule: string | null
  deleteRule: string | null
  [key: string]: unknown
}

export interface RecordModel {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  [key: string]: unknown
}

export interface BrandInfo {
  name?: string
  title?: string
  description?: string
  primaryColor?: string
  appDomain?: string
  logoUrl?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

export interface BaseClientOptions {
  /**
   * API mount prefix relative to origin. Examples:
   *   "/v1"           — base default
   *   "/v1/auto"      — auto service
   *   "/v1/commerce"  — commerce service
   * Leading/trailing slashes are normalised; no `/api/` prefix.
   */
  apiPrefix?: string
  /**
   * Returns the current bearer token. Called per-request so it always
   * picks up the latest from the auth store. Empty string disables
   * the Authorization header (anonymous requests).
   */
  getToken?: () => string
  /**
   * Optional fetch override (tests, server-side proxy, etc.). Defaults
   * to a thin wrapper around the global fetch. Signature is
   * intentionally narrow to avoid Bun's `typeof fetch` vs DOM lib
   * incompatibility.
   */
  fetchImpl?: (url: string, init?: RequestInit) => Promise<Response>
  /**
   * Invoked when any request comes back 401. Lets the consumer trigger
   * a redirect to login. The client still throws the ApiError.
   */
  onUnauthorized?: () => void
}

export interface BaseClient {
  readonly apiPrefix: string
  /** Resolve a relative path against the configured prefix. */
  path(p: string): string
  /** Low-level request (throws ApiError on non-2xx). */
  request<T = unknown>(path: string, init?: RequestInit): Promise<T>
  /** Brand metadata for white-label rendering. */
  getBrand(): Promise<BrandInfo>
  /** List all collections (sets perPage high to avoid paging in the shell). */
  listCollections(params?: { sort?: string; filter?: string }): Promise<CollectionModel[]>
  /** Fetch a single collection by id or name. */
  getCollection(idOrName: string): Promise<CollectionModel>
  /** Paged record list under a collection. */
  listRecords(
    collection: string,
    page: number,
    perPage: number,
    params?: { sort?: string; filter?: string }
  ): Promise<ListResult<RecordModel>>
  /** Fetch a single record. */
  getRecord(collection: string, id: string): Promise<RecordModel>
  /** Create a record (JSON or multipart). */
  createRecord(
    collection: string,
    data: FormData | Record<string, unknown>
  ): Promise<RecordModel>
  /** Patch a record. */
  updateRecord(
    collection: string,
    id: string,
    data: FormData | Record<string, unknown>
  ): Promise<RecordModel>
  /** Delete a record. */
  deleteRecord(collection: string, id: string): Promise<void>
}

function normalisePrefix(raw: string | undefined): string {
  // Collapse all runs of `/` to a single slash, then trim outer
  // slashes. This means `//v1//auto//` → `v1/auto` → `/v1/auto`.
  const v = (raw ?? '/v1').trim().replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
  return '/' + v
}

export function createBaseClient(opts: BaseClientOptions = {}): BaseClient {
  const apiPrefix = normalisePrefix(opts.apiPrefix)
  const getToken = opts.getToken ?? (() => '')
  const fetchImpl = opts.fetchImpl ?? ((url: string, init?: RequestInit) => fetch(url, init))

  function path(p: string): string {
    return apiPrefix + (p.startsWith('/') ? p : '/' + p)
  }

  async function request<T>(p: string, init?: RequestInit): Promise<T> {
    const url = p.startsWith('http') || p.startsWith(apiPrefix) ? p : path(p)
    const token = getToken()
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...((init?.headers as Record<string, string>) ?? {}),
    }
    if (token) {
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    if (init?.body && !(init.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    const res = await fetchImpl(url, { ...init, headers })
    if (!res.ok) {
      let data: unknown
      try {
        data = await res.json()
      } catch {
        /* non-json body */
      }
      const msg =
        (data as { message?: string } | null)?.message ?? res.statusText ?? `HTTP ${res.status}`
      if (res.status === 401) opts.onUnauthorized?.()
      throw new ApiError(res.status, msg, data)
    }
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  function qs(params: Record<string, string | number | boolean | undefined>): string {
    const parts: string[] = []
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      }
    }
    return parts.length ? '?' + parts.join('&') : ''
  }

  return {
    apiPrefix,
    path,
    request,
    getBrand: () => request<BrandInfo>('/brand').catch(() => ({}) as BrandInfo),
    listCollections: async (params) => {
      const q = qs({ sort: params?.sort, filter: params?.filter, perPage: 500 })
      const res = await request<ListResult<CollectionModel>>(`/collections${q}`)
      return res.items
    },
    getCollection: (idOrName) =>
      request<CollectionModel>(`/collections/${encodeURIComponent(idOrName)}`),
    listRecords: (collection, page, perPage, params) => {
      const q = qs({ page, perPage, sort: params?.sort, filter: params?.filter })
      return request<ListResult<RecordModel>>(
        `/collections/${encodeURIComponent(collection)}/records${q}`
      )
    },
    getRecord: (collection, id) =>
      request<RecordModel>(
        `/collections/${encodeURIComponent(collection)}/records/${encodeURIComponent(id)}`
      ),
    createRecord: (collection, data) => {
      const body = data instanceof FormData ? data : JSON.stringify(data)
      return request<RecordModel>(`/collections/${encodeURIComponent(collection)}/records`, {
        method: 'POST',
        body,
      })
    },
    updateRecord: (collection, id, data) => {
      const body = data instanceof FormData ? data : JSON.stringify(data)
      return request<RecordModel>(
        `/collections/${encodeURIComponent(collection)}/records/${encodeURIComponent(id)}`,
        { method: 'PATCH', body }
      )
    },
    deleteRecord: (collection, id) =>
      request<void>(
        `/collections/${encodeURIComponent(collection)}/records/${encodeURIComponent(id)}`,
        { method: 'DELETE' }
      ),
  }
}

// ---------------------------------------------------------------------------
// React binding — Provider + hook
// ---------------------------------------------------------------------------

const BaseClientContext = createContext<BaseClient | null>(null)

export interface BaseClientProviderProps {
  client: BaseClient
  children: ReactNode
}

export function BaseClientProvider({ client, children }: BaseClientProviderProps) {
  return createElement(BaseClientContext.Provider, { value: client }, children)
}

export function useBaseClient(): BaseClient {
  const ctx = useContext(BaseClientContext)
  if (!ctx) {
    throw new Error(
      '[useBaseClient] No <BaseClientProvider> in tree. Wrap your app: ' +
        '<BaseClientProvider client={createBaseClient({apiPrefix})}>…</BaseClientProvider>'
    )
  }
  return ctx
}

// Bound fetcher for @hanzogui/admin's useFetch. Pass it through
// useFetch's `{ fetcher }` option to inject the client's Authorization
// header on every GET.
export function makeAuthedFetcher(client: BaseClient): (url: string) => Promise<unknown> {
  return (url: string) => client.request<unknown>(url)
}
