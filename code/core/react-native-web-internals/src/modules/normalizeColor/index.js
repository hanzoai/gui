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
var index_1 = require("../isWebColor/index");
var index_2 = require("../processColor/index");
var normalizeColor = function (color, opacity) {
    if (opacity === void 0) { opacity = 1; }
    if (color == null)
        return;
    if (typeof color === 'string' && (0, index_1.isWebColor)(color)) {
        return color;
    }
    var colorInt = (0, index_2.processColor)(color);
    if (colorInt != null) {
        var r = (colorInt >> 16) & 255;
        var g = (colorInt >> 8) & 255;
        var b = colorInt & 255;
        var a = ((colorInt >> 24) & 255) / 255;
        var alpha = (a * opacity).toFixed(2);
        return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(alpha, ")");
    }
};
exports.normalizeColor = normalizeColor;
