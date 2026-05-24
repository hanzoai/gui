/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { ComponentType, FunctionComponent, ReactNode } from 'react';
export declare function renderApplication<Props extends object>(RootComponent: ComponentType<Props>, WrapperComponent: FunctionComponent<any> | null, callback: () => void, options: {
    hydrate: boolean;
    initialProps: Props;
    mode: 'concurrent' | 'legacy';
    rootTag: any;
}): void;
export declare function getApplication(RootComponent: ComponentType<object>, initialProps: object, WrapperComponent?: FunctionComponent<any> | null): {
    element: ReactNode;
    getStyleElement: (object: object) => ReactNode;
};
