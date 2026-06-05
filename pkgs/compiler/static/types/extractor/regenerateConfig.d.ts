import type { GuiOptions } from '@hanzogui/types';
import type { BundledConfig } from './bundleConfig';
/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */
export declare function regenerateConfig(guiOptions: GuiOptions, configIn?: BundledConfig | null, rebuild?: boolean): Promise<void>;
export declare function regenerateConfigSync(_guiOptions: GuiOptions, config: BundledConfig): void;
export declare function generateGuiThemes(guiOptions: GuiOptions, force?: boolean): Promise<boolean | undefined>;
//# sourceMappingURL=regenerateConfig.d.ts.map