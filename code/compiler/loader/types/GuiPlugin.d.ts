import type { GuiOptions } from '@gui/types';
import type { Compiler, RuleSetRule } from 'webpack';
export type PluginOptions = GuiOptions & {
    isServer?: boolean;
    exclude?: RuleSetRule['exclude'];
    test?: RuleSetRule['test'];
    jsLoader?: any;
    disableEsbuildLoader?: boolean;
    disableModuleJSXEntry?: boolean;
    disableWatchConfig?: boolean;
    disableAliases?: boolean;
    useGuiSVG?: boolean;
};
export declare class GuiPlugin {
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
//# sourceMappingURL=GuiPlugin.d.ts.map