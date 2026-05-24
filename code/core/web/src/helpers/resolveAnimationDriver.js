"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAnimationDriver = resolveAnimationDriver;
/**
 * Resolves a value that might be an AnimationDriver or a multi-driver config object
 * like { default: motionDriver, css: cssDriver } into an actual AnimationDriver.
 */
function resolveAnimationDriver(driver) {
    var _a;
    if (!driver)
        return null;
    // valid driver
    if (typeof driver.useAnimations === 'function') {
        return driver;
    }
    // multi-driver object - extract default
    if ('default' in driver &&
        typeof ((_a = driver.default) === null || _a === void 0 ? void 0 : _a.useAnimations) === 'function') {
        return driver.default;
    }
    return null;
}
