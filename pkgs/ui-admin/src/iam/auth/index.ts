// IAM auth bucket barrel — applications, OAuth providers, sessions,
// tokens, certs, keys. Sister bucket of `iam/identity` (orgs, users,
// roles). Auth surface = "who can call what"; identity surface =
// "who they are".
//
// Each page is a route-target component; mount via the admin
// router using `/iam/auth/applications`, `/iam/auth/providers`, etc.
// Edit pages take `useParams<>()` for owner/name segments.

export { AppList, type AppListProps } from './AppList'
export { AppEdit } from './AppEdit'
export { ProviderList, type ProviderListProps } from './ProviderList'
export { ProviderEdit } from './ProviderEdit'
export { SessionList, type SessionListProps } from './SessionList'
export { TokenList, type TokenListProps } from './TokenList'
export { TokenEdit } from './TokenEdit'
export { CertList, type CertListProps } from './CertList'
export { CertEdit } from './CertEdit'
export { KeyList, type KeyListProps } from './KeyList'
export { KeyEdit } from './KeyEdit'

export type {
  IamApplication,
  IamProvider,
  ProviderCategory,
  ProviderRef,
  IamSession,
  IamToken,
  IamCert,
  IamKey,
  IamOrganization,
  IamListResponse,
  IamItemResponse,
  IamRecord,
} from './types'

export { authUrl, listQuery, type ListQuery } from './api'

export {
  Field,
  ToggleField,
  SelectField,
  type FieldProps,
  type ToggleFieldProps,
  type SelectFieldProps,
} from './components'
