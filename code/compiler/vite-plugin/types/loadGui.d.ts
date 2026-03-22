import type { GuiOptions } from '@gui/types';
export declare function getGuiOptions(): GuiOptions | null;
export declare function getLoadPromise(): Promise<GuiOptions> | null;
/**
 * Load just the gui.build.ts config (lightweight)
 * This doesn't bundle the full gui config - call ensureFullConfigLoaded() for that
 */
export declare function loadGuiBuildConfig(optionsIn?: Partial<GuiOptions>): Promise<GuiOptions>;
/**
 * Ensure the full gui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export declare function ensureFullConfigLoaded(): Promise<void>;
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadGui.d.ts.map