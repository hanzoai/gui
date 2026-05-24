"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
var _requestIdleCallback = function (cb, options) {
    return setTimeout(function () {
        var start = Date.now();
        cb({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - start));
            },
        });
    }, 1);
};
var _cancelIdleCallback = function (id) {
    clearTimeout(id);
};
var isSupported = typeof window !== 'undefined' && typeof window.requestIdleCallback !== 'undefined';
exports.requestIdleCallback = isSupported
    ? window.requestIdleCallback
    : _requestIdleCallback;
exports.cancelIdleCallback = isSupported
    ? window.cancelIdleCallback
    : _cancelIdleCallback;
