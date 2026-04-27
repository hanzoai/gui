// Barrel for the IAM system bucket — admin-facing pages and
// runtime helpers. End-user auth flows live one level up at
// `@hanzogui/admin/auth`.
//
// Note: shared envelope types (`ListResponse`, `ItemResponse`,
// `ActionResponse`) are re-exported from `iam/resources` to avoid
// duplicate exports through the iam barrel; type aliases in this
// bucket are namespaced (`SystemApplication`, `SystemMfaProps`)
// for the same reason — both shapes overlap with the auth bucket
// and we want exactly one canonical definition per public name.

export {
  DefaultApplication,
  ThemeDefault,
  InitThemeAlgorithm,
  MaxItemsForFlatMenu,
  getConf,
  setConfig,
  initConfigFromCookie,
} from './Conf'
export { EntryPage, type EntryAccount, type EntryPageProps } from './EntryPage'
export { LoginShowcase, type LoginShowcaseProps } from './LoginShowcase'
export { ManagementPage, type ManagementPageProps } from './ManagementPage'
export { Setting, type SettingPreferences, type SettingProps } from './Setting'
export { SystemInfo, type SystemInfoProps } from './SystemInfo'
export {
  type Application as SystemApplication,
  type CaptchaKind,
  type MfaProps as SystemMfaProps,
  type PrometheusInfo,
  type RuntimeConfig,
  type SignupItem as SystemSignupItem,
  type SystemInfo as SystemInfoData,
  type VersionInfo,
} from './types'
export {
  getFriendlyFileSize,
  getProgressColor,
  readRuntimeConfigCookie,
} from './util'

// Re-export module reference for callers that want the namespace
// shape upstream has (`import * as Conf`).
import * as Conf from './Conf'
export { Conf }
