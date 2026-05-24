export default AnimatedTransform;
export class AnimatedTransform extends AnimatedWithChildren {
    constructor(transforms: any);
    _transforms: any;
    __makeNative(): void;
    __getValue(): any;
    __getAnimatedValue(): any;
    __getNativeConfig(): {
        type: string;
        transforms: any[];
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
