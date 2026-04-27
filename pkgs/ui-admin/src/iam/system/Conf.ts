// Frontend runtime config — module-level state populated from the
// `jsonWebConfig` cookie on first load. Mirrors
// `~/work/hanzo/iam/web/src/Conf.tsx`.
//
// The cookie is set by the backend at first GET. We do NOT mutate
// it from the client; it's a one-way channel. Any field the cookie
// omits keeps its compile-time default below.

import type { RuntimeConfig } from './types'
import { readRuntimeConfigCookie } from './util'

export const DefaultApplication =
  (typeof import.meta !== 'undefined' && (import.meta as never as { env?: Record<string, string> }).env?.VITE_DEFAULT_APP) ||
  'app-built-in'

export const ThemeDefault = {
  themeType: 'dark' as const,
  colorPrimary: '#ffffff',
  borderRadius: 6,
  isCompact: false,
}

export const InitThemeAlgorithm = true
export const MaxItemsForFlatMenu = 7

interface MutableConf {
  ShowGithubCorner: boolean
  IsDemoMode: boolean
  ForceLanguage: string
  DefaultLanguage: string
  StaticBaseUrl: string
  AiAssistantUrl: string
}

const state: MutableConf = {
  ShowGithubCorner: false,
  IsDemoMode: false,
  ForceLanguage: '',
  DefaultLanguage: 'en',
  StaticBaseUrl: '',
  AiAssistantUrl: '',
}

export function getConf(): Readonly<MutableConf> {
  return state
}

export function setConfig(config: RuntimeConfig | null | undefined): void {
  if (!config) return
  if (config.showGithubCorner !== undefined) state.ShowGithubCorner = config.showGithubCorner
  if (config.isDemoMode !== undefined) state.IsDemoMode = config.isDemoMode
  if (config.forceLanguage !== undefined) state.ForceLanguage = config.forceLanguage
  if (config.defaultLanguage !== undefined) state.DefaultLanguage = config.defaultLanguage
  if (config.staticBaseUrl !== undefined) state.StaticBaseUrl = config.staticBaseUrl
  if (config.aiAssistantUrl !== undefined) state.AiAssistantUrl = config.aiAssistantUrl
}

export function initConfigFromCookie(): void {
  const parsed = readRuntimeConfigCookie()
  if (parsed && typeof parsed === 'object') setConfig(parsed as RuntimeConfig)
}
