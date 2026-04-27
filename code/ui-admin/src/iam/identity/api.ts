// Tiny IAM API base resolver. The upstream Casdoor SPA builds URLs as
// `/api/get-organizations`, but our gateway exposes the standardized
// RFC-style surface at `/v1/iam/...`. Pages call `iamUrl('organizations')`
// which yields `${base}/v1/iam/organizations`. Override via
// `useApiBase()` if a deployment runs behind a different prefix.

const DEFAULT_BASE = ''

export function useApiBase(): string {
  // No global config plumbing yet — same-origin by default. When the
  // admin shell adopts a runtime config provider, swap this to read
  // it. Keep the function shape stable so call sites don't churn.
  return DEFAULT_BASE
}

export function iamUrl(path: string, base = DEFAULT_BASE): string {
  const trimmed = path.replace(/^\/+/, '')
  return `${base}/v1/iam/${trimmed}`
}

// Casdoor list endpoints accept owner/page/pageSize/field/value/sortField/sortOrder
// as query string. We expose a typed builder so each page doesn't
// hand-roll URLSearchParams. `groupName` is opt-in for the user list
// when scoped to a tree group.
export interface ListQuery {
  owner?: string
  page?: number
  pageSize?: number
  field?: string
  value?: string
  sortField?: string
  sortOrder?: string
  groupName?: string
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
  if (q.groupName) sp.set('groupName', q.groupName)
  const s = sp.toString()
  return s ? `?${s}` : ''
}
