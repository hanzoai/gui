export default FillRateHelper;
/**
 * A helper class for detecting when the maximem fill rate of `VirtualizedList` is exceeded.
 * By default the sampling rate is set to zero and this will do nothing. If you want to collect
 * samples (e.g. to log them), make sure to call `FillRateHelper.setSampleRate(0.0-1.0)`.
 *
 * Listeners and sample rate are global for all `VirtualizedList`s - typical usage will combine with
 * `SceneTracker.getActiveScene` to determine the context of the events.
 */
export class FillRateHelper {
    static addListener(callback: any): {
        remove: () => void;
    };
    static setSampleRate(sampleRate: any): void;
    static setMinSampleCount(minSampleCount: any): void;
    constructor(getFrameMetrics: any);
    _anyBlankStartTime: any;
    _enabled: boolean;
    _getFrameMetrics: any;
    _info: Info;
    _mostlyBlankStartTime: any;
    _samplesStartTime: any;
    activate(): void;
    deactivateAndFlush(): void;
    computeBlankness(props: any, cellsAroundViewport: any, scrollMetrics: any): number;
    enabled(): boolean;
    _resetData(): void;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */
declare class Info {
    any_blank_count: number;
    any_blank_ms: number;
    any_blank_speed_sum: number;
    mostly_blank_count: number;
    mostly_blank_ms: number;
    pixels_blank: number;
    pixels_sampled: number;
    pixels_scrolled: number;
    total_time_spent: number;
    sample_count: number;
}
