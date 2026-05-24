export default AnimatedMockExports;
export namespace AnimatedMockExports {
    export { AnimatedValue as Value };
    export { AnimatedValueXY as ValueXY };
    export { AnimatedColor as Color };
    export { AnimatedInterpolation as Interpolation };
    export { AnimatedNode as Node };
    export { decay };
    export { timing };
    export { spring };
    export let add: (a: any, b: any) => import("./nodes/AnimatedAddition").AnimatedAddition;
    export let subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction").AnimatedSubtraction;
    export let divide: (a: any, b: any) => import("./nodes/AnimatedDivision").AnimatedDivision;
    export let multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication").AnimatedMultiplication;
    export let modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo").AnimatedModulo;
    export let diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp").AnimatedDiffClamp;
    export { delay };
    export { sequence };
    export { parallel };
    export { stagger };
    export { loop };
    export let event: (argMapping: any, config: any) => AnimatedEvent | ((...args: any[]) => void);
    export { createAnimatedComponent };
    export { attachNativeEvent };
    export let forkEvent: (event: any, listener: any) => any;
    export let unforkEvent: (event: any, listener: any) => void;
    export { AnimatedEvent as Event };
}
import { AnimatedValue } from './nodes/AnimatedValue';
import { AnimatedValueXY } from './nodes/AnimatedValueXY';
import { AnimatedColor } from './nodes/AnimatedColor';
import { AnimatedInterpolation } from './nodes/AnimatedInterpolation';
import { AnimatedNode } from './nodes/AnimatedNode';
declare function decay(value: any, config: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function timing(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function spring(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function delay(time: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function sequence(animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function parallel(animations: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function stagger(time: any, animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function loop(animation: any, { iterations }?: {
    iterations?: number;
}): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
import { AnimatedEvent } from './AnimatedEvent';
import { createAnimatedComponent } from './createAnimatedComponent';
import { attachNativeEvent } from './AnimatedEvent';
export { AnimatedMockExports as AnimatedMock };
