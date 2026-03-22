import { type StaticConfig, type GuiInternalConfig } from '@hanzo/gui-web';
import esbuild from 'esbuild';
import type { GuiOptions } from '../types';
type NameToPaths = {
    [key: string]: Set<string>;
};
export type LoadedComponents = {
    moduleName: string;
    nameToInfo: Record<string, {
        staticConfig: StaticConfig;
    }>;
};
export type GuiProjectInfo = {
    components?: LoadedComponents[];
    guiConfig?: GuiInternalConfig | null;
    nameToPaths?: NameToPaths;
    cached?: boolean;
};
export declare const esbuildOptions: {
    define: {
        __DEV__: string;
    };
    target: string;
    format: "cjs";
    jsx: "automatic";
    platform: "node";
};
export declare const esbuildOptionsWithPlugins: {
    plugins: esbuild.Plugin[];
    define: {
        __DEV__: string;
    };
    target: string;
    format: "cjs";
    jsx: "automatic";
    platform: "node";
};
export type BundledConfig = Exclude<Awaited<ReturnType<typeof bundleConfig>>, undefined>;
export declare function hasBundledConfigChanged(): boolean;
export declare const getLoadedConfig: () => GuiInternalConfig | null;
export declare function getBundledConfig(props: GuiOptions, rebuild?: boolean): Promise<any>;
export declare function bundleConfig(props: GuiOptions): Promise<any>;
export declare function writeGuiCSS(outputCSS: string, config: GuiInternalConfig): Promise<void>;
export declare function loadComponents(props: GuiOptions, forceExports?: boolean): Promise<LoadedComponents[]>;
export declare function loadComponentsSync(props: GuiOptions, forceExports?: boolean): LoadedComponents[];
export declare function loadComponentsInner(props: GuiOptions, forceExports?: boolean): Promise<null | LoadedComponents[]>;
export declare function loadComponentsInnerSync(props: GuiOptions, forceExports?: boolean): null | LoadedComponents[];
export {};
//# sourceMappingURL=bundleConfig.d.ts.map