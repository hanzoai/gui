import type { CLIResolvedOptions, CLIUserOptions, GuiOptions } from '@hanzogui/types';
import { type GuiProjectInfo } from './bundleConfig';
export declare function loadGui(propsIn: Partial<GuiOptions>): Promise<GuiProjectInfo | null>;
export declare const generateThemesAndLog: (options: GuiOptions, force?: boolean) => Promise<void>;
/**
 * Load hanzogui.build.ts config using esbuild-wasm transform
 * Uses WASM to avoid native esbuild service lifecycle issues (EPIPE errors)
 */
export declare function loadGuiBuildConfigAsync(hanzoguiOptions: Partial<GuiOptions> | undefined): Promise<GuiOptions>;
/**
 * @deprecated Use loadGuiBuildConfigAsync instead to avoid EPIPE errors
 */
export declare function loadGuiBuildConfigSync(hanzoguiOptions: Partial<GuiOptions> | undefined): GuiOptions;
export declare function loadGuiSync({ forceExports, cacheKey, ...propsIn }: Partial<GuiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): GuiProjectInfo;
export declare function getOptions({ root, tsconfigPath, hanzoguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string, platform?: string): string;
export type { GuiProjectInfo };
export declare function esbuildWatchFiles(entry: string, onChanged: () => void): Promise<() => void>;
//# sourceMappingURL=loadGui.d.ts.map