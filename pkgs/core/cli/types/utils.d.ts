import type { HanzoguiOptions, HanzoguiProjectInfo } from '@hanzogui/static';
import type { CLIResolvedOptions, CLIUserOptions } from '@hanzogui/types';
export declare function getOptions({ root, tsconfigPath, hanzoguiOptions, host, debug, loadHanzoguiOptions, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function ensure(condition: boolean, message: string): void;
export declare const loadHanzogui: (opts: Partial<HanzoguiOptions>) => Promise<HanzoguiProjectInfo | null>;
export declare function registerDispose(cb: () => void): void;
export declare function disposeAll(): void;
//# sourceMappingURL=utils.d.ts.map