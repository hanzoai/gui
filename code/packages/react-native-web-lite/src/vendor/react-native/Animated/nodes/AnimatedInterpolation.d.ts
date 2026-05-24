export default AnimatedInterpolation;
export class AnimatedInterpolation extends AnimatedWithChildren {
    static __createInterpolation: typeof createInterpolation;
    constructor(parent: any, config: any);
    _parent: any;
    _config: any;
    _interpolation: (input: any) => any;
    __getValue(): any;
    interpolate(config: any): AnimatedInterpolation;
    __transformDataType(range: any): any;
    __getNativeConfig(): {
        inputRange: any;
        outputRange: any;
        extrapolateLeft: any;
        extrapolateRight: any;
        type: string;
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
/**
 * Very handy helper to map input ranges to output ranges with an easing
 * function and custom behavior outside of the ranges.
 */
declare function createInterpolation(config: any): (input: any) => any;
