import { isWeb } from '@hanzo/gui-constants'
import { MISSING_THEME_MESSAGE } from './constants/constants'
import type {
  AnimationDriver,
  ConfigListener,
  GenericGuiSettings,
  GuiInternalConfig,
  Token,
  Tokens,
  TokensMerged,
} from './types'

let conf: GuiInternalConfig | null
let setConfigCalledByThisInstance = false

const haventCalledErrorMessage =
  process.env.NODE_ENV === 'development'
    ? `
Haven't called createGui yet. ${MISSING_THEME_MESSAGE}
`
    : `❌ Error 001`

// helper to get config from module-scoped variable or globalthis fallback
// this handles vite ssr bundling where multiple copies of hanzo-gui may exist
const getConfigFromGlobalOrLocal = (): GuiInternalConfig | null => {
  if (conf) {
    return conf
  }

  // fall back to globalthis (for vite ssr bundling scenarios)
  if (globalThis.__guiConfig) {
    // defer warning - if createGui runs in THIS instance, it's HMR (safe)
    // if it never runs, it's a true duplicate (warn)
    if (
      process.env.NODE_ENV === 'development' &&
      !globalThis.__guiHasWarnedGlobalFallback &&
      !globalThis.__guiPendingCheck
    ) {
      globalThis.__guiPendingCheck = true
      setTimeout(() => {
        if (
          !setConfigCalledByThisInstance &&
          !globalThis.__guiHasWarnedGlobalFallback
        ) {
          globalThis.__guiHasWarnedGlobalFallback = true
          console.warn(
            `⚠️⚠️⚠️⚠️⚠️

Hanzo GUI: Using global config fallback. This may indicate duplicate gui instances (e.g., from Vite SSR bundling). This is handled automatically, but likely causes issues!

⚠️⚠️⚠️⚠️⚠️`
          )
        }
        globalThis.__guiPendingCheck = false
      }, 500)
    }
    return globalThis.__guiConfig
  }

  return null
}

export const getSetting = <Key extends keyof GenericGuiSettings>(
  key: Key
): GenericGuiSettings[Key] => {
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  return (
    config!.settings[key] ??
    // @ts-expect-error
    config[key]
  )
}

export const setConfig = (next: GuiInternalConfig) => {
  setConfigCalledByThisInstance = true
  conf = next
  globalThis.__guiConfig = next
}

export const setConfigFont = (name: string, font: any, fontParsed: any) => {
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  config!.fonts[name] = font
  config!.fontsParsed[`$${name}`] = fontParsed
}

export const getConfig = () => {
  const config = getConfigFromGlobalOrLocal()
  if (!config) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? `Missing gui config, you either have a duplicate config, or haven't set it up. Be sure createGui is called before rendering. Also, make sure all of your hanzo-gui dependencies are on the same version (\`gui\`, \`@hanzo/gui-package-name\`, etc.) not just in your package.json, but in your lockfile.`
        : 'Err0'
    )
  }
  return config
}

export const getConfigMaybe = () => {
  return getConfigFromGlobalOrLocal()
}

let tokensMerged: TokensMerged
export function setTokens(_: TokensMerged) {
  tokensMerged = _
}

export const getTokens = ({
  prefixed,
}: {
  /**
   * Force either with $ or without $ prefix
   */
  prefixed?: boolean
} = {}): TokensMerged => {
  const config = getConfigFromGlobalOrLocal()
  if (process.env.NODE_ENV === 'development') {
    if (!config) throw new Error(haventCalledErrorMessage)
  }
  const { tokens, tokensParsed } = config!
  if (prefixed === false) return tokens as any
  if (prefixed === true) return tokensParsed as any
  return tokensMerged
}

export const getTokenObject = (value: Token, group?: keyof Tokens) => {
  const config = getConfigFromGlobalOrLocal()
  return (
    config!.specificTokens[value] ??
    (group
      ? tokensMerged[group]?.[value]
      : tokensMerged[
          Object.keys(tokensMerged).find((cat) => tokensMerged[cat][value]) || ''
        ]?.[value])
  )
}

export const getToken = (value: Token, group?: keyof Tokens, useVariable = isWeb) => {
  const token = getTokenObject(value, group)
  return useVariable ? token?.variable : token?.val
}

export const getTokenValue = (value: Token | 'unset' | 'auto', group?: keyof Tokens) => {
  if (value === 'unset' || value === 'auto') return
  return getToken(value, group, false)
}

/**
 * Note: this is the same as `getTokens`
 */
export const useTokens = getTokens

export const getThemes = () => getConfigFromGlobalOrLocal()!.themes

export const updateConfig = (key: string, value: any) => {
  // for usage internally only
  const config = getConfigFromGlobalOrLocal()
  Object.assign(config![key], value)
}

// searches by value name or token name
export const getFont = (name: string) => {
  const conf = getConfig()
  return (
    conf.fontsParsed[name] ??
    Object.entries(conf.fontsParsed).find(
      ([k]) => conf.fontsParsed[k]?.family?.['val'] === name
    )?.[1]
  )
}

type DevConfig = {
  visualizer?:
    | boolean
    | {
        key?: string
        delay?: number
      }
}

export let devConfig: DevConfig | undefined

export function setupDev(conf: DevConfig) {
  if (process.env.NODE_ENV === 'development') {
    devConfig = conf
  }
}

/**
 * Dynamically load an animation driver at runtime.
 * Useful for lazy loading heavier animation drivers after initial page load.
 *
 * @example
 * ```tsx
 * // import loadAnimationDriver from gui
 * // import createAnimations from your preferred driver (e.g. animations-reanimated)
 *
 * const driver = createAnimations({ bouncy: { type: 'spring', damping: 10 } })
 * loadAnimationDriver('spring', driver)
 * ```
 */
export function loadAnimationDriver(name: string, driver: AnimationDriver) {
  const config = getConfigFromGlobalOrLocal()
  if (!config) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('loadAnimationDriver called before createGui')
    }
    return
  }

  // Convert single driver to object format if needed
  if (config.animations && !('default' in config.animations)) {
    ;(config as any).animations = {
      default: config.animations,
    }
  }

  // Add the new driver
  if (config.animations) {
    ;(config.animations as Record<string, any>)[name] = driver
  } else {
    ;(config as any).animations = {
      default: driver,
      [name]: driver,
    }
  }
}
