/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';
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
exports.TouchableOpacity = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var react_1 = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var View_1 = require("./View");
/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 */
function TouchableOpacityImpl(props, forwardedRef) {
    var activeOpacity = props.activeOpacity, delayPressIn = props.delayPressIn, delayPressOut = props.delayPressOut, delayLongPress = props.delayLongPress, disabled = props.disabled, focusable = props.focusable, onLongPress = props.onLongPress, onPress = props.onPress, onPressIn = props.onPressIn, onPressOut = props.onPressOut, rejectResponderTermination = props.rejectResponderTermination, style = props.style, rest = __rest(props, ["activeOpacity", "delayPressIn", "delayPressOut", "delayLongPress", "disabled", "focusable", "onLongPress", "onPress", "onPressIn", "onPressOut", "rejectResponderTermination", "style"]);
    var hostRef = (0, react_1.useRef)(null);
    var setRef = (0, react_native_web_internals_1.useMergeRefs)(forwardedRef, hostRef);
    var _a = (0, react_1.useState)('0s'), duration = _a[0], setDuration = _a[1];
    var _b = (0, react_1.useState)(null), opacityOverride = _b[0], setOpacityOverride = _b[1];
    var setOpacityTo = (0, react_1.useCallback)(function (value, duration) {
        setOpacityOverride(value);
        setDuration(duration ? "".concat(duration / 1000, "s") : '0s');
    }, [setOpacityOverride, setDuration]);
    var setOpacityActive = (0, react_1.useCallback)(function (duration) {
        setOpacityTo(activeOpacity !== null && activeOpacity !== void 0 ? activeOpacity : 0.2, duration);
    }, [activeOpacity, setOpacityTo]);
    var setOpacityInactive = (0, react_1.useCallback)(function (duration) {
        setOpacityTo(null, duration);
    }, [setOpacityTo]);
    var pressConfig = (0, react_1.useMemo)(function () { return ({
        cancelable: !rejectResponderTermination,
        disabled: disabled,
        delayLongPress: delayLongPress,
        delayPressStart: delayPressIn,
        delayPressEnd: delayPressOut,
        onLongPress: onLongPress,
        onPress: onPress,
        onPressStart: function (event) {
            var isGrant = event.dispatchConfig != null
                ? event.dispatchConfig.registrationName === 'onResponderGrant'
                : event.type === 'keydown';
            setOpacityActive(isGrant ? 0 : 150);
            if (onPressIn != null) {
                onPressIn(event);
            }
        },
        onPressEnd: function (event) {
            setOpacityInactive(250);
            if (onPressOut != null) {
                onPressOut(event);
            }
        },
    }); }, [
        delayLongPress,
        delayPressIn,
        delayPressOut,
        disabled,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        rejectResponderTermination,
        setOpacityActive,
        setOpacityInactive,
    ]);
    var pressEventHandlers = (0, react_native_web_internals_1.usePressEvents)(hostRef, pressConfig);
    return ((0, jsx_runtime_1.jsx)(View_1.View, __assign({}, rest, pressEventHandlers, { accessibilityDisabled: disabled, focusable: !disabled && focusable !== false, ref: setRef, style: [
            styles.root,
            !disabled && styles.actionable,
            style,
            opacityOverride != null && { opacity: opacityOverride },
            { transitionDuration: duration },
        ] })));
}
var styles = react_native_web_internals_1.StyleSheet.create({
    root: {
        transitionProperty: 'opacity',
        transitionDuration: '0.15s',
        userSelect: 'none',
    },
    actionable: {
        cursor: 'pointer',
        touchAction: 'manipulation',
    },
});
exports.TouchableOpacity = React.memo(React.forwardRef(TouchableOpacityImpl));
exports.TouchableOpacity.displayName = 'TouchableOpacity';
// compat
// @ts-ignore
exports.TouchableOpacity.Mixin = {};
