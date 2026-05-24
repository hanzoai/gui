/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
declare function emptyFunction(): void;
export declare const BackHandler: {
    exitApp: typeof emptyFunction;
    addEventListener(): {
        remove: () => void;
    };
    removeEventListener: typeof emptyFunction;
};
export {};
