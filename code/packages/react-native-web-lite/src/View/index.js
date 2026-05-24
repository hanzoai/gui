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
exports.View = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var React = require("react");
var index_1 = require("../createElement/index");
var pickProps = function (props) { return (0, react_native_web_internals_1.pick)(props, react_native_web_internals_1.forwardPropsListView); };
var View = React.forwardRef(function (props, forwardedRef) {
    var hrefAttrs = props.hrefAttrs, onLayout = props.onLayout, onMoveShouldSetResponder = props.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture, onResponderEnd = props.onResponderEnd, onResponderGrant = props.onResponderGrant, onResponderMove = props.onResponderMove, onResponderReject = props.onResponderReject, onResponderRelease = props.onResponderRelease, onResponderStart = props.onResponderStart, onResponderTerminate = props.onResponderTerminate, onResponderTerminationRequest = props.onResponderTerminationRequest, onScrollShouldSetResponder = props.onScrollShouldSetResponder, onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture, onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder = props.onStartShouldSetResponder, onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture, rest = __rest(props, ["hrefAttrs", "onLayout", "onMoveShouldSetResponder", "onMoveShouldSetResponderCapture", "onResponderEnd", "onResponderGrant", "onResponderMove", "onResponderReject", "onResponderRelease", "onResponderStart", "onResponderTerminate", "onResponderTerminationRequest", "onScrollShouldSetResponder", "onScrollShouldSetResponderCapture", "onSelectionChangeShouldSetResponder", "onSelectionChangeShouldSetResponderCapture", "onStartShouldSetResponder", "onStartShouldSetResponderCapture"]);
    if (process.env.NODE_ENV !== 'production') {
        React.Children.toArray(props.children).forEach(function (item) {
            if (typeof item === 'string') {
                console.error("Unexpected text node: ".concat(item, ". A text node cannot be a child of a <View>."));
            }
        });
    }
    var hasTextAncestor = React.useContext(react_native_web_internals_1.TextAncestorContext);
    var hostRef = React.useRef(null);
    var contextDirection = (0, react_native_web_internals_1.useLocaleContext)().direction;
    (0, react_native_web_internals_1.useElementLayout)(hostRef, onLayout);
    (0, react_native_web_internals_1.useResponderEvents)(hostRef, {
        onMoveShouldSetResponder: onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
        onResponderEnd: onResponderEnd,
        onResponderGrant: onResponderGrant,
        onResponderMove: onResponderMove,
        onResponderReject: onResponderReject,
        onResponderRelease: onResponderRelease,
        onResponderStart: onResponderStart,
        onResponderTerminate: onResponderTerminate,
        onResponderTerminationRequest: onResponderTerminationRequest,
        onScrollShouldSetResponder: onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture: onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder: onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture: onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder: onStartShouldSetResponder,
        onStartShouldSetResponderCapture: onStartShouldSetResponderCapture,
    });
    var component = 'div';
    var langDirection = props.lang != null ? (0, react_native_web_internals_1.getLocaleDirection)(props.lang) : null;
    var componentDirection = props.dir || langDirection;
    var writingDirection = componentDirection || contextDirection;
    var supportedProps = pickProps(rest);
    supportedProps.dir = componentDirection;
    supportedProps.style = [styles.view, hasTextAncestor && styles.inline, props.style];
    if (props.href != null) {
        component = 'a';
        if (hrefAttrs != null) {
            var download = hrefAttrs.download, rel = hrefAttrs.rel, target = hrefAttrs.target;
            if (download != null) {
                supportedProps.download = download;
            }
            if (rel != null) {
                supportedProps.rel = rel;
            }
            if (typeof target === 'string') {
                supportedProps.target = target.charAt(0) !== '_' ? '_' + target : target;
            }
        }
    }
    var platformMethodsRef = (0, react_native_web_internals_1.usePlatformMethods)(supportedProps);
    var setRef = (0, react_native_web_internals_1.useMergeRefs)(hostRef, platformMethodsRef, forwardedRef);
    supportedProps.ref = setRef;
    return (0, index_1.useCreateElement)(component, supportedProps, { writingDirection: writingDirection });
});
exports.View = View;
View.displayName = 'View';
var styles = {
    view: {
        alignItems: 'stretch',
        boxSizing: 'border-box',
        display: 'flex',
        flexBasis: 'auto',
        flexDirection: 'column',
        flexShrink: 0,
    },
    inline: {
        display: 'inline-flex',
    },
};
exports.default = View;
