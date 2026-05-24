"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animations = void 0;
var animations_react_native_1 = require("@hanzogui/animations-react-native");
exports.animations = (0, animations_react_native_1.createAnimations)({
    '100ms': {
        type: 'timing',
        duration: 100,
    },
    bouncy: {
        damping: 9,
        mass: 0.9,
        stiffness: 150,
    },
    lazy: {
        damping: 18,
        stiffness: 50,
    },
    medium: {
        damping: 15,
        stiffness: 120,
        mass: 1,
    },
    slow: {
        damping: 15,
        stiffness: 40,
    },
    quick: {
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
    tooltip: {
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    select: {
        damping: 45,
        mass: 0.5,
        stiffness: 1000,
    },
});
