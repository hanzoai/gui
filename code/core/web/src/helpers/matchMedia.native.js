"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMedia = void 0;
exports.setupMatchMedia = setupMatchMedia;
var matchMediaImpl = matchMediaFallback;
var matchMedia = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return matchMediaImpl.apply(void 0, args);
};
exports.matchMedia = matchMedia;
function matchMediaFallback(query) {
    if (!process.env.IS_STATIC && process.env.NODE_ENV === 'development') {
        console.warn('warning: matchMedia implementation is not provided.');
    }
    return {
        match: function (a, b) { return false; },
        addListener: function () { },
        removeListener: function () { },
        matches: false,
    };
}
function setupMatchMedia(_) {
    if (process.env.NODE_ENV === 'development') {
        if (typeof _ !== 'function') {
            if (!process.env.IS_STATIC) {
                console.trace("setupMatchMedia was called without a function, this can cause issues on native", _);
            }
        }
    }
    matchMediaImpl = _;
    // @ts-ignore
    globalThis['matchMedia'] = _;
}
