/**
 * @hanzogui/static-worker
 *
 * Pure worker-based API for Hanzogui static extraction.
 * All operations run in a worker thread for better performance and isolation.
 *
 * This package provides a clean async API that wraps @hanzogui/static's worker
 * implementation without exposing any sync/legacy APIs.
 */
import type { HanzoguiOptions } from '@hanzogui/types';
export type { ExtractedResponse, HanzoguiProjectInfo } from '@hanzogui/static';
export type { HanzoguiOptions } from '@hanzogui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => Promise<{
    shouldPrintDebug: boolean | "verbose";
    shouldDisable: boolean;
}>;
/**
 * Load Hanzogui configuration in worker
 * Sends a warmup task to trigger config loading
 * bundleConfig auto-detects if files exist and skips rebuild
 */
export declare function loadHanzogui(options: Partial<HanzoguiOptions>): Promise<any>;
/**
 * Load Hanzogui build configuration asynchronously
 * Uses esbuild-wasm to avoid EPIPE errors from native esbuild service lifecycle
 */
export declare function loadHanzoguiBuildConfig(hanzoguiOptions: Partial<HanzoguiOptions> | undefined): Promise<HanzoguiOptions>;
/**
 * Extract Hanzogui components to className-based CSS for web
 */
export declare function extractToClassNames(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: HanzoguiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): Promise<any>;
/**
 * Extract Hanzogui components to React Native StyleSheet format
 */
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: HanzoguiOptions): Promise<any>;
/**
 * Watch Hanzogui config for changes and reload when it changes
 */
export declare function watchHanzoguiConfig(options: HanzoguiOptions): Promise<{
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