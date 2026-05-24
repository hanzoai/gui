"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processStyle = exports.preprocess = exports.createTextShadowValue = exports.createBoxShadowValue = void 0;
var normalizeColor_1 = require("./compiler/normalizeColor");
var normalizeValueWithProperty_1 = require("./compiler/normalizeValueWithProperty");
var emptyObject = {};
/**
 * Shadows
 */
var defaultOffset = { height: 0, width: 0 };
var createBoxShadowValue = function (style) {
    var shadowColor = style.shadowColor, shadowOffset = style.shadowOffset, shadowOpacity = style.shadowOpacity, shadowRadius = style.shadowRadius;
    var _a = shadowOffset || defaultOffset, height = _a.height, width = _a.width;
    var offsetX = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(width);
    var offsetY = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(height);
    var blurRadius = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(shadowRadius || 0);
    var color = (0, normalizeColor_1.normalizeColor)(shadowColor || 'black', shadowOpacity);
    if (color != null && offsetX != null && offsetY != null && blurRadius != null) {
        return "".concat(offsetX, " ").concat(offsetY, " ").concat(blurRadius, " ").concat(color);
    }
};
exports.createBoxShadowValue = createBoxShadowValue;
var createTextShadowValue = function (style) {
    var textShadowColor = style.textShadowColor, textShadowOffset = style.textShadowOffset, textShadowRadius = style.textShadowRadius;
    var _a = textShadowOffset || defaultOffset, height = _a.height, width = _a.width;
    var radius = textShadowRadius || 0;
    var offsetX = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(width);
    var offsetY = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(height);
    var blurRadius = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(radius);
    var color = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(textShadowColor, 'textShadowColor');
    if (color &&
        (height !== 0 || width !== 0 || radius !== 0) &&
        offsetX != null &&
        offsetY != null &&
        blurRadius != null) {
        return "".concat(offsetX, " ").concat(offsetY, " ").concat(blurRadius, " ").concat(color);
    }
};
exports.createTextShadowValue = createTextShadowValue;
/**
 * Preprocess styles
 */
var preprocess = function (originalStyle) {
    var style = originalStyle || emptyObject;
    var nextStyle = {};
    for (var originalProp in style) {
        var originalValue = style[originalProp];
        var prop = originalProp;
        var value = originalValue;
        if (!Object.prototype.hasOwnProperty.call(style, originalProp) ||
            originalValue == null) {
            continue;
        }
        // Convert shadow styles
        if (prop === 'shadowColor' ||
            prop === 'shadowOffset' ||
            prop === 'shadowOpacity' ||
            prop === 'shadowRadius') {
            var boxShadowValue = (0, exports.createBoxShadowValue)(style);
            if (boxShadowValue != null && nextStyle.boxShadow == null) {
                var boxShadow = style.boxShadow;
                prop = 'boxShadow';
                value = boxShadow ? "".concat(boxShadow, ", ").concat(boxShadowValue) : boxShadowValue;
            }
            else {
                continue;
            }
        }
        // Convert text shadow styles
        if (prop === 'textShadowColor' ||
            prop === 'textShadowOffset' ||
            prop === 'textShadowRadius') {
            var textShadowValue = (0, exports.createTextShadowValue)(style);
            if (textShadowValue != null && nextStyle.textShadow == null) {
                var textShadow = style.textShadow;
                prop = 'textShadow';
                value = textShadow ? "".concat(textShadow, ", ").concat(textShadowValue) : textShadowValue;
            }
            else {
                continue;
            }
        }
        nextStyle[prop] = value;
    }
    // $FlowIgnore
    return nextStyle;
};
exports.preprocess = preprocess;
exports.processStyle = exports.preprocess;
