// Barrel for the end-user auth flows. These ship in any consumer
// that needs hanzo.id login (Hanzo brand, Lux, Zoo, white-label
// customers). They are NOT admin-only — the admin chrome lives in
// `@hanzogui/admin/iam`.
//
// Import shape, e.g.:
//
//   import { Login, Signup, MfaVerify } from '@hanzogui/admin/auth'
//
// Login / Signup / ForgotPassword take an `iam: IAM` prop from
// `@hanzo/iam/browser` — that class IS the auth boundary. Token
// storage, PKCE, and refresh are managed there. The components are
// purely presentational input collection; they never fetch directly.
//
// Local payload types (`LoginPayload`, `SignupPayload`, `ForgetPayload`)
// have been deleted — the canonical contract is the IAM class method
// signatures. MFA payloads remain local until `@hanzo/iam` exposes
// dedicated MFA setup/verify methods.

export { Captcha, type CaptchaProps } from './Captcha'
export { ForgotPassword, type ForgotPasswordProps } from './ForgotPassword'
export { Login, type LoginProps } from './Login'
export { MfaSetup, type MfaSetupProps } from './MfaSetup'
export { MfaVerify, type MfaVerifyProps } from './MfaVerify'
export { QrCode, type QrCodeProps } from './QrCode'
export { RecoveryCodes, type RecoveryCodesProps } from './RecoveryCodes'
export { Signup, type SignupProps } from './Signup'
export {
  type ApiResult,
  type AuthApplication,
  type AuthSignupItem,
  type CaptchaConfig,
  type MfaProps,
  type MfaSetupPayload,
  type MfaVerifyPayload,
} from './types'
export {
  isEmail,
  isPhoneShape,
  inIframe,
  maskEmail,
  maskPhone,
  scorePassword,
} from './util'
