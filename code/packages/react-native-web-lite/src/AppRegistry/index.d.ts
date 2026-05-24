/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { ComponentType, ReactNode } from 'react';
type AppParams = object;
export type ComponentProvider = () => ComponentType<any>;
export type ComponentProviderInstrumentationHook = (component: ComponentProvider) => ComponentType<any>;
export type WrapperComponentProvider = (arg0: any) => ComponentType<unknown>;
export type AppConfig = {
    appKey: string;
    component?: ComponentProvider;
    run?: Function;
    section?: boolean;
};
/**
 * `AppRegistry` is the JS entry point to running all React Native apps.
 */
export declare class AppRegistry {
    static getAppKeys(): Array<string>;
    static getApplication(appKey: string, appParameters?: AppParams): {
        element: ReactNode;
        getStyleElement: (arg0: any) => ReactNode;
    };
    static registerComponent(appKey: string, componentProvider: ComponentProvider): string;
    static registerConfig(config: Array<AppConfig>): void;
    static registerRunnable(appKey: string, run: Function): string;
    static runApplication(appKey: string, appParameters: Record<string, any>): void;
    static setComponentProviderInstrumentationHook(hook: ComponentProviderInstrumentationHook): void;
    static setWrapperComponentProvider(provider: WrapperComponentProvider): void;
    static unmountApplicationComponentAtRootTag(rootTag: any): void;
}
export {};
