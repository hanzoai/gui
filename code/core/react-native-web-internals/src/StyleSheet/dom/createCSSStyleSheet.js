"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCSSStyleSheet = createCSSStyleSheet;
var canUseDOM_1 = require("../../modules/canUseDOM");
// @ts-ignore : HTMLStyleElement is incorrectly typed - https://github.com/facebook/flow/issues/2696
function createCSSStyleSheet(id, rootNode, textContent) {
    if (canUseDOM_1.canUseDOM) {
        var root = rootNode != null ? rootNode : document;
        var element = root.getElementById(id);
        if (element == null) {
            element = document.createElement('style');
            element.setAttribute('id', id);
            if (typeof textContent === 'string') {
                element.appendChild(document.createTextNode(textContent));
            }
            if (root instanceof ShadowRoot) {
                root.insertBefore(element, root.firstChild);
            }
            else {
                var head = root.head;
                if (head) {
                    // append fixes remix SSR hydration because react goes in-order and prepend messes up order
                    head.appendChild(element);
                }
            }
        }
        // @ts-ignore : HTMLElement is incorrectly typed
        return element.sheet;
    }
    else {
        return null;
    }
}
