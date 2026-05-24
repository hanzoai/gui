/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type { DisplayMetrics } from '../Dimensions/index';
export declare const DeviceInfo: {
    Dimensions: {
        readonly windowPhysicalPixels: DisplayMetrics;
        readonly screenPhysicalPixels: DisplayMetrics;
    };
    readonly locale: string | void;
    readonly totalMemory: number | void;
    readonly userAgent: string;
};
