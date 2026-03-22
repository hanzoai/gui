export interface GuiBuildOptions {
    /**
     * module paths you want to compile with gui (for example ['gui'])
     * */
    components?: string[];
    /**
     * relative path to your gui.config.ts
     */
    config?: string;
    /**
     * Use the new ThemeBuilder in `@gui/create-theme` to create beautiful theme sets,
     * see docs at https://gui.hanzo.ai/docs/guides/theme-builder
     * This helps you automate generating the build themes typescript file which loads fastere
     * and has smaller bundle size.
     */
    themeBuilder?: {
        input: string;
        output: string;
    };
    /**
     * Emit design system related CSS during build step for usage with frameworks
     */
    outputCSS?: string | null | false;
    /**
     * (Experimental) outputs themes using CSS Nesting https://caniuse.com/css-nesting
     * Which can cut them in half due to no media query duplication.
     */
    useCSSNesting?: boolean;
    /**
     * Gui can follow imports and evaluate them when parsing styles, leading to
     * higher percent of flattened / optimized views. We normalize this to be the
     * full path of the file, always ending in ".js".
     *
     * So to have Gui partially evaluate "app/src/constants.tsx" you can put
     * ["app/src/constants.js"].
     */
    importsWhitelist?: string[];
    /**
     * Whitelist file extensions to evaluate
     *
     * @default ['.tsx', '.jsx']
     */
    includeExtensions?: string[];
    /**
     * Web-only. Allows you to trim the bundle size of react-native-web.
     * Pass in values like ['Switch', 'Modal'].
     */
    excludeReactNativeWebExports?: string[];
    /**
     * Enable logging the time it takes to extract.
     *
     * @default true
     */
    logTimings?: boolean;
    /**
     * Custom prefix for the timing logs
     */
    prefixLogs?: string;
    /**
     * (Advanced) Enables Gui to try and evaluate components outside the `components` option.
     * When true, Gui will bundle and load components as its running across every file,
     * if it loads them successfully it will perform all optimiziations inline.
     */
    enableDynamicEvaluation?: boolean;
    /**
     * Completely disable gui for these files
     */
    disable?: boolean | string[];
    /**
     * Disable just optimization for these files, but enable helpful debug attributes.
     */
    disableExtraction?: boolean | string[];
    /**
     * Disable just the addition of data- attributes that are added in dev mode to help
     * tie DOM to your filename/component-name.
     */
    disableDebugAttr?: boolean;
    /**
     * (Advanced) Disable evaluation of useMedia() hook
     */
    disableExtractInlineMedia?: boolean;
    /**
     * (Advanced) Disable just view flattening.
     */
    disableFlattening?: boolean;
    /**
     * (Advanced) Disable extracting to theme variables.
     */
    disableExtractVariables?: boolean | 'theme';
    /**
     * (Advanced) Disables the initial build and attempts to load from the .gui directory
     */
    disableInitialBuild?: boolean;
    /**
     * If you have a gui.build.ts file that describes your compiler setup, you can set it here
     */
    buildFile?: string;
    evaluateVars?: boolean;
    cssPath?: string;
    cssData?: any;
    deoptProps?: Set<string>;
    excludeProps?: Set<string>;
    inlineProps?: Set<string>;
    /**
     * Use react-native-web-lite for better tree shaking on web.
     * Set to 'without-animated' to exclude animated components.
     */
    useReactNativeWebLite?: boolean | 'without-animated';
    disableWatchGuiConfig?: boolean;
    /**
     * (Experimental) Flatten theme access on native for better performance
     */
    experimentalFlattenThemesOnNative?: boolean;
}
export interface GuiOptions extends GuiBuildOptions {
    platform?: 'native' | 'web';
}
export type CLIUserOptions = {
    root?: string;
    host?: string;
    tsconfigPath?: string;
    guiOptions: Partial<GuiOptions>;
    debug?: boolean | 'verbose';
    loadGuiOptions?: boolean;
};
export type CLIResolvedOptions = {
    root: string;
    port?: number;
    host?: string;
    mode: 'development' | 'production';
    debug?: CLIUserOptions['debug'];
    tsconfigPath: string;
    guiOptions: GuiOptions;
    pkgJson: {
        name?: string;
        main?: string;
        module?: string;
        source?: string;
        exports?: Record<string, Record<string, string>>;
    };
    paths: {
        root: string;
        dotDir: string;
        conf: string;
        types: string;
    };
};
//# sourceMappingURL=types.d.ts.map