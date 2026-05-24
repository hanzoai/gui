import type { StaticConfig } from './types';
export declare function getReactNativeConfig(Component: any): Partial<StaticConfig> | {
    isReactNative: true;
} | null | undefined;
