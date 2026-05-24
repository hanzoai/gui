export default AnimatedDivision;
export class AnimatedDivision extends AnimatedWithChildren {
    constructor(a: any, b: any);
    _a: any;
    _b: any;
    _warnedAboutDivideByZero: boolean;
    __getValue(): number;
    interpolate(config: any): AnimatedInterpolation;
    __getNativeConfig(): {
        type: string;
        input: any[];
    };
}
import { AnimatedWithChildren } from './AnimatedWithChildren';
import { AnimatedInterpolation } from './AnimatedInterpolation';
