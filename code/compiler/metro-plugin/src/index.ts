import { loadGuiBuildConfigSync, type GuiOptions } from '@hanzogui/static'

export type MetroGuiOptions = GuiOptions & {
  /**
   * @deprecated CSS interop is no longer supported. Use `gui generate` instead.
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
 * Configure Metro for Gui.
 *
 * This is now a simplified wrapper that just ensures CSS is enabled and
 * loads your Hanzo GUI config. For CSS generation, use the CLI:
 *
 * 1. Create a `gui.build.ts` with `outputCSS` option
 * 2. Run `gui generate` before your build
 * 3. Import the generated CSS in your app's layout
 *
 * @example
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config')
 * const { withGui } = require('@hanzogui/metro-plugin')
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
 * module.exports = withGui(config, {
 *   components: ['@hanzo/gui'],
 *   config: './gui.config.ts',
 * })
 * ```
 */
export function withGui(
  metroConfig: MetroConfigInput,
  optionsIn?: MetroGuiOptions
): MetroConfigInput {
  const { cssInterop, ...guiOptionsIn } = optionsIn || {}

  if (cssInterop) {
    console.warn(
      '[@hanzogui/metro-plugin] cssInterop option is deprecated. Use `gui generate` to pre-generate CSS instead.'
    )
  }

  const options = {
    ...guiOptionsIn,
    ...loadGuiBuildConfigSync(guiOptionsIn),
  }

  // Ensure CSS files can be resolved
  metroConfig.resolver = {
    ...(metroConfig.resolver as any),
    sourceExts: [...new Set([...(metroConfig.resolver?.sourceExts || []), 'css'])],
  }

  // Store hanzo-gui options for potential use by other tools
  metroConfig.transformer = {
    ...metroConfig.transformer,
    gui: options,
  }

  return metroConfig
}
