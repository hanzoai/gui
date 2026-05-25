import type { CLIResolvedOptions, CLIUserOptions, HanzoguiOptions } from '@hanzogui/types';
import { type HanzoguiProjectInfo } from './bundleConfig';
export declare function loadHanzogui(propsIn: Partial<HanzoguiOptions>): Promise<HanzoguiProjectInfo | null>;
export declare const generateThemesAndLog: (options: HanzoguiOptions, force?: boolean) => Promise<void>;
/**
 * Load hanzogui.build.ts config using esbuild-wasm transform
 * Uses WASM to avoid native esbuild service lifecycle issues (EPIPE errors)
 */
export declare function loadHanzoguiBuildConfigAsync(hanzoguiOptions: Partial<HanzoguiOptions> | undefined): Promise<HanzoguiOptions>;
/**
 * @deprecated Use loadHanzoguiBuildConfigAsync instead to avoid EPIPE errors
 */
export declare function loadHanzoguiBuildConfigSync(hanzoguiOptions: Partial<HanzoguiOptions> | undefined): HanzoguiOptions;
export declare function loadHanzoguiSync({ forceExports, cacheKey, ...propsIn }: Partial<HanzoguiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): HanzoguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, hanzoguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export type { HanzoguiProjectInfo };
export declare function esbuildWatchFiles(entry: string, onChanged: () => void): Promise<() => void>;
//# sourceMappingURL=loadHanzogui.d.ts.map