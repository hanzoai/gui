"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundingClientRect = void 0;
var getBoundingClientRect = function (node) {
    if (node != null) {
        var isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
        if (isElement && typeof node.getBoundingClientRect === 'function') {
            return node.getBoundingClientRect();
        }
    }
};
exports.getBoundingClientRect = getBoundingClientRect;
