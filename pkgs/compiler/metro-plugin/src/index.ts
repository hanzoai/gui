import { loadHanzoguiBuildConfigSync, type HanzoguiOptions } from '@hanzogui/static'

export type MetroHanzoguiOptions = HanzoguiOptions & {
  /**
   * @deprecated CSS interop is no longer supported. Use `hanzogui generate` instead.
   */
  cssInterop?: boolean
}

// Use a loose type for metro config to avoid version-specific type incompatibilities
type MetroConfigInput = {
  resolver?: any
  transformer?: any
  transformerPath?: string
  [key: string]: any
}

/**
 * Configure Metro for Hanzogui.
 *
 * This is now a simplified wrapper that just ensures CSS is enabled and
 * loads your Hanzogui config. For CSS generation, use the CLI:
 *
 * 1. Create a `hanzogui.build.ts` with `outputCSS` option
 * 2. Run `hanzogui generate` before your build
 * 3. Import the generated CSS in your app's layout
 *
 * @example
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config')
 * const { withHanzogui } = require('@hanzogui/metro-plugin')
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
 * module.exports = withHanzogui(config, {
 *   components: ['hanzogui'],
 *   config: './hanzogui.config.ts',
 * })
 * ```
 */
export function withHanzogui(
  metroConfig: MetroConfigInput,
  optionsIn?: MetroHanzoguiOptions
): MetroConfigInput {
  const { cssInterop, ...hanzoguiOptionsIn } = optionsIn || {}

  if (cssInterop) {
    console.warn(
      '[@hanzogui/metro-plugin] cssInterop option is deprecated. Use `hanzogui generate` to pre-generate CSS instead.'
    )
  }

  const options = {
    ...hanzoguiOptionsIn,
    ...loadHanzoguiBuildConfigSync(hanzoguiOptionsIn),
  }

  // Ensure CSS files can be resolved
  metroConfig.resolver = {
    ...(metroConfig.resolver as any),
    sourceExts: [...new Set([...(metroConfig.resolver?.sourceExts || []), 'css'])],
  }

  // Store hanzogui options for potential use by other tools
  metroConfig.transformer = {
    ...metroConfig.transformer,
    hanzogui: options,
  }

  return metroConfig
}
