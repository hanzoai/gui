"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processColor = void 0;
var normalize_css_color_1 = require("@hanzogui/normalize-css-color");
var processColor = function (color) {
    if (color === undefined || color === null) {
        return color;
    }
    // convert number and hex
    var int32Color = (0, normalize_css_color_1.default)(color);
    if (int32Color === undefined || int32Color === null) {
        return undefined;
    }
    int32Color = ((int32Color << 24) | (int32Color >>> 8)) >>> 0;
    return int32Color;
};
exports.processColor = processColor;
