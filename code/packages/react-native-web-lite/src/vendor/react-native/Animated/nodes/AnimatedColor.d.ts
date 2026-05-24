export default AnimatedColor;
export class AnimatedColor extends AnimatedWithChildren {
    constructor(valueIn: any, config: any);
    r: any;
    g: any;
    b: any;
    a: any;
    nativeColor: any;
    /**
     * Directly set the value. This will stop any animations running on the value
     * and update all the bound properties.
     */
    setValue(value: any): void;
    /**
     * Sets an offset that is applied on top of whatever value is set, whether
     * via `setValue`, an animation, or `Animated.event`. Useful for compensating
     * things like the start of a pan gesture.
     */
    setOffset(offset: any): void;
    /**
     * Merges the offset value into the base value and resets the offset to zero.
     * The final output of the value is unchanged.
     */
    flattenOffset(): void;
    /**
     * Sets the offset value to the base value, and resets the base value to
     * zero. The final output of the value is unchanged.
     */
    extractOffset(): void;
    stopAnimation(callback: any): void;
    resetAnimation(callback: any): void;
    interpolate(config: any): void;
    __getValue(): any;
    __getNativeConfig(): {
        type: string;
        r: any;
        g: any;
        b: any;
        a: any;
        nativeColor: any;
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
