"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchableWithoutFeedback = void 0;
var React = require("react");
var react_1 = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var forwardPropsList = {
    accessibilityDisabled: true,
    accessibilityLabel: true,
    accessibilityLiveRegion: true,
    accessibilityRole: true,
    accessibilityState: true,
    accessibilityValue: true,
    children: true,
    disabled: true,
    focusable: true,
    nativeID: true,
    onBlur: true,
    onFocus: true,
    onLayout: true,
    testID: true,
};
var pickProps = function (props) { return (0, react_native_web_internals_1.pick)(props, forwardPropsList); };
function TouchableWithoutFeedbackImpl(props, forwardedRef) {
    var delayPressIn = props.delayPressIn, delayPressOut = props.delayPressOut, delayLongPress = props.delayLongPress, disabled = props.disabled, focusable = props.focusable, onLongPress = props.onLongPress, onPress = props.onPress, onPressIn = props.onPressIn, onPressOut = props.onPressOut, rejectResponderTermination = props.rejectResponderTermination;
    var hostRef = (0, react_1.useRef)(null);
    var pressConfig = (0, react_1.useMemo)(function () { return ({
        cancelable: !rejectResponderTermination,
        disabled: disabled,
        delayLongPress: delayLongPress,
        delayPressStart: delayPressIn,
        delayPressEnd: delayPressOut,
        onLongPress: onLongPress,
        onPress: onPress,
        onPressStart: onPressIn,
        onPressEnd: onPressOut,
    }); }, [
        disabled,
        delayPressIn,
        delayPressOut,
        delayLongPress,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        rejectResponderTermination,
    ]);
    var pressEventHandlers = (0, react_native_web_internals_1.usePressEvents)(hostRef, pressConfig);
    var element = React.Children.only(props.children);
    var children = [element.props.children];
    var supportedProps = pickProps(props);
    // @ts-ignore
    supportedProps.accessibilityDisabled = disabled;
    // @ts-ignore
    supportedProps.focusable = !disabled && focusable !== false;
    // @ts-ignore
    supportedProps.ref = (0, react_native_web_internals_1.useMergeRefs)(forwardedRef, hostRef, element.ref);
    var elementProps = Object.assign(supportedProps, pressEventHandlers);
    return React.cloneElement.apply(React, __spreadArray([element, elementProps], children, false));
}
exports.TouchableWithoutFeedback = React.memo(React.forwardRef(TouchableWithoutFeedbackImpl));
exports.TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback';
