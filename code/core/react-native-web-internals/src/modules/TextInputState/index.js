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
exports.TextInputState = void 0;
var UIManager_1 = require("../UIManager");
/**
 * This class is responsible for coordinating the "focused"
 * state for TextInputs. All calls relating to the keyboard
 * should be funneled through here
 */
exports.TextInputState = {
    /**
     * Internal state
     */
    _currentlyFocusedNode: null,
    /**
     * Returns the ID of the currently focused text field, if one exists
     * If no text field is focused it returns null
     */
    currentlyFocusedField: function () {
        if (document.activeElement !== this._currentlyFocusedNode) {
            this._currentlyFocusedNode = null;
        }
        return this._currentlyFocusedNode;
    },
    /**
     * @param {Object} TextInputID id of the text field to focus
     * Focuses the specified text field
     * noop if the text field was already focused
     */
    focusTextInput: function (textFieldNode) {
        if (textFieldNode !== null) {
            this._currentlyFocusedNode = textFieldNode;
            if (document.activeElement !== textFieldNode) {
                UIManager_1.UIManager.focus(textFieldNode);
            }
        }
    },
    /**
     * @param {Object} textFieldNode id of the text field to focus
     * Unfocuses the specified text field
     * noop if it wasn't focused
     */
    blurTextInput: function (textFieldNode) {
        if (textFieldNode !== null) {
            this._currentlyFocusedNode = null;
            if (document.activeElement === textFieldNode) {
                UIManager_1.UIManager.blur(textFieldNode);
            }
        }
    },
};
