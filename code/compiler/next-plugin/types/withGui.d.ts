import type { PluginOptions as LoaderPluginOptions } from '@hanzogui/loader';
export type WithGuiProps = LoaderPluginOptions & {
    appDir?: boolean;
    enableLegacyFontSupport?: boolean;
    includeCSSTest?: RegExp | ((path: string) => boolean);
    /**
     * By default, we configure webpack to pass anything inside your root or design system
     * to the GUI loader. If you are importing files from an external package, use this
     **/
    shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
    /**
     * *Advaned* Config to avoid resolving files on the server.
     */
    shouldExcludeFromServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
    disableThemesBundleOptimize?: boolean;
    /** By default we add a Next.js modularizeImports option to tree shake @hanzogui/lucide-icons-2, this disables it */
    disableOptimizeLucideIcons?: boolean;
};
export declare const withGui: (guiOptionsIn?: WithGuiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withGui.d.ts.map