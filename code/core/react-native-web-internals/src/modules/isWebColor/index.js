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
exports.isWebColor = void 0;
var isWebColor = function (color) {
    return color === 'currentcolor' ||
        color === 'currentColor' ||
        color === 'inherit' ||
        color.startsWith('var(');
};
exports.isWebColor = isWebColor;
