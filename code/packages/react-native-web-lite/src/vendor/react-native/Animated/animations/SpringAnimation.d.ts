export default SpringAnimation;
export class SpringAnimation extends Animation {
    constructor(config: any);
    _overshootClamping: any;
    _restDisplacementThreshold: any;
    _restSpeedThreshold: any;
    _lastVelocity: any;
    _startPosition: any;
    _lastPosition: any;
    _fromValue: any;
    _toValue: any;
    _stiffness: any;
    _damping: any;
    _mass: any;
    _initialVelocity: any;
    _delay: any;
    _timeout: any;
    _startTime: any;
    _lastTime: any;
    _frameTime: any;
    _onUpdate: any;
    _animationFrame: any;
    _useNativeDriver: any;
    _platformConfig: any;
    __getNativeAnimationConfig(): {
        type: string;
        overshootClamping: any;
        restDisplacementThreshold: any;
        restSpeedThreshold: any;
        stiffness: any;
        damping: any;
        mass: any;
        initialVelocity: any;
        toValue: any;
        iterations: any;
        platformConfig: any;
    };
    getInternalState(): {
        lastPosition: any;
        lastVelocity: any;
        lastTime: any;
    };
    /**
     * This spring model is based off of a damped harmonic oscillator
     * (https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator).
     *
     * We use the closed form of the second order differential equation:
     *
     * x'' + (2ζ⍵_0)x' + ⍵^2x = 0
     *
     * where
     *    ⍵_0 = √(k / m) (undamped angular frequency of the oscillator),
     *    ζ = c / 2√mk (damping ratio),
     *    c = damping constant
     *    k = stiffness
     *    m = mass
     *
     * The derivation of the closed form is described in detail here:
     * http://planetmath.org/sites/default/files/texpdf/39745.pdf
     *
     * This algorithm happens to match the algorithm used by CASpringAnimation,
     * a QuartzCore (iOS) API that creates spring animations.
     */
    onUpdate(): void;
}
import { Animation } from './Animation';
