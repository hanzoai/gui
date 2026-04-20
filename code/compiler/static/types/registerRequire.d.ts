import type { HanzoguiPlatform } from './types';
export declare const getNameToPaths: () => {};
export declare function setRequireResult(name: string, result: any): void;
export declare function registerRequire(platform: HanzoguiPlatform, { proxyWormImports }?: {
    proxyWormImports: boolean;
}): {
    hanzoguiRequire: (this: any, path: string) => any;
    unregister: () => void;
};
//# sourceMappingURL=registerRequire.d.ts.map