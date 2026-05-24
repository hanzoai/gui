/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
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
exports.Pressable = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_use_pressable_1 = require("@hanzogui/react-native-use-pressable");
var React = require("react");
var react_1 = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var react_native_web_internals_2 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../View/index");
/**
 * Component used to build display components that should respond to whether the
 * component is currently pressed or not.
 */
function Pressable(props, forwardedRef) {
    var children = props.children, delayLongPress = props.delayLongPress, delayPressIn = props.delayPressIn, delayPressOut = props.delayPressOut, disabled = props.disabled, focusable = props.focusable, onBlur = props.onBlur, onContextMenu = props.onContextMenu, onFocus = props.onFocus, onHoverIn = props.onHoverIn, onHoverOut = props.onHoverOut, onKeyDown = props.onKeyDown, onLongPress = props.onLongPress, onPress = props.onPress, onPressMove = props.onPressMove, onPressIn = props.onPressIn, onPressOut = props.onPressOut, style = props.style, testOnly_hovered = props.testOnly_hovered, testOnly_pressed = props.testOnly_pressed, rest = __rest(props, ["children", "delayLongPress", "delayPressIn", "delayPressOut", "disabled", "focusable", "onBlur", "onContextMenu", "onFocus", "onHoverIn", "onHoverOut", "onKeyDown", "onLongPress", "onPress", "onPressMove", "onPressIn", "onPressOut", "style", "testOnly_hovered", "testOnly_pressed"]);
    var _a = useForceableState(testOnly_hovered === true), hovered = _a[0], setHovered = _a[1];
    var _b = useForceableState(false), focused = _b[0], setFocused = _b[1];
    var _c = useForceableState(testOnly_pressed === true), pressed = _c[0], setPressed = _c[1];
    var hostRef = (0, react_1.useRef)(null);
    var setRef = (0, react_native_web_internals_2.useMergeRefs)(forwardedRef, hostRef);
    var pressConfig = (0, react_1.useMemo)(function () { return ({
        delayLongPress: delayLongPress,
        delayPressStart: delayPressIn,
        delayPressEnd: delayPressOut,
        disabled: disabled,
        onLongPress: onLongPress,
        onPress: onPress,
        onPressChange: setPressed,
        onPressStart: onPressIn,
        onPressMove: onPressMove,
        onPressEnd: onPressOut,
    }); }, [
        delayLongPress,
        delayPressIn,
        delayPressOut,
        disabled,
        onLongPress,
        onPress,
        onPressIn,
        onPressMove,
        onPressOut,
        setPressed,
    ]);
    var pressEventHandlers = (0, react_native_use_pressable_1.usePressEvents)(hostRef, pressConfig);
    var onContextMenuPress = pressEventHandlers.onContextMenu, onKeyDownPress = pressEventHandlers.onKeyDown;
    (0, react_native_web_internals_2.useHover)(hostRef, {
        contain: true,
        disabled: disabled,
        onHoverChange: setHovered,
        onHoverStart: onHoverIn,
        onHoverEnd: onHoverOut,
    });
    var interactionState = { hovered: hovered, focused: focused, pressed: pressed };
    var blurHandler = React.useCallback(function (e) {
        if (disabled) {
            return;
        }
        if (e.nativeEvent.target === hostRef.current) {
            setFocused(false);
            if (onBlur != null) {
                onBlur(e);
            }
        }
    }, [disabled, hostRef, setFocused, onBlur]);
    var focusHandler = React.useCallback(function (e) {
        if (disabled) {
            return;
        }
        if (e.nativeEvent.target === hostRef.current) {
            setFocused(true);
            if (onFocus != null) {
                onFocus(e);
            }
        }
    }, [disabled, hostRef, setFocused, onFocus]);
    var contextMenuHandler = React.useCallback(function (e) {
        if (onContextMenuPress != null) {
            onContextMenuPress(e);
        }
        if (onContextMenu != null) {
            onContextMenu(e);
        }
    }, [onContextMenu, onContextMenuPress]);
    var keyDownHandler = React.useCallback(function (e) {
        if (onKeyDownPress != null) {
            onKeyDownPress(e);
        }
        if (onKeyDown != null) {
            onKeyDown(e);
        }
    }, [onKeyDown, onKeyDownPress]);
    return ((0, jsx_runtime_1.jsx)(index_1.View, __assign({}, rest, pressEventHandlers, { accessibilityDisabled: disabled, focusable: !disabled && focusable !== false, onBlur: blurHandler, onContextMenu: contextMenuHandler, onFocus: focusHandler, onKeyDown: keyDownHandler, pointerEvents: disabled ? 'none' : rest.pointerEvents, ref: setRef, style: [
            !disabled && styles.root,
            typeof style === 'function' ? style(interactionState) : style,
        ], children: typeof children === 'function' ? children(interactionState) : children })));
}
function useForceableState(forced) {
    var _a = (0, react_1.useState)(false), bool = _a[0], setBool = _a[1];
    return [bool || forced, setBool];
}
var styles = react_native_web_internals_1.StyleSheet.create({
    root: {
        cursor: 'pointer',
        touchAction: 'manipulation',
    },
});
var PressableComponent = (0, react_1.memo)((0, react_1.forwardRef)(Pressable));
exports.Pressable = PressableComponent;
PressableComponent.displayName = 'Pressable';
exports.default = PressableComponent;
