export default TimingAnimation;
export class TimingAnimation extends Animation {
    constructor(config: any);
    _startTime: any;
    _fromValue: any;
    _toValue: any;
    _duration: any;
    _delay: any;
    _easing: any;
    _onUpdate: any;
    _animationFrame: any;
    _timeout: any;
    _useNativeDriver: any;
    _platformConfig: any;
    __getNativeAnimationConfig(): {
        type: string;
        frames: any[];
        toValue: any;
        iterations: any;
        platformConfig: any;
    };
    onUpdate(): void;
}
import { Animation } from './Animation';
