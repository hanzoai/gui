// Barrel for the IAM system bucket — admin-facing pages and
// runtime helpers. End-user auth flows live one level up at
// `@hanzogui/admin/auth`.

export { Conf as ConfModule } from './Conf'
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
  type ActionResponse,
  type Application,
  type CaptchaKind,
  type ItemResponse,
  type ListResponse,
  type MfaProps,
  type PrometheusInfo,
  type RuntimeConfig,
  type SignupItem,
  type SystemInfo as SystemInfoData,
  type VersionInfo,
} from './types'
export {
  getFriendlyFileSize,
  getProgressColor,
  readCsrfToken,
  readRuntimeConfigCookie,
} from './util'

// Re-export module reference for callers that want the namespace
// shape upstream has (`import * as Conf`).
import * as Conf from './Conf'
export { Conf }
