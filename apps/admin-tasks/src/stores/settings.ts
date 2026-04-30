// useSettings — single read of /v1/tasks/settings cached for the
// session via the @hanzogui/admin useFetch SWR layer (URL-keyed).
// Capability flags drive UI gating. Missing flags mean "feature
// available" so backends predating the capability bit do not get
// over-disabled.

import { useFetch } from '@hanzogui/admin'
import { SettingsApi, type Settings } from '../lib/api'

export interface UseSettingsResult {
  settings: Settings | undefined
  loading: boolean
  error: Error | undefined
}

export function useSettings(): UseSettingsResult {
  const { data, error, isLoading } = useFetch<Settings>(SettingsApi.getUrl())
  return { settings: data, loading: isLoading, error: error as Error | undefined }
}

// Convenience predicates — all default to "available" when settings
// are still loading or the engine has not surfaced the bit yet.

export function canWriteNamespace(s: Settings | undefined): boolean {
  return !s?.namespaceWriteDisabled
}

export function canAddSearchAttribute(s: Settings | undefined): boolean {
  return s?.advancedVisibilityEnabled !== false
}

export function workerHeartbeatsEnabled(s: Settings | undefined): boolean {
  return s?.workerHeartbeatsEnabled !== false
}

export function archivalEnabled(s: Settings | undefined): boolean {
  return s?.archivalEnabled !== false
}

export function workerStopSupported(s: Settings | undefined): boolean {
  return s?.workerStopSupported === true
}
