// Thin URL builders for the IAM Resources Bucket. We keep the URL
// shapes here so list/edit pages stay terse, and so a future move
// from /v1/iam/<resource> stays a one-file change.
//
// Pagination + sort + search are query params. The wire shape is
// `pageSize`/`p`/`field`/`value`/`sortField`/`sortOrder`, taken
// straight from the upstream Casdoor controllers — don't normalise.

import type {
  ListResponse,
  ItemResponse,
  ActionResponse,
  ResourceItem,
  FormDefinition,
  SiteItem,
  ServerItem,
  RecordItem,
  TicketItem,
  TicketMessage,
  RuleItem,
} from './types'

const BASE = '/v1/iam'

// urlList builds a list query that matches the wire contract used by
// every Casdoor list controller. Empty params are dropped so the URL
// stays clean in the browser bar and the dev tools.
function urlList(
  resource: string,
  params: {
    owner?: string
    p?: number
    pageSize?: number
    field?: string
    value?: string
    sortField?: string
    sortOrder?: string
  },
): string {
  const q = new URLSearchParams()
  if (params.owner !== undefined) q.set('owner', params.owner)
  if (params.p) q.set('p', String(params.p))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  if (params.field) q.set('field', params.field)
  if (params.value) q.set('value', params.value)
  if (params.sortField) q.set('sortField', params.sortField)
  if (params.sortOrder) q.set('sortOrder', params.sortOrder)
  const qs = q.toString()
  return `${BASE}/${resource}${qs ? `?${qs}` : ''}`
}

function urlItem(resource: string, owner: string, name: string): string {
  // owner+name compose the key on every resource. We URL-encode both
  // segments because admins routinely paste names with slashes.
  const o = encodeURIComponent(owner)
  const n = encodeURIComponent(name)
  return `${BASE}/${resource}/${o}/${n}`
}

export const ResourceUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('resources', p),
  // Resource has no edit endpoint; only upload + delete. Upload is a
  // multipart POST handled by the page directly.
  remove: (item: ResourceItem) =>
    urlItem('resources', item.owner, item.name),
  upload: (owner: string, user: string) =>
    `${BASE}/resources?owner=${encodeURIComponent(owner)}&user=${encodeURIComponent(user)}&tag=admin&parent=ResourceListPage`,
}

export const FormUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('forms', p),
  one: (owner: string, name: string) => urlItem('forms', owner, name),
  create: () => `${BASE}/forms`,
  update: (owner: string, name: string) => urlItem('forms', owner, name),
  remove: (owner: string, name: string) => urlItem('forms', owner, name),
}

export const SiteUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('sites', p),
  globalList: () => `${BASE}/sites/global`,
  one: (owner: string, name: string) => urlItem('sites', owner, name),
  create: () => `${BASE}/sites`,
  update: (owner: string, name: string) => urlItem('sites', owner, name),
  remove: (owner: string, name: string) => urlItem('sites', owner, name),
}

export const ServerUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('servers', p),
  one: (owner: string, name: string) => urlItem('servers', owner, name),
  create: () => `${BASE}/servers`,
  update: (owner: string, name: string) => urlItem('servers', owner, name),
  remove: (owner: string, name: string) => urlItem('servers', owner, name),
}

export const RecordUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('records', p),
}

export const TicketUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('tickets', p),
  one: (owner: string, name: string) => urlItem('tickets', owner, name),
  create: () => `${BASE}/tickets`,
  update: (owner: string, name: string) => urlItem('tickets', owner, name),
  remove: (owner: string, name: string) => urlItem('tickets', owner, name),
  appendMessage: (owner: string, name: string) =>
    `${urlItem('tickets', owner, name)}/messages`,
}

export const RuleUrls = {
  list: (p: Parameters<typeof urlList>[1]) => urlList('rules', p),
  one: (owner: string, name: string) => urlItem('rules', owner, name),
  create: () => `${BASE}/rules`,
  update: (owner: string, name: string) => urlItem('rules', owner, name),
  remove: (owner: string, name: string) => urlItem('rules', owner, name),
}

// Re-export the shared list/item shapes so call sites don't need a
// second import line.
export type {
  ListResponse,
  ItemResponse,
  ActionResponse,
  ResourceItem,
  FormDefinition,
  SiteItem,
  ServerItem,
  RecordItem,
  TicketItem,
  TicketMessage,
  RuleItem,
}
