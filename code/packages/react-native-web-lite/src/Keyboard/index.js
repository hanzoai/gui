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
exports.Keyboard = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
exports.Keyboard = {
    addListener: function () {
        return { remove: function () { } };
    },
    dismiss: function () {
        (0, react_native_web_internals_1.dismissKeyboard)();
    },
    removeAllListeners: function () { },
    removeListener: function () { },
};
