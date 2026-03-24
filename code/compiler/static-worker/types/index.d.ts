/**
 * @hanzogui/static-worker
 *
 * Pure worker-based API for Hanzo GUI static extraction.
 * All operations run in a worker thread for better performance and isolation.
 *
 * This package provides a clean async API that wraps @hanzogui/static's worker
 * implementation without exposing any sync/legacy APIs.
 */
import type { GuiOptions } from '@hanzogui/types';
export type { ExtractedResponse, GuiProjectInfo } from '@hanzogui/static';
export type { GuiOptions } from '@hanzogui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => Promise<{
    shouldPrintDebug: boolean | "verbose";
    shouldDisable: boolean;
}>;
/**
 * Load Hanzo GUI configuration in worker
 * Sends a warmup task to trigger config loading
 * bundleConfig auto-detects if files exist and skips rebuild
 */
export declare function loadGui(options: Partial<GuiOptions>): Promise<any>;
/**
 * Load Hanzo GUI build configuration asynchronously
 * Uses esbuild-wasm to avoid EPIPE errors from native esbuild service lifecycle
 */
export declare function loadGuiBuildConfig(guiOptions: Partial<GuiOptions> | undefined): Promise<GuiOptions>;
/**
 * Extract Hanzo GUI components to className-based CSS for web
 */
export declare function extractToClassNames(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: GuiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): Promise<any>;
/**
 * Extract Hanzo GUI components to React Native StyleSheet format
 */
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: GuiOptions): Promise<any>;
/**
 * Watch Hanzo GUI config for changes and reload when it changes
 */
export declare function watchGuiConfig(options: GuiOptions): Promise<{
    dispose: () => void;
} | undefined>;
/**
 * Clear the worker's config cache
 * Call this when config files change
 */
export declare function clearWorkerCache(): Promise<void>;
/**
 * Clean up the worker pool on exit
 * Should be called when the build process completes
 */
export declare function destroyPool(): Promise<void>;
/**
 * Get pool statistics for debugging
 */
export declare function getPoolStats(): {
    threads: number;
    queueSize: number;
    completed: number;
    duration: number;
    utilization: number;
} | null;
//# sourceMappingURL=index.d.ts.map