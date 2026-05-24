"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimatedComponent = createAnimatedComponent;
var useAnimatedProps_1 = require("./useAnimatedProps");
var useMergeRefs_1 = require("../Utilities/useMergeRefs");
var React = require("react");
/**
 * Experimental implementation of `createAnimatedComponent` that is intended to
 * be compatible with concurrent rendering.
 */
function createAnimatedComponent(Component) {
    return React.forwardRef(function (props, forwardedRef) {
        var _a = (0, useAnimatedProps_1.useAnimatedProps)(props), reducedProps = _a[0], callbackRef = _a[1];
        var ref = (0, useMergeRefs_1.useMergeRefs)(callbackRef, forwardedRef);
        // Some components require explicit passthrough values for animation
        // to work properly. For example, if an animated component is
        // transformed and Pressable, onPress will not work after transform
        // without these passthrough values.
        var passthroughAnimatedPropExplicitValues = reducedProps.passthroughAnimatedPropExplicitValues, style = reducedProps.style;
        var _b = passthroughAnimatedPropExplicitValues !== null && passthroughAnimatedPropExplicitValues !== void 0 ? passthroughAnimatedPropExplicitValues : {}, passthroughStyle = _b.style, passthroughProps = __rest(_b, ["style"]);
        var mergedStyle = [style, passthroughStyle];
        return (<Component {...reducedProps} {...passthroughProps} style={mergedStyle} ref={ref}/>);
    });
}
exports.default = createAnimatedComponent;
