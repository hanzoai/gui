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
exports.propsToAriaRole = void 0;
var accessibilityRoleToWebRole = {
    adjustable: 'slider',
    button: 'button',
    header: 'heading',
    image: 'img',
    imagebutton: null,
    keyboardkey: null,
    label: null,
    link: 'link',
    none: 'presentation',
    search: 'search',
    summary: 'region',
    text: null,
};
var propsToAriaRole = function (_a) {
    var accessibilityRole = _a.accessibilityRole;
    if (accessibilityRole) {
        var inferredRole = accessibilityRoleToWebRole[accessibilityRole];
        if (inferredRole !== null) {
            // ignore roles that don't map to web
            return inferredRole || accessibilityRole;
        }
    }
};
exports.propsToAriaRole = propsToAriaRole;
