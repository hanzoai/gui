import type { GuiPlatform } from './types';
export declare const getNameToPaths: () => {};
export declare function setRequireResult(name: string, result: any): void;
export declare function registerRequire(platform: GuiPlatform, { proxyWormImports }?: {
    proxyWormImports: boolean;
}): {
    guiRequire: (this: any, path: string) => any;
    unregister: () => void;
};
//# sourceMappingURL=registerRequire.d.ts.map