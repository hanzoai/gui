"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyStyleLengthValue = void 0;
var CSS_UNIT_RE = /^[+-]?\d*(?:\.\d+)?(?:[Ee][+-]?\d+)?(%|\w*)/;
var getUnit = function (str) { return str.match(CSS_UNIT_RE)[1]; };
var isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
var multiplyStyleLengthValue = function (value, multiple) {
    if (typeof value === 'string') {
        var number = parseFloat(value) * multiple;
        var unit = getUnit(value);
        return "".concat(number).concat(unit);
    }
    else if (isNumeric(value)) {
        return value * multiple;
    }
};
exports.multiplyStyleLengthValue = multiplyStyleLengthValue;
