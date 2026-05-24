/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
export declare class AppState {
    static isAvailable: any;
    static get currentState(): string;
    static addEventListener(type: string, handler: Function): void;
}
