import { type GuiOptions } from '@hanzo/gui-static';
export type MetroGuiOptions = GuiOptions & {
    /**
     * @deprecated CSS interop is no longer supported. Use `gui generate` instead.
     */
    cssInterop?: boolean;
};
type MetroConfigInput = {
    resolver?: any;
    transformer?: any;
    transformerPath?: string;
    [key: string]: any;
};
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
 * const { withGui } = require('@hanzo/gui-metro-plugin')
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
 * module.exports = withGui(config, {
 *   components: ['@hanzo/gui'],
 *   config: './gui.config.ts',
 * })
 * ```
 */
export declare function withGui(metroConfig: MetroConfigInput, optionsIn?: MetroGuiOptions): MetroConfigInput;
export {};
//# sourceMappingURL=index.d.ts.map