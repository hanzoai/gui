/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
export type DisplayMetrics = {
    fontScale: number;
    height: number;
    scale: number;
    width: number;
};
type DimensionsValue = {
    window: DisplayMetrics;
    screen: DisplayMetrics;
};
type DimensionKey = 'window' | 'screen';
type DimensionEventListenerType = 'change';
export declare class Dimensions {
    static get(dimension: DimensionKey): DisplayMetrics;
    static set(initialDimensions: DimensionsValue | null): void;
    static addEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): {
        remove: () => void;
    };
    static removeEventListener(type: DimensionEventListenerType, handler: (dimensionsValue: DimensionsValue) => void): void;
}
export default Dimensions;
