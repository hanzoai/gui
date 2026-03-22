import type { CLIResolvedOptions, CLIUserOptions, GuiOptions } from '@hanzo/gui-types';
import { type GuiProjectInfo } from './bundleConfig';
export declare function loadGui(propsIn: Partial<GuiOptions>): Promise<GuiProjectInfo | null>;
export declare const generateThemesAndLog: (options: GuiOptions, force?: boolean) => Promise<void>;
/**
 * Load gui.build.ts config using esbuild-wasm transform
 * Uses WASM to avoid native esbuild service lifecycle issues (EPIPE errors)
 */
export declare function loadGuiBuildConfigAsync(guiOptions: Partial<GuiOptions> | undefined): Promise<GuiOptions>;
/**
 * @deprecated Use loadGuiBuildConfigAsync instead to avoid EPIPE errors
 */
export declare function loadGuiBuildConfigSync(guiOptions: Partial<GuiOptions> | undefined): GuiOptions;
export declare function loadGuiSync({ forceExports, cacheKey, ...propsIn }: Partial<GuiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): GuiProjectInfo;
export declare function getOptions({ root, tsconfigPath, guiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export type { GuiProjectInfo };
export declare function esbuildWatchFiles(entry: string, onChanged: () => void): Promise<() => void>;
//# sourceMappingURL=loadGui.d.ts.map