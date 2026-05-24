"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibration = void 0;
var vibrate = function (pattern) {
    if ('vibrate' in window.navigator) {
        window.navigator.vibrate(pattern);
    }
};
exports.Vibration = {
    cancel: function () {
        vibrate(0);
    },
    vibrate: function (pattern) {
        if (pattern === void 0) { pattern = 400; }
        vibrate(pattern);
    },
};
