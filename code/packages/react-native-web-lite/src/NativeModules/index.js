"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeModules = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
// NativeModules shim
exports.NativeModules = {
    UIManager: react_native_web_internals_1.UIManager,
};
