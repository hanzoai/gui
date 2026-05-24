export default AnimatedValue;
/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 *
 * See https://reactnative.dev/docs/animatedvalue
 */
export class AnimatedValue extends AnimatedWithChildren {
    constructor(value: any, config: any);
    _value: number;
    _startingValue: number;
    _offset: number;
    _animation: any;
    _tracking: any;
    __getValue(): number;
    /**
     * Directly set the value.  This will stop any animations running on the value
     * and update all the bound properties.
     *
     * See https://reactnative.dev/docs/animatedvalue#setvalue
     */
    setValue(value: any): void;
    /**
     * Sets an offset that is applied on top of whatever value is set, whether via
     * `setValue`, an animation, or `Animated.event`.  Useful for compensating
     * things like the start of a pan gesture.
     *
     * See https://reactnative.dev/docs/animatedvalue#setoffset
     */
    setOffset(offset: any): void;
    /**
     * Merges the offset value into the base value and resets the offset to zero.
     * The final output of the value is unchanged.
     *
     * See https://reactnative.dev/docs/animatedvalue#flattenoffset
     */
    flattenOffset(): void;
    /**
     * Sets the offset value to the base value, and resets the base value to zero.
     * The final output of the value is unchanged.
     *
     * See https://reactnative.dev/docs/animatedvalue#extractoffset
     */
    extractOffset(): void;
    /**
     * Stops any running animation or tracking. `callback` is invoked with the
     * final value after stopping the animation, which is useful for updating
     * state to match the animation position with layout.
     *
     * See https://reactnative.dev/docs/animatedvalue#stopanimation
     */
    stopAnimation(callback: any): void;
    /**
     * Stops any animation and resets the value to its original.
     *
     * See https://reactnative.dev/docs/animatedvalue#resetanimation
     */
    resetAnimation(callback: any): void;
    /**
     * Interpolates the value before updating the property, e.g. mapping 0-1 to
     * 0-10.
     */
    interpolate(config: any): AnimatedInterpolation;
    /**
     * Typically only used internally, but could be used by a custom Animation
     * class.
     *
     * See https://reactnative.dev/docs/animatedvalue#animate
     */
    animate(animation: any, callback: any): void;
    /**
     * Typically only used internally.
     */
    stopTracking(): void;
    /**
     * Typically only used internally.
     */
    track(tracking: any): void;
    _updateValue(value: any, flush: any): void;
    __getNativeConfig(): {
        type: string;
        value: number;
        offset: number;
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
import { AnimatedInterpolation } from './AnimatedInterpolation';
