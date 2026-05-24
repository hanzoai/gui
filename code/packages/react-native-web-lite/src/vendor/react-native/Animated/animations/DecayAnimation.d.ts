export default DecayAnimation;
export class DecayAnimation extends Animation {
    constructor(config: any);
    _startTime: any;
    _lastValue: any;
    _fromValue: any;
    _deceleration: any;
    _velocity: any;
    _onUpdate: any;
    _animationFrame: any;
    _useNativeDriver: any;
    __getNativeAnimationConfig(): {
        type: string;
        deceleration: any;
        velocity: any;
        iterations: any;
    };
    onUpdate(): void;
}
import { Animation } from './Animation';
