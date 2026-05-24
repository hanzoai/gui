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
exports.isDisabled = void 0;
var isDisabled = function (props) {
    return props.disabled ||
        (Array.isArray(props.accessibilityStates) &&
            props.accessibilityStates.indexOf('disabled') > -1);
};
exports.isDisabled = isDisabled;
