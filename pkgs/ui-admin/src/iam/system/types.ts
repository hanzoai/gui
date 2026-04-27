// Wire types for IAM system bucket — SystemInfo, runtime config, and
// the auth flows. These mirror the Casdoor-derived backend at
// `/v1/iam/*` and are intentionally minimal. The pages preserve any
// extra fields the API returns on round-trip.

export interface ListResponse<T> {
  status: 'ok' | 'error'
  msg?: string
  data?: T[]
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

// SystemInfo — runtime metrics surfaced by the admin dashboard.
// `cpuUsage` is one entry per logical core, each a percentage 0–100.
// `memoryUsed` / `memoryTotal` are bytes.
export interface SystemInfo {
  cpuUsage: number[]
  memoryUsed: number
  memoryTotal: number
}

// VersionInfo — built into the binary at compile time. `version` is a
// semver tag if present; `commitOffset` counts commits ahead of the
// tagged release (when running from a branch).
export interface VersionInfo {
  version: string
  commitOffset?: number
}

// PrometheusInfo — observability surface scraped from the in-process
// metrics endpoint. Both arrays are time-series snapshots (latest
// observation last). `totalThroughput` is an aggregate counter.
export interface PrometheusInfo {
  apiThroughput: number[]
  apiLatency: number[]
  totalThroughput: number
}

// RuntimeConfig — frontend config posted by the backend via the
// `jsonWebConfig` cookie. Used by the auth pages and the management
// shell. Mirrors `~/work/hanzo/iam/web/src/Conf.tsx` defaults.
export interface RuntimeConfig {
  showGithubCorner?: boolean
  isDemoMode?: boolean
  forceLanguage?: string
  defaultLanguage?: string
  staticBaseUrl?: string
  aiAssistantUrl?: string
}

// Application — the IAM application object that drives the auth flow.
// The end-user login page reads its branding (displayName, logo,
// formBackgroundUrl), allowed providers, and signup items from here.
export interface Application {
  owner: string
  name: string
  displayName?: string
  description?: string
  logo?: string
  organization?: string
  organizationObj?: { displayName?: string; ipRestriction?: string }
  formBackgroundUrl?: string
  formBackgroundUrlMobile?: string
  ipRestriction?: string
  enablePassword?: boolean
  enableSignUp?: boolean
  enableCodeSignin?: boolean
  enableSamlCompress?: boolean
  signupItems?: SignupItem[]
  providers?: Array<{
    name: string
    rule?: 'Always' | 'Dynamic' | 'None'
    provider?: { owner: string; name: string; type: string; category: string }
  }>
}

export interface SignupItem {
  name: string
  label?: string
  visible?: boolean
  required?: boolean
  prompted?: boolean
  type?: 'Input' | 'Single Choice' | 'Multiple Choices'
  placeholder?: string
  regex?: string
  options?: string[]
}

// CaptchaProvider — the one captcha provider the application is
// configured with. The page picks an "Always" rule provider over a
// "Dynamic" one when both exist (matches Casdoor behaviour).
export type CaptchaKind = 'reCAPTCHA' | 'Cloudflare Turnstile' | 'hCaptcha' | 'Default' | 'none'

// MfaProps — payload returned by `/v1/iam/mfa/setup/initiate`. For
// TOTP, `secret` is the base32 secret, `url` is the otpauth:// URL
// the authenticator app consumes, and `qrCodeDataUrl` is an
// optional pre-rendered SVG/PNG data URL when the backend ships one.
export interface MfaProps {
  mfaType: 'app' | 'sms' | 'email' | 'recovery'
  secret?: string
  url?: string
  qrCodeDataUrl?: string
  recoveryCodes?: string[]
  dest?: string
  countryCode?: string
  mfaRememberInHours?: number
}
