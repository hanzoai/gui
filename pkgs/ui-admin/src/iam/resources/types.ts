// Wire types for the IAM "Resources Bucket" pages — uploaded resources,
// dynamic forms, exposed sites, MCP servers, audit records, support
// tickets, and traffic rules. These mirror the Casdoor-derived backend
// at /v1/iam/<resource> and stay narrow on purpose: only the fields
// the admin UI actually reads or writes are typed here. Anything else
// the API returns is preserved untouched on round-trip.

export interface ListResponse<T> {
  // Status is "ok" on success; on auth failure the body usually carries
  // a "Please login first" string in `data` and a non-ok status. The
  // pages treat that case as 403 and skip rendering.
  status: 'ok' | 'error'
  msg?: string
  data?: T[]
  // Total row count for paginated lists. Casdoor uses `data2` here for
  // historical reasons; we preserve the wire shape rather than rename
  // and forced upgrade every consumer.
  data2?: number
}

export interface ItemResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data?: T | null
}

export interface ActionResponse {
  status: 'ok' | 'error'
  msg?: string
  data?: unknown
}

// Resource — uploaded file metadata. The actual blob is served from
// `record.url` (object storage). The list page only renders metadata
// and a copy-link/delete pair.
export interface ResourceItem {
  owner: string
  name: string
  user: string
  provider: string
  createdTime: string
  fileType: string
  fileSize: number
  url: string
}

// Form — a typed view over one of the four entity list pages
// (users / applications / providers / organizations). `formItems`
// is the rendered column subset; the editor stores it inline.
export interface FormItem {
  name: string
  label?: string
  visible?: boolean
  isKey?: boolean
}

export type FormType = 'users' | 'applications' | 'providers' | 'organizations'

export interface FormDefinition {
  owner: string
  name: string
  createdTime: string
  displayName: string
  type: FormType | ''
  tag?: string
  formItems: FormItem[]
}

// Site — reverse-proxy site configuration. The admin can map a public
// domain to a backend host, attach an SSL cert, gate access via an IAM
// application, and apply rate/IP rules.
export interface SiteItem {
  owner: string
  name: string
  createdTime: string
  displayName: string
  domain: string
  otherDomains?: string[]
  needRedirect?: boolean
  disableVerbose?: boolean
  rules?: string[]
  enableAlert?: boolean
  alertInterval?: number
  alertTryTimes?: number
  alertProviders?: string[]
  challenges?: unknown[]
  host: string
  port: number
  hosts?: string[]
  sslMode?: 'HTTP' | 'HTTPS and HTTP' | 'HTTPS Only' | 'Static Folder'
  sslCert?: string
  publicIp?: string
  node?: string
  isSelf?: boolean
  nodes?: unknown[]
  iamApplication?: string
  organizations?: string[]
  status?: 'Active' | 'Inactive'
  tag?: string
}

// Server — MCP server registration. URL is the upstream server, the
// `token` field is sensitive and is masked on the edit page.
export interface ServerItem {
  owner: string
  name: string
  createdTime: string
  displayName: string
  url: string
  token?: string
  application: string
  tools?: ServerTool[]
}

export interface ServerTool {
  name: string
  description?: string
  // Tool config is opaque to this UI; the ToolTable handles the inner
  // editing and we just round-trip the JSON here.
  [k: string]: unknown
}

// Record — IAM audit log entry. High-volume; the list page uses the
// virtualized DataTable and a side-drawer for the JSON detail.
export interface RecordItem {
  id: string
  owner?: string
  name: string
  organization: string
  user: string
  clientIp: string
  createdTime: string
  method: string
  requestUri: string
  action: string
  isTriggered: boolean
  language?: string
  statusCode?: number
  response?: string
  // The `object` field is a serialized JSON string of the request
  // payload at the time it was logged. The drawer pretty-prints it.
  object?: string
}

export type TicketState = 'Open' | 'In Progress' | 'Resolved' | 'Closed'

export interface TicketMessage {
  author: string
  text: string
  timestamp: string
  isAdmin: boolean
}

export interface TicketItem {
  owner: string
  name: string
  createdTime: string
  updatedTime: string
  displayName: string
  user: string
  title: string
  content: string
  state: TicketState
  messages: TicketMessage[] | null
}

export type RuleType =
  | 'WAF'
  | 'IP'
  | 'User-Agent'
  | 'IP Rate Limiting'
  | 'Compound'

export type RuleAction = 'Allow' | 'Block'

export interface RuleExpression {
  // Operator semantics depend on `RuleItem.type`. We keep the shape
  // permissive — the inner editors (WafRuleTable / IpRuleTable / ...)
  // own the schema for each type.
  operator?: string
  value?: string
  [k: string]: unknown
}

export interface RuleItem {
  owner: string
  name: string
  createdTime: string
  type: RuleType
  expressions: RuleExpression[]
  action: RuleAction
  reason: string
  statusCode?: number
  isVerbose?: boolean
}

// Common helpers

// `isAdmin` here is purely a UI capability hint — the server is the
// source of truth for permissions. We just use it to gate buttons so
// users without the role don't get rejected mid-action.
export interface AdminAccount {
  owner: string
  name: string
  isAdmin?: boolean
}

export function isAdminAccount(a: AdminAccount): boolean {
  return a.isAdmin === true || a.owner === 'admin' || a.owner === 'built-in'
}

// requestOrg picks the org the active admin is currently scoped to.
// The "default" / "built-in" / "admin" owner means "all orgs", which
// upstream encodes as the empty string at the API.
export function requestOrg(a: AdminAccount): string {
  if (!a.owner || a.owner === 'admin' || a.owner === 'built-in') return ''
  return a.owner
}
