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
exports.dispatchNativeToast = dispatchNativeToast;
var createNativeToast_1 = require("./createNativeToast");
/**
 * Attempts to dispatch a toast via native platform API (Burnt on mobile, Notification on web).
 * Returns true if the toast was handled natively, false if it should fall through to in-app.
 */
function dispatchNativeToast(toast, opts) {
    var _a, _b;
    var titleText = typeof toast.title === 'function' ? toast.title() : toast.title;
    if (typeof titleText !== 'string')
        return false;
    var descText = typeof toast.description === 'function' ? toast.description() : toast.description;
    var toastType = (_a = toast.type) !== null && _a !== void 0 ? _a : 'default';
    var preset = toastType === 'error' ? 'error' : toastType === 'success' ? 'done' : 'none';
    var haptic = toastType === 'error'
        ? 'error'
        : toastType === 'success'
            ? 'success'
            : toastType === 'warning'
                ? 'warning'
                : 'none';
    var result = (0, createNativeToast_1.createNativeToast)(titleText, {
        message: typeof descText === 'string' ? descText : undefined,
        duration: (_b = toast.duration) !== null && _b !== void 0 ? _b : opts.duration,
        burntOptions: __assign({ preset: preset, haptic: haptic }, opts.burntOptions),
        notificationOptions: opts.notificationOptions,
    });
    return result !== false;
}
