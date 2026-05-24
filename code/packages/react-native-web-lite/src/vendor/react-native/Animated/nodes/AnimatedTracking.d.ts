export default AnimatedTracking;
export class AnimatedTracking extends AnimatedNode {
    constructor(value: any, parent: any, animationClass: any, animationConfig: any, callback: any);
    _value: any;
    _parent: any;
    _callback: any;
    _animationConfig: any;
    _animationClass: any;
    _useNativeDriver: any;
    __makeNative(): void;
    __getValue(): any;
    update(): void;
    __getNativeConfig(): {
        type: string;
        animationId: number;
        animationConfig: any;
        toValue: any;
        value: any;
    };
}
import { AnimatedNode } from './AnimatedNode';
