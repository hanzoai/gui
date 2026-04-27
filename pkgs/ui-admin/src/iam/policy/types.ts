// Casbin / Hanzo IAM RBAC domain models. Field shapes are copied
// from the upstream `iam/web/src/{Permission,Model,Enforcer,Adapter}EditPage.tsx`
// constructors. We narrow the surface to the fields the list/edit
// pages actually touch — extras pass through as `Record<string, unknown>`
// when present. No `any`.

// ---------- Permission ----------
//
// Permissions are the user-facing rule rows: WHO can do WHAT on
// WHICH resources, with what effect, scoped to an org. The actions
// space is fixed for non-API resources (Read/Write/Admin) and
// HTTP-method-shaped for API resources (GET/POST). Resources are
// either application names (for "Application" resourceType), tree
// node IDs ("TreeNode"), free-form strings ("Custom"), or HTTP
// path prefixes ("API").

export type PermissionEffect = 'Allow' | 'Deny'
export type PermissionState = 'Approved' | 'Pending'
export type ResourceType = 'Application' | 'TreeNode' | 'Custom' | 'API'

export interface Permission {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description?: string
  users: string[]
  groups?: string[]
  roles: string[]
  domains: string[]
  model?: string
  adapter?: string
  resourceType: ResourceType
  resources: string[]
  actions: string[]
  effect: PermissionEffect
  isEnabled: boolean
  submitter: string
  approver: string
  approveTime: string
  state: PermissionState
}

// ---------- Model ----------
//
// Casbin model definition. `modelText` is the raw .conf body
// (request_definition / policy_definition / role_definition /
// policy_effect / matchers). `builtin` models are not deletable
// and have a frozen modelText.

export interface Model {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description?: string
  modelText: string
}

// ---------- Enforcer ----------
//
// Wires a Model to an Adapter (and optional CRUD policies inline)
// to produce a runtime enforcement engine.

export interface Enforcer {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description?: string
  model?: string
  adapter?: string
  isEnabled?: boolean
  // Cached policy CSV columns derived from the Model's
  // policy_definition. Absent until backend resolves modelCfg.
  modelCfg?: Record<string, string>
}

// ---------- Adapter ----------
//
// Storage backend for an Enforcer's policies. `useSameDb` reuses
// the IAM platform DB; otherwise a separate connection is configured.

export type AdapterDatabaseType =
  | 'mysql'
  | 'postgres'
  | 'mssql'
  | 'oracle'
  | 'sqlite3'

export interface Adapter {
  owner: string
  name: string
  createdTime: string
  displayName?: string
  table: string
  useSameDb: boolean
  type?: string
  databaseType?: AdapterDatabaseType
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
}

// ---------- Casbin Model Validation ----------
//
// AuthzEditor surfaces line/col errors via simple regex checks. We
// don't try to be a full Casbin parser — we just validate the
// section headers and the basic key=value shape so a typo doesn't
// silently break enforcement.

export interface ModelValidationError {
  line: number
  column: number
  message: string
}

const REQUIRED_SECTIONS = [
  'request_definition',
  'policy_definition',
  'policy_effect',
  'matchers',
] as const

const SECTION_HEADER = /^\s*\[([a-z_]+)\]\s*$/
const KEY_VALUE = /^\s*[a-zA-Z_][\w]*\s*=\s*\S.*$/
const COMMENT_OR_BLANK = /^\s*(?:#.*)?$/

// Validate a Casbin model.conf. Returns errors with 1-based
// line/column, or [] on success. Designed to be cheap enough to
// run on every keystroke.
export function validateModelText(text: string): ModelValidationError[] {
  if (!text || text.trim().length === 0) {
    return [{ line: 1, column: 1, message: 'Model is empty' }]
  }
  const errors: ModelValidationError[] = []
  const lines = text.split('\n')
  const seenSections = new Set<string>()
  let currentSection: string | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1

    if (COMMENT_OR_BLANK.test(line)) continue

    const headerMatch = line.match(SECTION_HEADER)
    if (headerMatch) {
      const section = headerMatch[1]
      if (seenSections.has(section)) {
        errors.push({
          line: lineNo,
          column: 1,
          message: `Duplicate section [${section}]`,
        })
      }
      seenSections.add(section)
      currentSection = section
      continue
    }

    if (currentSection === null) {
      errors.push({
        line: lineNo,
        column: 1,
        message: 'Content outside any [section]',
      })
      continue
    }

    if (!KEY_VALUE.test(line)) {
      const col = line.search(/\S/) + 1
      errors.push({
        line: lineNo,
        column: Math.max(col, 1),
        message: `Expected "key = value" inside [${currentSection}]`,
      })
    }
  }

  for (const required of REQUIRED_SECTIONS) {
    if (!seenSections.has(required)) {
      errors.push({
        line: 1,
        column: 1,
        message: `Missing required section [${required}]`,
      })
    }
  }

  return errors
}

// ---------- API envelope ----------
//
// Casdoor responses always look like { status: 'ok'|'error', data, data2, msg }.

export interface IamListResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T[]
  data2?: number
}

export interface IamItemResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T | null
}

export interface IamMutationResponse {
  status: 'ok' | 'error'
  msg?: string
  data?: string
}
