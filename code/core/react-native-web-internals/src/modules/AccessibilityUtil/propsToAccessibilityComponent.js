"use strict";
// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.propsToAccessibilityComponent = void 0;
var propsToAriaRole_1 = require("./propsToAriaRole");
var roleComponents = {
    article: 'article',
    banner: 'header',
    blockquote: 'blockquote',
    code: 'code',
    complementary: 'aside',
    contentinfo: 'footer',
    deletion: 'del',
    emphasis: 'em',
    figure: 'figure',
    insertion: 'ins',
    form: 'form',
    list: 'ul',
    listitem: 'li',
    main: 'main',
    navigation: 'nav',
    region: 'section',
    strong: 'strong',
};
var emptyObject = {};
var propsToAccessibilityComponent = function (props) {
    if (props === void 0) { props = emptyObject; }
    // special-case for "label" role which doesn't map to an ARIA role
    if (props.accessibilityRole === 'label') {
        return 'label';
    }
    var role = (0, propsToAriaRole_1.propsToAriaRole)(props);
    if (role) {
        if (role === 'heading') {
            var level = props.accessibilityLevel || props['aria-level'];
            if (level != null) {
                return "h".concat(level);
            }
            return 'h1';
        }
        return roleComponents[role];
    }
};
exports.propsToAccessibilityComponent = propsToAccessibilityComponent;
