export default AnimatedStyle;
export class AnimatedStyle extends AnimatedWithChildren {
    constructor(style: any);
    _inputStyle: any;
    _style: {};
    _walkStyleAndGetValues(style: any): {};
    __getValue(): any[];
    _walkStyleAndGetAnimatedValues(style: any): {};
    __getAnimatedValue(): {};
    __makeNative(): void;
    __getNativeConfig(): {
        type: string;
        style: {};
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
