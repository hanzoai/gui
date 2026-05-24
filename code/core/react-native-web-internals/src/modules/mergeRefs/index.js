"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRefs = mergeRefs;
function mergeRefs() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function forwardRef(node) {
        args.forEach(function (ref) {
            if (ref == null) {
                return;
            }
            if (typeof ref === 'function') {
                ref(node);
                return;
            }
            if (typeof ref === 'object') {
                // @ts-ignore
                ref.current = node;
                return;
            }
            console.error("mergeRefs cannot handle Refs of type boolean, number or string, received ref ".concat(String(ref)));
        });
    };
}
