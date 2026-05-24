"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAnimationDriver = void 0;
var noAnimationDriver = function (method) {
    console.warn("No animation driver configured. To use ".concat(method, ", you must pass `animations` to createHanzogui. See: https://hanzogui.dev/docs/core/animations"));
};
var createEmptyAnimationDriver = function () { return ({
    isReactNative: false,
    inputStyle: 'css',
    outputStyle: 'css',
    isStub: true,
    animations: {},
    useAnimations: function () { return noAnimationDriver('animations'); },
    usePresence: function () { return noAnimationDriver('usePresence'); },
    ResetPresence: function () { return noAnimationDriver('ResetPresence'); },
    useAnimatedNumber: function () { return noAnimationDriver('useAnimatedNumber'); },
    useAnimatedNumberStyle: function () { return noAnimationDriver('useAnimatedNumberStyle'); },
    useAnimatedNumbersStyle: function () { return noAnimationDriver('useAnimatedNumbersStyle'); },
    useAnimatedNumberReaction: function () { return noAnimationDriver('useAnimatedNumberReaction'); },
}); };
exports.defaultAnimationDriver = createEmptyAnimationDriver();
