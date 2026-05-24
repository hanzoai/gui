"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dangerousStyleValue = dangerousStyleValue;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * From React 16.0.0
 * @noflow
 */
var index_1 = require("../unitlessNumbers/index");
var normalizeValueWithProperty_1 = require("../../StyleSheet/compiler/normalizeValueWithProperty");
/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value, isCustomProperty) {
    // Note that we've removed escapeTextForBrowser() calls here since the
    // whole string will be escaped when the attribute is injected into
    // the markup. If you provide unsafe user data here they can inject
    // arbitrary CSS which may be problematic (I couldn't repro this):
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
    // This is not an XSS hole but instead a potential CSS injection issue
    // which has lead to a greater discussion about how we're going to
    // trust URLs moving forward. See #2115901
    var isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
        return '';
    }
    // handle Animated.Value objects that have __getValue
    if (typeof value === 'object' && typeof value.__getValue === 'function') {
        value = value.__getValue();
    }
    // handle transform arrays: [{ translateY: 10 }, { scale: 2 }]
    if (name === 'transform' && Array.isArray(value)) {
        return value
            .map(function (t) {
            var key = Object.keys(t)[0];
            var val = t[key];
            // resolve nested Animated.Value
            if (typeof val === 'object' && typeof val.__getValue === 'function') {
                val = val.__getValue();
            }
            if (key === 'matrix' || key === 'matrix3d') {
                return "".concat(key, "(").concat(val.join(','), ")");
            }
            return "".concat(key, "(").concat((0, normalizeValueWithProperty_1.normalizeValueWithProperty)(val, key), ")");
        })
            .join(' ');
    }
    if (!isCustomProperty &&
        typeof value === 'number' &&
        value !== 0 &&
        !(index_1.unitlessNumbers.hasOwnProperty(name) && index_1.unitlessNumbers[name])) {
        return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
    }
    return ('' + value).trim();
}
