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
exports.AccessibilityUtil = void 0;
var isDisabled_1 = require("./isDisabled");
var propsToAccessibilityComponent_1 = require("./propsToAccessibilityComponent");
var propsToAriaRole_1 = require("./propsToAriaRole");
exports.AccessibilityUtil = {
    isDisabled: isDisabled_1.isDisabled,
    propsToAccessibilityComponent: propsToAccessibilityComponent_1.propsToAccessibilityComponent,
    propsToAriaRole: propsToAriaRole_1.propsToAriaRole,
};
