export default AnimatedImplementationExports;
export namespace AnimatedImplementationExports {
    export { AnimatedValue as Value };
    export { AnimatedValueXY as ValueXY };
    export { AnimatedColor as Color };
    export { AnimatedInterpolation as Interpolation };
    export { AnimatedNode as Node };
    export { decay };
    export { timing };
    export { spring };
    export { add };
    export { subtract };
    export { divide };
    export { multiply };
    export { modulo };
    export { diffClamp };
    export { delay };
    export { sequence };
    export { parallel };
    export { stagger };
    export { loop };
    export { event };
    export { createAnimatedComponent };
    export { attachNativeEvent };
    export { forkEvent };
    export { unforkEvent };
    export { AnimatedEvent as Event };
}
import { AnimatedValue } from './nodes/AnimatedValue';
import { AnimatedValueXY } from './nodes/AnimatedValueXY';
import { AnimatedColor } from './nodes/AnimatedColor';
import { AnimatedInterpolation } from './nodes/AnimatedInterpolation';
import { AnimatedNode } from './nodes/AnimatedNode';
declare function decay(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
} | {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function timing(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
} | {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function spring(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
} | {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function add(a: any, b: any): AnimatedAddition;
declare function subtract(a: any, b: any): AnimatedSubtraction;
declare function divide(a: any, b: any): AnimatedDivision;
declare function multiply(a: any, b: any): AnimatedMultiplication;
declare function modulo(a: any, modulus: any): AnimatedModulo;
declare function diffClamp(a: any, min: any, max: any): AnimatedDiffClamp;
declare function delay(time: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
} | {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function sequence(animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function parallel(animations: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function stagger(time: any, animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function loop(animation: any, { iterations, resetBeforeIteration }?: {
    iterations?: number;
    resetBeforeIteration?: boolean;
}): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => any;
};
declare function event(argMapping: any, config: any): AnimatedEvent | ((...args: any[]) => void);
import { createAnimatedComponent } from './createAnimatedComponent';
import { attachNativeEvent } from './AnimatedEvent';
declare function forkEvent(event: any, listener: any): any;
declare function unforkEvent(event: any, listener: any): void;
import { AnimatedEvent } from './AnimatedEvent';
import { AnimatedAddition } from './nodes/AnimatedAddition';
import { AnimatedSubtraction } from './nodes/AnimatedSubtraction';
import { AnimatedDivision } from './nodes/AnimatedDivision';
import { AnimatedMultiplication } from './nodes/AnimatedMultiplication';
import { AnimatedModulo } from './nodes/AnimatedModulo';
import { AnimatedDiffClamp } from './nodes/AnimatedDiffClamp';
export { AnimatedImplementationExports as AnimatedImplementation };
