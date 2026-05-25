import { type StaticConfig, type HanzoguiInternalConfig } from '@hanzogui/web';
import esbuild from 'esbuild';
import type { HanzoguiOptions } from '../types';
type NameToPaths = {
    [key: string]: Set<string>;
};
export type LoadedComponents = {
    moduleName: string;
    nameToInfo: Record<string, {
        staticConfig: StaticConfig;
    }>;
};
export type HanzoguiProjectInfo = {
    components?: LoadedComponents[];
    hanzoguiConfig?: HanzoguiInternalConfig | null;
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
export declare const getLoadedConfig: () => HanzoguiInternalConfig | null;
export declare function getBundledConfig(props: HanzoguiOptions, rebuild?: boolean): Promise<any>;
export declare function bundleConfig(props: HanzoguiOptions): Promise<any>;
export declare function writeHanzoguiCSS(outputCSS: string, config: HanzoguiInternalConfig): Promise<void>;
export declare function loadComponents(props: HanzoguiOptions, forceExports?: boolean): Promise<LoadedComponents[]>;
export declare function loadComponentsSync(props: HanzoguiOptions, forceExports?: boolean): LoadedComponents[];
export declare function loadComponentsInner(props: HanzoguiOptions, forceExports?: boolean): Promise<null | LoadedComponents[]>;
export declare function loadComponentsInnerSync(props: HanzoguiOptions, forceExports?: boolean): null | LoadedComponents[];
export {};
//# sourceMappingURL=bundleConfig.d.ts.map