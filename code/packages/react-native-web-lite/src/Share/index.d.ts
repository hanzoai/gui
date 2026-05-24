/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
type Content = {
    title?: string;
    message?: string;
    url: string;
} | {
    title?: string;
    message: string;
    url?: string;
};
export declare class Share {
    static share(content: Content, options?: object): Promise<void>;
    /**
     * The content was successfully shared.
     */
    static get sharedAction(): string;
    /**
     * The dialog has been dismissed.
     * @platform ios
     */
    static get dismissedAction(): string;
}
export {};
