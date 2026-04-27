// IAM auth bucket types — narrowed from the upstream Casdoor JSON
// shapes returned by /v1/iam/applications, /v1/iam/providers,
// /v1/iam/sessions, /v1/iam/tokens, /v1/iam/certs, /v1/iam/keys.
//
// Casdoor returns wide objects with 50+ optional fields. We only
// surface the slice the admin actually edits; everything else is
// preserved by spreading the original record on save (handled at the
// edit page level via `record` state). These types are intentionally
// loose where Casdoor sends free-form strings (provider type, cert
// crypto algorithm, etc.) — narrowing those is at the form level.

// Common envelope returned by every Casdoor list endpoint.
export interface IamListResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T[]
  // Casdoor's pagination total.
  data2?: number
}

export interface IamItemResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data: T | null
}

// Minimal common shape — every Casdoor object has these.
export interface IamRecord {
  owner: string
  name: string
  createdTime: string
}

// IamApplication ----------------------------------------------------
// /v1/iam/applications. The upstream object has 80+ fields; we cherry
// pick only what the admin list + edit views need. Free-form
// extension is preserved on save via the original record.
export interface IamApplication extends IamRecord {
  organization: string
  displayName: string
  category?: string
  type?: string
  logo?: string
  homepageUrl?: string
  description?: string
  cert?: string
  // OAuth surface
  clientId?: string
  clientSecret?: string
  redirectUris?: string[]
  grantTypes?: string[]
  scopes?: string[]
  tokenFormat?: 'JWT' | 'JWT-Empty' | 'Access-Token' | string
  expireInHours?: number
  refreshExpireInHours?: number
  // Sign-in feature flags
  enablePassword?: boolean
  enableSignUp?: boolean
  enableSigninSession?: boolean
  enableCodeSignin?: boolean
  enableSamlCompress?: boolean
  disableSignin?: boolean
  // Linked providers (we surface count only on the list; edit shows
  // the full ProviderItem array, not editable in this bucket).
  providers?: ProviderRef[]
}

export interface ProviderRef {
  name: string
  canSignUp?: boolean
  canSignIn?: boolean
  canUnlink?: boolean
  prompted?: boolean
  signupGroup?: string
  rule?: string
}

// IamProvider -------------------------------------------------------
// /v1/iam/providers — OIDC/OAuth/SAML/LDAP/SMS/Email/Captcha/Web3 etc.
// Casdoor leans on `category`+`type` to dispatch; the UI mirrors that.
export type ProviderCategory =
  | 'OAuth'
  | 'OIDC'
  | 'SAML'
  | 'LDAP'
  | 'Email'
  | 'SMS'
  | 'Captcha'
  | 'MFA'
  | 'Payment'
  | 'Web3'
  | 'Storage'
  | 'Notification'
  | 'Face ID'
  | 'ID Verification'

export interface IamProvider extends IamRecord {
  displayName: string
  category: ProviderCategory | string
  type: string
  // OAuth/OIDC
  method?: 'Normal' | 'Silent' | string
  clientId?: string
  clientSecret?: string
  // OIDC: authorize/token/userinfo URLs are stored as a single object
  // in Casdoor's customXxx fields; we surface the raw strings.
  customAuthUrl?: string
  customTokenUrl?: string
  customUserInfoUrl?: string
  customLogoUrl?: string
  customLogo?: string
  scopes?: string
  // Common cert/host/port for LDAP/SAML
  host?: string
  port?: number
  // LDAP
  enableSsl?: boolean
  baseDn?: string
  // Generic
  enableSignUp?: boolean
  cert?: string
  providerUrl?: string
  // User mapping (OIDC standard claims → Casdoor user fields)
  userMapping?: Record<string, string>
}

// IamSession --------------------------------------------------------
// /v1/iam/sessions — one row per (org, user, application) tuple.
// `sessionId` is the active set of cookie/JWT IDs.
export interface IamSession extends IamRecord {
  application: string
  sessionId: string[]
}

// IamToken ----------------------------------------------------------
// /v1/iam/tokens — issued OAuth/OIDC token records. Includes the raw
// access token (JWT or opaque). The upstream UI shows the JWT decoded
// in a read-only pane on the edit page; we mirror that.
export interface IamToken extends IamRecord {
  application: string
  organization: string
  user: string
  code?: string
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
  tokenType?: 'Bearer' | string
}

// IamCert -----------------------------------------------------------
// /v1/iam/certs — JWT signing certs + SSL certs. The edit page shows
// the public PEM but NEVER the private key (security smell —
// upstream renders the privateKey textarea, we deliberately don't).
export interface IamCert extends IamRecord {
  displayName: string
  scope: 'JWT' | string
  type: 'x509' | 'SSL' | 'Payment' | string
  cryptoAlgorithm: string
  bitSize?: number
  expireInYears?: number
  certificate?: string
  // Intentionally NOT surfaced in edit UI even though the wire shape
  // includes it. Keep for round-trip preservation.
  privateKey?: string
  // SSL-only fields
  expireTime?: string
  domainExpireTime?: string
  provider?: string
  account?: string
  accessKey?: string
  accessSecret?: string
}

// IamKey ------------------------------------------------------------
// /v1/iam/keys — application/organization/user API access keys.
// Same security treatment as certs: accessKey is shown, accessSecret
// is masked behind a `<CopyField>` only when explicitly revealed.
export interface IamKey extends IamRecord {
  updatedTime?: string
  displayName: string
  type: 'Organization' | 'Application' | 'User' | 'General' | string
  organization?: string
  application?: string
  user?: string
  accessKey: string
  accessSecret?: string
  expireTime?: string
  state: 'Active' | 'Inactive' | string
}

// IamOrganization (referenced by edit pages for the org dropdown) ----
export interface IamOrganization {
  name: string
  displayName?: string
}
