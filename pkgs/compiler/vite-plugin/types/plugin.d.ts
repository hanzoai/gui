import type { GuiOptions } from '@hanzogui/static-worker';
import type { PluginOption } from 'vite';
type AliasOptions = {
    /** use @hanzogui/react-native-web-lite, 'without-animated' for smaller bundle */
    rnwLite?: boolean | 'without-animated';
    /** alias react-native-svg to @hanzogui/react-native-svg */
    svg?: boolean;
};
type AliasEntry = {
    find: string | RegExp;
    replacement: string;
};
/**
 * returns vite-compatible aliases for gui
 * use this when you need control over alias ordering in your config
 */
export declare function guiAliases(options?: AliasOptions): AliasEntry[];
export declare function guiPlugin({ disableResolveConfig, ...guiOptionsIn }?: GuiOptions & {
    disableResolveConfig?: boolean;
}): PluginOption;
export {};
//# sourceMappingURL=plugin.d.ts.map