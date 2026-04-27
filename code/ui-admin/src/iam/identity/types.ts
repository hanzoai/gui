// Casdoor / Hanzo IAM domain models. Field shapes are copied from
// the upstream `iam/web/src/*EditPage.tsx` constructors. We keep the
// surface narrow on purpose — list/edit pages only touch a slice of
// the upstream fields and the rest pass through as `unknown` via
// `Record<string, unknown>` extras when present. No `any`.

// ---------- Organization ----------

export interface AccountItem {
  name: string
  visible: boolean
  viewRule: 'Public' | 'Self' | 'Admin'
  modifyRule: 'Public' | 'Self' | 'Admin' | 'Immutable'
}

export interface Organization {
  owner: string
  name: string
  createdTime: string
  displayName: string
  websiteUrl: string
  favicon?: string
  passwordType: string
  passwordSalt?: string
  passwordOptions?: string[]
  passwordObfuscatorType?: string
  passwordObfuscatorKey?: string
  passwordExpireDays?: number
  countryCodes?: string[]
  defaultAvatar?: string
  defaultApplication?: string
  tags?: string[]
  languages?: string[]
  masterPassword?: string
  defaultPassword?: string
  enableSoftDeletion?: boolean
  isProfilePublic?: boolean
  enableTour?: boolean
  disableSignin?: boolean
  mfaRememberInHours?: number
  balanceCurrency?: string
  accountItems?: AccountItem[]
  initScore?: number
  logoDark?: string
  enableDarkLogo?: boolean
}

// ---------- User ----------

export interface User {
  owner: string
  name: string
  createdTime: string
  updatedTime?: string
  type?: string
  password?: string
  passwordSalt?: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
  email: string
  emailVerified?: boolean
  phone?: string
  countryCode?: string
  region?: string
  location?: string
  address?: string[]
  affiliation?: string
  title?: string
  homepage?: string
  bio?: string
  tag?: string
  language?: string
  gender?: string
  birthday?: string
  education?: string
  score?: number
  karma?: number
  ranking?: number
  isOnline?: boolean
  isAdmin?: boolean
  isForbidden?: boolean
  isDeleted?: boolean
  signupApplication?: string
  registerType?: string
  registerSource?: string
  groups?: string[]
  roles?: Role[]
  permissions?: unknown[]
  properties?: Record<string, string>
  balance?: number
  balanceCurrency?: string
  isVerified?: boolean
  realName?: string
}

// ---------- Group ----------

export interface Group {
  owner: string
  name: string
  createdTime: string
  updatedTime?: string
  displayName: string
  type: 'Virtual' | 'Physical'
  parentId: string
  isTopGroup: boolean
  isEnabled: boolean
  users?: string[]
  // GroupTree flat-to-tree shape:
  key?: string
  title?: string
  children?: Group[]
}

// ---------- Role ----------

export interface Role {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description?: string
  users?: string[]
  groups?: string[]
  roles?: string[]
  domains?: string[]
  isEnabled: boolean
}

// ---------- API envelope ----------

// Casdoor responses always look like { status: 'ok'|'error', data, data2, msg }.
// We'll use this for typed responses where useful.

export interface IamListResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T[]
  data2?: number
}

export interface IamItemResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T
}
