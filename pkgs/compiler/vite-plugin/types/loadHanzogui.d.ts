import type { HanzoguiOptions } from '@hanzogui/types';
export declare function getHanzoguiOptions(): HanzoguiOptions | null;
export declare function getLoadPromise(): Promise<HanzoguiOptions> | null;
/**
 * Load just the hanzogui.build.ts config (lightweight)
 * This doesn't bundle the full hanzogui config - call ensureFullConfigLoaded() for that
 */
export declare function loadHanzoguiBuildConfig(optionsIn?: Partial<HanzoguiOptions>): Promise<HanzoguiOptions>;
/**
 * Ensure the full hanzogui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export declare function ensureFullConfigLoaded(): Promise<void>;
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadHanzogui.d.ts.map