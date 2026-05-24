export default AnimatedModulo;
export class AnimatedModulo extends AnimatedWithChildren {
    constructor(a: any, modulus: any);
    _a: any;
    _modulus: any;
    __getValue(): number;
    interpolate(config: any): AnimatedInterpolation;
    __getNativeConfig(): {
        type: string;
        input: any;
        modulus: any;
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
import { AnimatedInterpolation } from './AnimatedInterpolation';
