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
exports.dismissKeyboard = void 0;
var index_1 = require("../TextInputState/index");
var dismissKeyboard = function () {
    index_1.TextInputState.blurTextInput(index_1.TextInputState.currentlyFocusedField());
};
exports.dismissKeyboard = dismissKeyboard;
