"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = invariant;
exports.warning = warning;
function invariant(condition, log) {
    var logVars = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        logVars[_i - 2] = arguments[_i];
    }
    if (!condition) {
        throw new Error(process.env.NODE_ENV === 'development'
            ? log
                .split('%s')
                .flatMap(function (chunk, i) { return [chunk, logVars[i]]; })
                .join('')
            : log);
    }
}
function warning(condition, log) {
    var logVars = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        logVars[_i - 2] = arguments[_i];
    }
    if (process.env.NODE_ENV === 'development') {
        try {
            invariant.apply(void 0, __spreadArray([condition, log], logVars, false));
        }
        catch (err) {
            console.warn(err);
            // allow to pass through
        }
    }
}
