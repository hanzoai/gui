"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Text = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var React = require("react");
var index_1 = require("../createElement/index");
var pickProps = function (props) { return (0, react_native_web_internals_1.pick)(props, react_native_web_internals_1.forwardPropsListText); };
var Text = React.forwardRef(function (props, forwardedRef) {
    var hrefAttrs = props.hrefAttrs, numberOfLines = props.numberOfLines, onClick = props.onClick, onLayout = props.onLayout, onPress = props.onPress, onMoveShouldSetResponder = props.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture, onResponderEnd = props.onResponderEnd, onResponderGrant = props.onResponderGrant, onResponderMove = props.onResponderMove, onResponderReject = props.onResponderReject, onResponderRelease = props.onResponderRelease, onResponderStart = props.onResponderStart, onResponderTerminate = props.onResponderTerminate, onResponderTerminationRequest = props.onResponderTerminationRequest, onScrollShouldSetResponder = props.onScrollShouldSetResponder, onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture, onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder = props.onStartShouldSetResponder, onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture, selectable = props.selectable, rest = __rest(props, ["hrefAttrs", "numberOfLines", "onClick", "onLayout", "onPress", "onMoveShouldSetResponder", "onMoveShouldSetResponderCapture", "onResponderEnd", "onResponderGrant", "onResponderMove", "onResponderReject", "onResponderRelease", "onResponderStart", "onResponderTerminate", "onResponderTerminationRequest", "onScrollShouldSetResponder", "onScrollShouldSetResponderCapture", "onSelectionChangeShouldSetResponder", "onSelectionChangeShouldSetResponderCapture", "onStartShouldSetResponder", "onStartShouldSetResponderCapture", "selectable"]);
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
    var handleClick = React.useCallback(function (e) {
        if (onClick != null) {
            onClick(e);
        }
        else if (onPress != null) {
            e.stopPropagation();
            onPress(e);
        }
    }, [onClick, onPress]);
    var component = hasTextAncestor ? 'span' : 'div';
    var langDirection = props.lang != null ? (0, react_native_web_internals_1.getLocaleDirection)(props.lang) : null;
    var componentDirection = props.dir || langDirection;
    var writingDirection = componentDirection || contextDirection;
    var supportedProps = pickProps(rest);
    supportedProps.dir = componentDirection;
    // 'auto' by default allows browsers to infer writing direction (root elements only)
    if (!hasTextAncestor) {
        supportedProps.dir = componentDirection != null ? componentDirection : 'auto';
    }
    if (onClick || onPress) {
        supportedProps.onClick = handleClick;
    }
    supportedProps.style = [
        numberOfLines != null && numberOfLines > 1 && { WebkitLineClamp: numberOfLines },
        hasTextAncestor === true ? styles.textHasAncestor$raw : styles.text,
        numberOfLines === 1 && styles.textOneLine,
        numberOfLines != null && numberOfLines > 1 && styles.textMultiLine,
        props.style,
        selectable === true && styles.selectable,
        selectable === false && styles.notSelectable,
        onPress && styles.pressable,
    ];
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
    var element = (0, index_1.useCreateElement)(component, supportedProps, {
        writingDirection: writingDirection,
    });
    return hasTextAncestor ? (element) : ((0, jsx_runtime_1.jsx)(react_native_web_internals_1.TextAncestorContext.Provider, { value: true, children: element }));
});
exports.Text = Text;
Text.displayName = 'Text';
var textStyle = {
    backgroundColor: 'transparent',
    border: '0 solid black',
    boxSizing: 'border-box',
    color: 'black',
    display: 'inline',
    font: '14px System',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
};
var styles = {
    text: textStyle,
    textHasAncestor$raw: __assign(__assign({}, textStyle), { color: 'inherit', font: 'inherit', whiteSpace: 'inherit' }),
    textOneLine: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
    },
    // See #13
    textMultiLine: {
        display: '-webkit-box',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitBoxOrient: 'vertical',
    },
    notSelectable: {
        userSelect: 'none',
    },
    selectable: {
        userSelect: 'text',
    },
    pressable: {
        cursor: 'pointer',
    },
};
exports.default = Text;
