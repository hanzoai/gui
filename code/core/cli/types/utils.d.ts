import type { GuiOptions, GuiProjectInfo } from '@hanzogui/static';
import type { CLIResolvedOptions, CLIUserOptions } from '@hanzogui/types';
export declare function getOptions({ root, tsconfigPath, guiOptions, host, debug, loadGuiOptions, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function ensure(condition: boolean, message: string): void;
export declare const loadGui: (opts: Partial<GuiOptions>) => Promise<GuiProjectInfo | null>;
export declare function registerDispose(cb: () => void): void;
export declare function disposeAll(): void;
//# sourceMappingURL=utils.d.ts.map