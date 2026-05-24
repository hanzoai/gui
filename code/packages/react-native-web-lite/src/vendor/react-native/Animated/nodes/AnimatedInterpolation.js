/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* eslint no-bitwise: 0 */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AnimatedInterpolation = void 0;
var AnimatedWithChildren_1 = require("./AnimatedWithChildren");
var NativeAnimatedHelper_1 = require("../NativeAnimatedHelper");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var __DEV__ = process.env.NODE_ENV !== 'production';
var linear = function (t) { return t; };
/**
 * Very handy helper to map input ranges to output ranges with an easing
 * function and custom behavior outside of the ranges.
 */
function createInterpolation(config) {
    if (config.outputRange && typeof config.outputRange[0] === 'string') {
        return createInterpolationFromStringOutputRange(config);
    }
    var outputRange = config.outputRange;
    var inputRange = config.inputRange;
    if (__DEV__) {
        checkInfiniteRange('outputRange', outputRange);
        checkInfiniteRange('inputRange', inputRange);
        checkValidInputRange(inputRange);
        (0, react_native_web_internals_1.invariant)(inputRange.length === outputRange.length, 'inputRange (' +
            inputRange.length +
            ') and outputRange (' +
            outputRange.length +
            ') must have the same length');
    }
    var easing = config.easing || linear;
    var extrapolateLeft = 'extend';
    if (config.extrapolateLeft !== undefined) {
        extrapolateLeft = config.extrapolateLeft;
    }
    else if (config.extrapolate !== undefined) {
        extrapolateLeft = config.extrapolate;
    }
    var extrapolateRight = 'extend';
    if (config.extrapolateRight !== undefined) {
        extrapolateRight = config.extrapolateRight;
    }
    else if (config.extrapolate !== undefined) {
        extrapolateRight = config.extrapolate;
    }
    return function (input) {
        (0, react_native_web_internals_1.invariant)(typeof input === 'number', 'Cannot interpolation an input which is not a number');
        var range = findRange(input, inputRange);
        return interpolate(input, inputRange[range], inputRange[range + 1], outputRange[range], outputRange[range + 1], easing, extrapolateLeft, extrapolateRight);
    };
}
function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight) {
    var result = input;
    // Extrapolate
    if (result < inputMin) {
        if (extrapolateLeft === 'identity') {
            return result;
        }
        else if (extrapolateLeft === 'clamp') {
            result = inputMin;
        }
        else if (extrapolateLeft === 'extend') {
            // noop
        }
    }
    if (result > inputMax) {
        if (extrapolateRight === 'identity') {
            return result;
        }
        else if (extrapolateRight === 'clamp') {
            result = inputMax;
        }
        else if (extrapolateRight === 'extend') {
            // noop
        }
    }
    if (outputMin === outputMax) {
        return outputMin;
    }
    if (inputMin === inputMax) {
        if (input <= inputMin) {
            return outputMin;
        }
        return outputMax;
    }
    // Input Range
    if (inputMin === -Infinity) {
        result = -result;
    }
    else if (inputMax === Infinity) {
        result = result - inputMin;
    }
    else {
        result = (result - inputMin) / (inputMax - inputMin);
    }
    // Easing
    result = easing(result);
    // Output Range
    if (outputMin === -Infinity) {
        result = -result;
    }
    else if (outputMax === Infinity) {
        result = result + outputMin;
    }
    else {
        result = result * (outputMax - outputMin) + outputMin;
    }
    return result;
}
function colorToRgba(input) {
    var normalizedColor = (0, react_native_web_internals_1.normalizeColor)(input);
    if (normalizedColor === null || typeof normalizedColor !== 'number') {
        return input;
    }
    normalizedColor = normalizedColor || 0;
    var r = (normalizedColor & 0xff000000) >>> 24;
    var g = (normalizedColor & 0x00ff0000) >>> 16;
    var b = (normalizedColor & 0x0000ff00) >>> 8;
    var a = (normalizedColor & 0x000000ff) / 255;
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
}
var stringShapeRegex = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *   rgba(123, 42, 99, 0.36) // colors
 *   -45deg                  // values with units
 */
function createInterpolationFromStringOutputRange(config) {
    var outputRange = config.outputRange;
    (0, react_native_web_internals_1.invariant)(outputRange.length >= 2, 'Bad output range');
    outputRange = outputRange.map(colorToRgba);
    checkPattern(outputRange);
    // ['rgba(0, 100, 200, 0)', 'rgba(50, 150, 250, 0.5)']
    // ->
    // [
    //   [0, 50],
    //   [100, 150],
    //   [200, 250],
    //   [0, 0.5],
    // ]
    var outputRanges = outputRange[0].match(stringShapeRegex).map(function () { return []; });
    outputRange.forEach(function (value) {
        value.match(stringShapeRegex).forEach(function (number, i) {
            outputRanges[i].push(+number);
        });
    });
    var interpolations = outputRange[0].match(stringShapeRegex).map(function (value, i) {
        return createInterpolation(__assign(__assign({}, config), { outputRange: outputRanges[i] }));
    });
    // rgba requires that the r,g,b are integers.... so we want to round them, but we *dont* want to
    // round the opacity (4th column).
    var shouldRound = isRgbOrRgba(outputRange[0]);
    return function (input) {
        var i = 0;
        // 'rgba(0, 100, 200, 0)'
        // ->
        // 'rgba(${interpolations[0](input)}, ${interpolations[1](input)}, ...'
        return outputRange[0].replace(stringShapeRegex, function () {
            var val = +interpolations[i++](input);
            if (shouldRound) {
                val = i < 4 ? Math.round(val) : Math.round(val * 1000) / 1000;
            }
            return String(val);
        });
    };
}
function isRgbOrRgba(range) {
    return typeof range === 'string' && range.startsWith('rgb');
}
function checkPattern(arr) {
    var pattern = arr[0].replace(stringShapeRegex, '');
    for (var i = 1; i < arr.length; ++i) {
        (0, react_native_web_internals_1.invariant)(pattern === arr[i].replace(stringShapeRegex, ''), 'invalid pattern ' + arr[0] + ' and ' + arr[i]);
    }
}
function findRange(input, inputRange) {
    var i;
    for (i = 1; i < inputRange.length - 1; ++i) {
        if (inputRange[i] >= input) {
            break;
        }
    }
    return i - 1;
}
function checkValidInputRange(arr) {
    (0, react_native_web_internals_1.invariant)(arr.length >= 2, 'inputRange must have at least 2 elements');
    var message = 'inputRange must be monotonically non-decreasing ' + String(arr);
    for (var i = 1; i < arr.length; ++i) {
        (0, react_native_web_internals_1.invariant)(arr[i] >= arr[i - 1], message);
    }
}
function checkInfiniteRange(name, arr) {
    (0, react_native_web_internals_1.invariant)(arr.length >= 2, name + ' must have at least 2 elements');
    (0, react_native_web_internals_1.invariant)(arr.length !== 2 || arr[0] !== -Infinity || arr[1] !== Infinity, name + 'cannot be ]-infinity;+infinity[ ' + arr);
}
var AnimatedInterpolation = /** @class */ (function (_super) {
    __extends(AnimatedInterpolation, _super);
    function AnimatedInterpolation(parent, config) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._config = config;
        _this._interpolation = createInterpolation(config);
        return _this;
    }
    AnimatedInterpolation.prototype.__makeNative = function (platformConfig) {
        this._parent.__makeNative(platformConfig);
        _super.prototype.__makeNative.call(this, platformConfig);
    };
    AnimatedInterpolation.prototype.__getValue = function () {
        var parentValue = this._parent.__getValue();
        (0, react_native_web_internals_1.invariant)(typeof parentValue === 'number', 'Cannot interpolate an input which is not a number.');
        return this._interpolation(parentValue);
    };
    AnimatedInterpolation.prototype.interpolate = function (config) {
        return new AnimatedInterpolation(this, config);
    };
    AnimatedInterpolation.prototype.__attach = function () {
        this._parent.__addChild(this);
    };
    AnimatedInterpolation.prototype.__detach = function () {
        this._parent.__removeChild(this);
        _super.prototype.__detach.call(this);
    };
    AnimatedInterpolation.prototype.__transformDataType = function (range) {
        return range.map(NativeAnimatedHelper_1.NativeAnimatedHelper.transformDataType);
    };
    AnimatedInterpolation.prototype.__getNativeConfig = function () {
        if (__DEV__) {
            NativeAnimatedHelper_1.NativeAnimatedHelper.validateInterpolation(this._config);
        }
        return {
            inputRange: this._config.inputRange,
            // Only the `outputRange` can contain strings so we don't need to transform `inputRange` here
            outputRange: this.__transformDataType(this._config.outputRange),
            extrapolateLeft: this._config.extrapolateLeft || this._config.extrapolate || 'extend',
            extrapolateRight: this._config.extrapolateRight || this._config.extrapolate || 'extend',
            type: 'interpolation',
        };
    };
    // Export for testing.
    AnimatedInterpolation.__createInterpolation = createInterpolation;
    return AnimatedInterpolation;
}(AnimatedWithChildren_1.AnimatedWithChildren));
exports.AnimatedInterpolation = AnimatedInterpolation;
exports.default = AnimatedInterpolation;
