"use strict";
/**
 * Copyright (c) Nicolas Gallagher
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSelectionValid = isSelectionValid;
function isSelectionValid() {
    var selection = window.getSelection();
    if (!selection)
        return false;
    var string = selection.toString();
    var anchorNode = selection.anchorNode;
    var focusNode = selection.focusNode;
    var isTextNode = (anchorNode && anchorNode.nodeType === window.Node.TEXT_NODE) ||
        (focusNode && focusNode.nodeType === window.Node.TEXT_NODE);
    return string.length >= 1 && string !== '\n' && !!isTextNode;
}
