// Wire types for the end-user auth surface.
//
// Login / Signup / ForgotPassword now route every network call
// through the canonical `IAM` class from `@hanzo/iam/browser`. The
// IAM SDK owns the request/response shapes (PKCE, token exchange,
// signup, OTP send, phone lookup), so we no longer carry local
// `LoginPayload` / `SignupPayload` / `ForgetPayload` types — the
// canonical method signatures on `IAM` are the contract.
//
// What remains here is the surface NOT covered by `@hanzo/iam`:
//   - `AuthApplication`   — branding metadata for the form chrome.
//   - `AuthSignupItem`    — dynamic signup-field config.
//   - `CaptchaConfig`     — pluggable captcha provider abstraction.
//   - `MfaProps`          — TOTP/SMS/email enrolment payload (the IAM
//                           class doesn't yet expose MFA setup).
//   - `MfaSetupPayload` / `MfaVerifyPayload` — local until IAM exposes
//                           dedicated MFA methods.

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

// MfaSetupPayload — POSTed to /v1/iam/mfa/setup/initiate to begin
// enrolment. The response includes a TOTP `secret`, an `otpauth://`
// `url`, and optionally a `qrCodeDataUrl` (base64 PNG/SVG).
//
// Gap: `@hanzo/iam@^0.8.0` does not expose MFA setup/verify methods
// yet. `MfaSetup` and `MfaVerify` continue to take callbacks that
// the host app wires into its own /v1/iam/mfa/* round-trips. When
// IAM grows MFA methods (planned for v0.10), these locals get
// deleted in favour of the canonical signatures.
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
