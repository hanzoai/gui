import type { HanzoguiOptions } from '@hanzogui/types';
import type { BundledConfig } from './bundleConfig';
/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */
export declare function regenerateConfig(hanzoguiOptions: HanzoguiOptions, configIn?: BundledConfig | null, rebuild?: boolean): Promise<void>;
export declare function regenerateConfigSync(_hanzoguiOptions: HanzoguiOptions, config: BundledConfig): void;
export declare function generateHanzoguiThemes(hanzoguiOptions: HanzoguiOptions, force?: boolean): Promise<boolean | undefined>;
//# sourceMappingURL=regenerateConfig.d.ts.map