"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeValueWithProperty = normalizeValueWithProperty;
var index_1 = require("../../modules/unitlessNumbers/index");
var normalizeColor_1 = require("./normalizeColor");
var colorProps = {
    backgroundColor: true,
    borderColor: true,
    borderTopColor: true,
    borderRightColor: true,
    borderBottomColor: true,
    borderLeftColor: true,
    color: true,
    shadowColor: true,
    textDecorationColor: true,
    textShadowColor: true,
};
function normalizeValueWithProperty(value, property) {
    var returnValue = value;
    if ((property == null || !index_1.unitlessNumbers[property]) && typeof value === 'number') {
        returnValue = "".concat(value, "px");
    }
    else if (property != null && colorProps[property]) {
        returnValue = (0, normalizeColor_1.normalizeColor)(value);
    }
    return returnValue;
}
