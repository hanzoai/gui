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
exports.resolveShadowValue = void 0;
var normalizeColor_1 = require("./normalizeColor");
var normalizeValueWithProperty_1 = require("./normalizeValueWithProperty");
var defaultOffset = { height: 0, width: 0 };
var resolveShadowValue = function (style) {
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
exports.resolveShadowValue = resolveShadowValue;
