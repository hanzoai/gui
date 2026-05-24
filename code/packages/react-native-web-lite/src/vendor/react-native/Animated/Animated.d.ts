export default AnimatedExports;
export const AnimatedExports: {
    Value: typeof import("./nodes/AnimatedValue").AnimatedValue;
    ValueXY: typeof import("./nodes/AnimatedValueXY").AnimatedValueXY;
    Color: typeof import("./nodes/AnimatedColor").AnimatedColor;
    Interpolation: typeof import("./nodes/AnimatedInterpolation").default;
    Node: typeof import("./nodes/AnimatedNode").AnimatedNode;
    decay: (value: any, config: any) => {
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
    timing: (value: any, config: any) => {
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
    spring: (value: any, config: any) => {
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
    add: (a: any, b: any) => import("./nodes/AnimatedAddition").AnimatedAddition;
    subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction").AnimatedSubtraction;
    divide: (a: any, b: any) => import("./nodes/AnimatedDivision").AnimatedDivision;
    multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication").AnimatedMultiplication;
    modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo").AnimatedModulo;
    diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp").AnimatedDiffClamp;
    delay: (time: any) => {
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
    sequence: (animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    parallel: (animations: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    stagger: (time: any, animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    loop: (animation: any, { iterations, resetBeforeIteration }?: {
        iterations?: number;
        resetBeforeIteration?: boolean;
    }) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => any;
    };
    event: (argMapping: any, config: any) => import("./AnimatedEvent").AnimatedEvent | ((...args: any[]) => void);
    createAnimatedComponent: typeof import("./createAnimatedComponent").createAnimatedComponent;
    attachNativeEvent: typeof import("./AnimatedEvent").attachNativeEvent;
    forkEvent: (event: any, listener: any) => any;
    unforkEvent: (event: any, listener: any) => void;
    Event: typeof import("./AnimatedEvent").AnimatedEvent;
    FlatList: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    Image: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    ScrollView: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    SectionList: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    Text: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    View: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
} | {
    Value: typeof import("./nodes/AnimatedValue").AnimatedValue;
    ValueXY: typeof import("./nodes/AnimatedValueXY").AnimatedValueXY;
    Color: typeof import("./nodes/AnimatedColor").AnimatedColor;
    Interpolation: typeof import("./nodes/AnimatedInterpolation").default;
    Node: typeof import("./nodes/AnimatedNode").AnimatedNode;
    decay: (value: any, config: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    timing: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    spring: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    add: (a: any, b: any) => import("./nodes/AnimatedAddition").AnimatedAddition;
    subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction").AnimatedSubtraction;
    divide: (a: any, b: any) => import("./nodes/AnimatedDivision").AnimatedDivision;
    multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication").AnimatedMultiplication;
    modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo").AnimatedModulo;
    diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp").AnimatedDiffClamp;
    delay: (time: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    sequence: (animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    parallel: (animations: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    stagger: (time: any, animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    loop: (animation: any, { iterations }?: {
        iterations?: number;
    }) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    event: (argMapping: any, config: any) => import("./AnimatedEvent").AnimatedEvent | ((...args: any[]) => void);
    createAnimatedComponent: typeof import("./createAnimatedComponent").createAnimatedComponent;
    attachNativeEvent: typeof import("./AnimatedEvent").attachNativeEvent;
    forkEvent: (event: any, listener: any) => any;
    unforkEvent: (event: any, listener: any) => void;
    Event: typeof import("./AnimatedEvent").AnimatedEvent;
    FlatList: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    Image: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    ScrollView: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    SectionList: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    Text: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
    View: import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
};
