// Types for the IAM federation bucket: LDAP servers + their sync
// preview, generic Syncers, Webhooks, Invitations, and Verifications.
//
// These mirror the IAM backend object shapes returned from
// `/v1/iam/{ldap,syncers,webhooks,invitations,verifications}`. They
// are intentionally narrow: only the fields the admin UI reads or
// writes. Server-only fields (e.g. internal counters, opaque blobs)
// are kept out so consumers don't accidentally tunnel them through
// updates.

export interface LdapAttribute {
  name: string
  value: string
}

export interface Ldap {
  id: string
  owner: string
  serverName: string
  host: string
  port: number
  enableSsl: boolean
  allowSelfSignedCert: boolean
  baseDn: string
  filter: string
  filterFields: string[]
  username: string
  // Bind password — opaque on the wire; UI never echoes it after
  // entry. Send-only on update; redacted on fetch.
  password: string
  passwordType: 'Plain' | 'SSHA' | 'MD5'
  defaultGroup: string
  customAttributes: LdapAttribute[]
  // Auto-sync interval in minutes. 0 disables it.
  autoSync: number
}

export interface LdapUserPreview {
  uuid: string
  cn: string
  uid: string
  uidNumber: string
  groupId: string
  email: string
  mobile: string
  address: string
}

export interface LdapSyncResult {
  exist?: { cn: string }[]
  failed?: { cn: string }[]
}

// Streaming progress events emitted by the sync endpoint via SSE.
// `kind` is the discriminator the `useEvents` hook subscribes to.
export type LdapSyncEvent =
  | { kind: 'ldap.sync.started'; total: number }
  | { kind: 'ldap.sync.progress'; current: number; cn: string; status: 'ok' | 'exists' | 'failed'; reason?: string }
  | { kind: 'ldap.sync.completed'; ok: number; existed: number; failed: number }

export type SyncerType =
  | 'Database'
  | 'Keycloak'
  | 'WeCom'
  | 'Azure AD'
  | 'Active Directory'
  | 'Google Workspace'
  | 'DingTalk'
  | 'Lark'
  | 'Okta'
  | 'SCIM'
  | 'AWS IAM'

export interface SyncerColumn {
  name: string
  type: 'string' | 'boolean' | 'number'
  iamName: string
  isHashed: boolean
  values: string[]
}

export interface Syncer {
  owner: string
  name: string
  organization: string
  createdTime: string
  type: SyncerType
  databaseType: 'mysql' | 'postgres' | 'mssql' | 'oracle' | 'sqlite3' | ''
  sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full' | ''
  host: string
  port: number
  user: string
  // Bind password — never echoed after submit.
  password: string
  database: string
  table: string
  tableColumns: SyncerColumn[]
  affiliationTable: string
  avatarBaseUrl: string
  syncInterval: number
  errorText: string
  isReadOnly: boolean
  isEnabled: boolean
  sshType: '' | 'password' | 'cert'
  sshHost: string
  sshPort: number
  sshUser: string
  sshPassword: string
  cert: string
}

export interface WebhookHeader {
  name: string
  value: string
}

export interface Webhook {
  owner: string
  name: string
  organization: string
  createdTime: string
  url: string
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  contentType: 'application/json' | 'application/x-www-form-urlencoded'
  headers: WebhookHeader[]
  events: string[]
  // HMAC signing secret. Send-only; the backend stores a hash and
  // never returns the plaintext. UI must not surface the value
  // after entry.
  secret: string
  isUserExtended: boolean
  singleOrgOnly: boolean
  isEnabled: boolean
}

export interface Invitation {
  owner: string
  name: string
  createdTime: string
  updatedTime: string
  displayName: string
  // Active code: rotates after each use.
  code: string
  // Default code: pinned, used when generating sign-up URLs.
  defaultCode: string
  quota: number
  usedCount: number
  application: string
  username: string
  email: string
  phone: string
  signupGroup: string
  state: 'Active' | 'Suspended'
  tag?: string
}

export interface Verification {
  owner: string
  name: string
  createdTime: string
  type: string
  user: string
  provider: string
  remoteAddr: string
  receiver: string
  code: string
  isUsed: boolean
}

// Standard envelope returned by every IAM list endpoint. `data2`
// holds the unfiltered total used for pagination.
export interface IamListResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T[]
  data2: number
}

export interface IamItemResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T
}
