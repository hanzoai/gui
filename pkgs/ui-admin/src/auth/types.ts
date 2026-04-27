// Wire types for the end-user auth surface. The forms POST these
// against the IAM backend at `/v1/iam/login`, `/v1/iam/signup`,
// `/v1/iam/forget-password`, and `/v1/iam/mfa/*`.
//
// Keep these narrow on purpose — the IAM backend (`hanzoai/iam`)
// returns plenty of additional fields we don't decode here.

export interface ApiResult<T = unknown> {
  status: 'ok' | 'error'
  msg?: string
  data?: T
  // Extra fields backend may set: `data2` for total counts, `code`
  // for typed errors, etc. We don't surface them to TypeScript but
  // the network layer doesn't strip them.
}

// Application — minimal subset for branding the auth pages. Mirrors
// `iam/system/types.Application` but kept local here so the auth
// barrel doesn't depend on the system bucket.
export interface AuthApplication {
  owner: string
  name: string
  displayName?: string
  organization?: string
  logo?: string
  enablePassword?: boolean
  enableSignUp?: boolean
  enableCodeSignin?: boolean
  signupItems?: AuthSignupItem[]
  providers?: Array<{
    name: string
    rule?: 'Always' | 'Dynamic' | 'None'
    provider?: { owner: string; name: string; type: string; category: string }
  }>
}

export interface AuthSignupItem {
  name: string
  label?: string
  visible?: boolean
  required?: boolean
  type?: 'Input' | 'Single Choice' | 'Multiple Choices'
  placeholder?: string
  regex?: string
  options?: string[]
}

// LoginPayload — the canonical body of POST /v1/iam/login. The
// `csrfToken` field is the value of the `csrf_token` cookie echoed
// back so the server can confirm same-origin. Empty `password`
// signals a passwordless flow (verification code or MFA-only).
export interface LoginPayload {
  application: string
  organization: string
  username: string
  password?: string
  code?: string
  signinMethod: 'Password' | 'Verification code' | 'WebAuthn'
  language?: string
  csrfToken?: string
  captchaType?: string
  captchaToken?: string
  // Echoed back from a captcha challenge response.
  clientSecret?: string
}

export interface SignupPayload {
  application: string
  organization: string
  username: string
  password: string
  email?: string
  phone?: string
  countryCode?: string
  invitationCode?: string
  language?: string
  csrfToken?: string
  captchaType?: string
  captchaToken?: string
  // Anything from the dynamic signup items.
  extra?: Record<string, string | string[]>
}

export interface ForgetPayload {
  application: string
  organization: string
  username: string
  newPassword: string
  code: string
  // 'email' or 'phone' — which channel the user verified through.
  verifyType: 'email' | 'phone'
  csrfToken?: string
  captchaType?: string
  captchaToken?: string
}

// MfaSetupPayload — POSTed to /v1/iam/mfa/setup/initiate to begin
// enrolment. The response includes a TOTP `secret`, an `otpauth://`
// `url`, and optionally a `qrCodeDataUrl` (base64 PNG/SVG).
export interface MfaSetupPayload {
  mfaType: 'app' | 'sms' | 'email'
}

export interface MfaProps {
  mfaType: 'app' | 'sms' | 'email'
  secret?: string
  url?: string
  qrCodeDataUrl?: string
  recoveryCodes?: string[]
  dest?: string
  countryCode?: string
  mfaRememberInHours?: number
}

export interface MfaVerifyPayload {
  mfaType: 'app' | 'sms' | 'email' | 'recovery'
  passcode: string
  enableMfaRemember?: boolean
  csrfToken?: string
}

// CaptchaProps — abstract config for the captcha widget. The host
// app supplies a renderer; this package never imports a captcha SDK
// directly so callers can pick reCAPTCHA, Turnstile, hCaptcha, or
// the upstream "Default" captcha image.
export interface CaptchaConfig {
  type: 'reCAPTCHA' | 'Cloudflare Turnstile' | 'hCaptcha' | 'Default' | 'none'
  siteKey?: string
  // For 'Default' captcha — image URL the backend renders.
  imageUrl?: string
}
