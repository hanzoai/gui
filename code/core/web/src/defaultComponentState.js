"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultComponentStateShouldEnter = exports.defaultComponentStateMounted = exports.defaultComponentState = void 0;
exports.defaultComponentState = {
    hover: false,
    press: false,
    pressIn: false,
    focus: false,
    focusVisible: false,
    focusWithin: false,
    unmounted: true,
    disabled: false,
};
exports.defaultComponentStateMounted = __assign(__assign({}, exports.defaultComponentState), { unmounted: false });
exports.defaultComponentStateShouldEnter = __assign(__assign({}, exports.defaultComponentState), { unmounted: 'should-enter' });
