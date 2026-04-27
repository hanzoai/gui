// Barrel for the end-user auth flows. These ship in any consumer
// that needs hanzo.id login (Hanzo brand, Lux, Zoo, white-label
// customers). They are NOT admin-only — the admin chrome lives in
// `@hanzogui/admin/iam`.
//
// Import shape, e.g.:
//
//   import { Login, Signup, MfaVerify } from '@hanzogui/admin/auth'
//
// The components are framework-router-agnostic. Every flow takes a
// callback for navigation and a callback for the network call;
// nothing imports react-router-dom or fetch directly.

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
  type ForgetPayload,
  type LoginPayload,
  type MfaProps,
  type MfaSetupPayload,
  type MfaVerifyPayload,
  type SignupPayload,
} from './types'
export { isEmail, isPhoneShape, inIframe, readCsrfToken, scorePassword } from './util'
