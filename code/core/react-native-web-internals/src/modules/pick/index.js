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
exports.pick = pick;
function pick(obj, list) {
    var nextObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (list[key] === true) {
                nextObj[key] = obj[key];
            }
        }
    }
    return nextObj;
}
