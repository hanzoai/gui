// IAM auth bucket API URL builders. The Casdoor SPA used `/api/...`
// but our gateway exposes the canonical RFC-style surface at
// `/v1/iam/...`. Pages call `authUrl('applications')` → ${base}/v1/iam/applications.
// Pagination/search query params use Casdoor's wire shape (`p`,
// `pageSize`, `field`, `value`, `sortField`, `sortOrder`).
//
// We deliberately mirror the identity-bucket api.ts conventions
// (`iamUrl`, `listQuery`) instead of importing from there: each
// bucket owns its surface so the auth bucket's URLs aren't coupled
// to identity's lifecycle.

const BASE = ''

export function authUrl(path: string, base = BASE): string {
  const trimmed = path.replace(/^\/+/, '')
  return `${base}/v1/iam/${trimmed}`
}

// Casdoor list endpoints accept owner/p/pageSize/field/value/sortField/sortOrder.
export interface ListQuery {
  owner?: string
  page?: number
  pageSize?: number
  field?: string
  value?: string
  sortField?: string
  sortOrder?: string
}

export function listQuery(q: ListQuery): string {
  const sp = new URLSearchParams()
  if (q.owner !== undefined) sp.set('owner', q.owner)
  if (q.page !== undefined) sp.set('p', String(q.page))
  if (q.pageSize !== undefined) sp.set('pageSize', String(q.pageSize))
  if (q.field) sp.set('field', q.field)
  if (q.value) sp.set('value', q.value)
  if (q.sortField) sp.set('sortField', q.sortField)
  if (q.sortOrder) sp.set('sortOrder', q.sortOrder)
  const s = sp.toString()
  return s ? `?${s}` : ''
}
