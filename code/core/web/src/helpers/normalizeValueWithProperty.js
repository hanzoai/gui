"use strict";
/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
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
exports.normalizeValueWithProperty = normalizeValueWithProperty;
var constants_1 = require("@hanzogui/constants");
var helpers_1 = require("@hanzogui/helpers");
// only doing this on web on native it accepts pixel values
var stylePropsAllPlusTransforms = __assign(__assign({}, helpers_1.stylePropsAll), { translateX: true, translateY: true });
function normalizeValueWithProperty(value, property) {
    if (property === void 0) { property = ''; }
    if (!constants_1.isWeb)
        return value;
    if (helpers_1.stylePropsUnitless[property] ||
        (property && !stylePropsAllPlusTransforms[property]) ||
        typeof value === 'boolean') {
        return value;
    }
    if (value && typeof value === 'object') {
        if (typeof value.__getValue === 'function') {
            // resolve Animated.Value objects
            value = value.__getValue();
        }
        else {
            return value;
        }
    }
    var res = value;
    if (typeof value === 'number') {
        res = "".concat(value, "px");
    }
    else if (property) {
        res = "".concat(res);
    }
    return res;
}
