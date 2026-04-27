import type { HanzoguiOptions } from '@hanzogui/types';
import type { Compiler, RuleSetRule } from 'webpack';
export type PluginOptions = HanzoguiOptions & {
    isServer?: boolean;
    exclude?: RuleSetRule['exclude'];
    test?: RuleSetRule['test'];
    jsLoader?: any;
    disableEsbuildLoader?: boolean;
    disableModuleJSXEntry?: boolean;
    disableWatchConfig?: boolean;
    disableAliases?: boolean;
    useHanzoguiSVG?: boolean;
};
export declare class HanzoguiPlugin {
    options: PluginOptions;
    pluginName: string;
    constructor(options?: PluginOptions);
    safeResolves: (resolves: [string, string][], multiple?: boolean) => string[][];
    get componentsFullPaths(): string[][];
    get componentsBaseDirs(): string[];
    isInComponentModule: (fullPath: string) => boolean;
    get defaultAliases(): any;
    apply(compiler: Compiler): void;
}
//# sourceMappingURL=HanzoguiPlugin.d.ts.map