"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeColor = void 0;
var isWebColor_1 = require("../../modules/isWebColor");
var processColor_1 = require("../../modules/processColor");
var normalizeColor = function (color, opacity) {
    if (opacity === void 0) { opacity = 1; }
    if (color == null)
        return;
    if (typeof color === 'string' && (0, isWebColor_1.isWebColor)(color)) {
        return color;
    }
    var colorInt = (0, processColor_1.processColor)(color);
    if (colorInt != null) {
        var r = (colorInt >> 16) & 255;
        var g = (colorInt >> 8) & 255;
        var b = colorInt & 255;
        var a = ((colorInt >> 24) & 255) / 255;
        var alpha = (a * opacity).toFixed(2);
        return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(alpha, ")");
    }
    if (process.env.TAMAGUI_TARGET === 'web') {
        if (typeof color === 'string') {
            return color;
        }
    }
};
exports.normalizeColor = normalizeColor;
