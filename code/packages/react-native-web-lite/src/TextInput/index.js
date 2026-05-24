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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = void 0;
var React = require("react");
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var react_native_web_internals_2 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../createElement/index");
/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */
var isSelectionStale = function (node, selection) {
    var selectionEnd = node.selectionEnd, selectionStart = node.selectionStart;
    var start = selection.start, end = selection.end;
    return start !== selectionStart || end !== selectionEnd;
};
/**
 * Certain input types do no support 'selectSelectionRange' and will throw an
 * error.
 */
var setSelection = function (node, selection) {
    if (isSelectionStale(node, selection)) {
        var start = selection.start, end = selection.end;
        try {
            node.setSelectionRange(start, end || start);
        }
        catch (e) { }
    }
};
var forwardPropsList = Object.assign({}, react_native_web_internals_2.forwardedProps.defaultProps, react_native_web_internals_2.forwardedProps.accessibilityProps, react_native_web_internals_2.forwardedProps.clickProps, react_native_web_internals_2.forwardedProps.focusProps, react_native_web_internals_2.forwardedProps.keyboardProps, react_native_web_internals_2.forwardedProps.mouseProps, react_native_web_internals_2.forwardedProps.touchProps, react_native_web_internals_2.forwardedProps.styleProps, {
    autoCapitalize: true,
    className: true,
    autoComplete: true,
    autoCorrect: true,
    autoFocus: true,
    defaultValue: true,
    disabled: true,
    lang: true,
    maxLength: true,
    onChange: true,
    onScroll: true,
    placeholder: true,
    pointerEvents: true,
    readOnly: true,
    rows: true,
    spellCheck: true,
    value: true,
    type: true,
});
var pickProps = function (props) { return (0, react_native_web_internals_2.pick)(props, forwardPropsList); };
var useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
// If an Input Method Editor is processing key input, the 'keyCode' is 229.
// https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
function isEventComposing(nativeEvent) {
    return nativeEvent.isComposing || nativeEvent.keyCode === 229;
}
var focusTimeout = null;
var TextInput = React.forwardRef(function (props, forwardedRef) {
    var _a = props.autoCapitalize, autoCapitalize = _a === void 0 ? 'sentences' : _a, autoComplete = props.autoComplete, autoCompleteType = props.autoCompleteType, _b = props.autoCorrect, autoCorrect = _b === void 0 ? true : _b, blurOnSubmit = props.blurOnSubmit, clearTextOnFocus = props.clearTextOnFocus, dir = props.dir, editable = props.editable, enterKeyHint = props.enterKeyHint, _c = props.inputMode, inputMode = _c === void 0 ? 'text' : _c, keyboardType = props.keyboardType, _d = props.multiline, multiline = _d === void 0 ? false : _d, numberOfLines = props.numberOfLines, onBlur = props.onBlur, onChange = props.onChange, onChangeText = props.onChangeText, onContentSizeChange = props.onContentSizeChange, onFocus = props.onFocus, onKeyPress = props.onKeyPress, onLayout = props.onLayout, onMoveShouldSetResponder = props.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture, onResponderEnd = props.onResponderEnd, onResponderGrant = props.onResponderGrant, onResponderMove = props.onResponderMove, onResponderReject = props.onResponderReject, onResponderRelease = props.onResponderRelease, onResponderStart = props.onResponderStart, onResponderTerminate = props.onResponderTerminate, onResponderTerminationRequest = props.onResponderTerminationRequest, onScrollShouldSetResponder = props.onScrollShouldSetResponder, onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture, onSelectionChange = props.onSelectionChange, onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder = props.onStartShouldSetResponder, onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture, onSubmitEditing = props.onSubmitEditing, placeholderTextColor = props.placeholderTextColor, _e = props.readOnly, readOnly = _e === void 0 ? false : _e, returnKeyType = props.returnKeyType, _f = props.rows, rows = _f === void 0 ? 1 : _f, _g = props.secureTextEntry, secureTextEntry = _g === void 0 ? false : _g, selection = props.selection, selectTextOnFocus = props.selectTextOnFocus, showSoftInputOnFocus = props.showSoftInputOnFocus, caretHidden = props.caretHidden, spellCheck = props.spellCheck;
    var type;
    var _inputMode;
    if (inputMode != null) {
        _inputMode = inputMode;
        if (inputMode === 'email') {
            type = 'email';
        }
        else if (inputMode === 'tel') {
            type = 'tel';
        }
        else if (inputMode === 'search') {
            type = 'search';
        }
        else if (inputMode === 'url') {
            type = 'url';
        }
        else {
            type = 'text';
        }
    }
    else if (keyboardType != null) {
        warn('keyboardType', 'keyboardType is deprecated. Use inputMode.');
        switch (keyboardType) {
            case 'email-address':
                type = 'email';
                break;
            case 'number-pad':
            case 'numeric':
                _inputMode = 'numeric';
                break;
            case 'decimal-pad':
                _inputMode = 'decimal';
                break;
            case 'phone-pad':
                type = 'tel';
                break;
            case 'search':
            case 'web-search':
                type = 'search';
                break;
            case 'url':
                type = 'url';
                break;
            default:
                type = 'text';
        }
    }
    if (secureTextEntry) {
        type = 'password';
    }
    var dimensions = React.useRef({ height: null, width: null });
    var hostRef = React.useRef(null);
    var handleContentSizeChange = React.useCallback(function (hostNode) {
        if (multiline && onContentSizeChange && hostNode != null) {
            var newHeight = hostNode.scrollHeight;
            var newWidth = hostNode.scrollWidth;
            if (newHeight !== dimensions.current.height ||
                newWidth !== dimensions.current.width) {
                dimensions.current.height = newHeight;
                dimensions.current.width = newWidth;
                onContentSizeChange({
                    nativeEvent: {
                        contentSize: {
                            height: dimensions.current.height,
                            width: dimensions.current.width,
                        },
                    },
                });
            }
        }
    }, [multiline, onContentSizeChange]);
    var imperativeRef = React.useMemo(function () { return function (hostNode) {
        // TextInput needs to add more methods to the hostNode in addition to those
        // added by `usePlatformMethods`. This is temporarily until an API like
        // `TextInput.clear(hostRef)` is added to React Native.
        if (hostNode != null) {
            hostNode.clear = function () {
                if (hostNode != null) {
                    hostNode.value = '';
                }
            };
            hostNode.isFocused = function () {
                return hostNode != null && react_native_web_internals_2.TextInputState.currentlyFocusedField() === hostNode;
            };
            handleContentSizeChange(hostNode);
        }
    }; }, [handleContentSizeChange]);
    function handleBlur(e) {
        react_native_web_internals_2.TextInputState._currentlyFocusedNode = null;
        if (onBlur) {
            e.nativeEvent.text = e.target.value;
            onBlur(e);
        }
    }
    function handleChange(e) {
        var hostNode = e.target;
        var text = hostNode.value;
        e.nativeEvent.text = text;
        handleContentSizeChange(hostNode);
        if (onChange) {
            onChange(e);
        }
        if (onChangeText) {
            onChangeText(text);
        }
    }
    function handleFocus(e) {
        var hostNode = e.target;
        if (onFocus) {
            e.nativeEvent.text = hostNode.value;
            onFocus(e);
        }
        if (hostNode != null) {
            react_native_web_internals_2.TextInputState._currentlyFocusedNode = hostNode;
            if (clearTextOnFocus) {
                hostNode.value = '';
            }
            if (selectTextOnFocus) {
                // Safari requires selection to occur in a setTimeout
                if (focusTimeout != null) {
                    clearTimeout(focusTimeout);
                }
                //@ts-ignore
                focusTimeout = setTimeout(function () {
                    if (hostNode != null) {
                        hostNode.select();
                    }
                }, 0);
            }
        }
    }
    function handleKeyDown(e) {
        var hostNode = e.target;
        // Prevent key events bubbling (see #612)
        e.stopPropagation();
        var blurOnSubmitDefault = !multiline;
        var shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit;
        var nativeEvent = e.nativeEvent;
        var isComposing = isEventComposing(nativeEvent);
        if (onKeyPress) {
            onKeyPress(e);
        }
        if (e.key === 'Enter' &&
            !e.shiftKey &&
            // Do not call submit if composition is occuring.
            !isComposing &&
            !e.isDefaultPrevented()) {
            if ((blurOnSubmit || !multiline) && onSubmitEditing) {
                // prevent "Enter" from inserting a newline or submitting a form
                e.preventDefault();
                nativeEvent.text = e.target.value;
                onSubmitEditing(e);
            }
            if (shouldBlurOnSubmit && hostNode != null) {
                setTimeout(function () { return hostNode.blur(); }, 0);
            }
        }
    }
    function handleSelectionChange(e) {
        if (onSelectionChange) {
            try {
                var node = e.target;
                var selectionStart = node.selectionStart, selectionEnd = node.selectionEnd;
                e.nativeEvent.selection = {
                    start: selectionStart,
                    end: selectionEnd,
                };
                e.nativeEvent.text = e.target.value;
                onSelectionChange(e);
            }
            catch (e) { }
        }
    }
    useIsomorphicLayoutEffect(function () {
        var node = hostRef.current;
        if (node != null && selection != null) {
            setSelection(node, selection);
        }
        if (document.activeElement === node) {
            react_native_web_internals_2.TextInputState._currentlyFocusedNode = node;
        }
    }, [hostRef, selection]);
    var component = multiline ? 'textarea' : 'input';
    (0, react_native_web_internals_2.useElementLayout)(hostRef, onLayout);
    (0, react_native_web_internals_2.useResponderEvents)(hostRef, {
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
    var contextDirection = (0, react_native_web_internals_2.useLocaleContext)().direction;
    var supportedProps = pickProps(props);
    supportedProps.autoCapitalize = autoCapitalize;
    supportedProps.autoComplete = autoComplete || autoCompleteType || 'on';
    supportedProps.autoCorrect = autoCorrect ? 'on' : 'off';
    // 'auto' by default allows browsers to infer writing direction
    supportedProps.dir = dir !== undefined ? dir : 'auto';
    if (returnKeyType != null) {
        warn('returnKeyType', 'returnKeyType is deprecated. Use enterKeyHint.');
    }
    supportedProps.enterKeyHint = enterKeyHint || returnKeyType;
    supportedProps.inputMode = _inputMode;
    supportedProps.onBlur = handleBlur;
    supportedProps.onChange = handleChange;
    supportedProps.onFocus = handleFocus;
    supportedProps.onKeyDown = handleKeyDown;
    supportedProps.onSelect = handleSelectionChange;
    if (editable != null) {
        warn('editable', 'editable is deprecated. Use readOnly.');
    }
    supportedProps.readOnly = readOnly === true || editable === false;
    if (numberOfLines != null) {
        warn('numberOfLines', 'TextInput numberOfLines is deprecated. Use rows.');
    }
    supportedProps.rows = multiline ? (rows != null ? rows : numberOfLines) : 1;
    supportedProps.spellCheck = spellCheck != null ? spellCheck : autoCorrect;
    supportedProps.style = [
        { '--placeholderTextColor': placeholderTextColor },
        styles.textinput$raw,
        styles.placeholder,
        props.style,
        caretHidden && styles.caretHidden,
    ];
    supportedProps.type = multiline ? undefined : type;
    supportedProps.virtualkeyboardpolicy =
        showSoftInputOnFocus === false ? 'manual' : 'auto';
    var platformMethodsRef = (0, react_native_web_internals_2.usePlatformMethods)(supportedProps);
    var setRef = (0, react_native_web_internals_2.useMergeRefs)(hostRef, platformMethodsRef, imperativeRef, forwardedRef);
    supportedProps.ref = setRef;
    var langDirection = props.lang != null ? (0, react_native_web_internals_2.getLocaleDirection)(props.lang) : null;
    var componentDirection = props.dir || langDirection;
    var writingDirection = componentDirection || contextDirection;
    var element = (0, index_1.useCreateElement)(component, supportedProps, {
        writingDirection: writingDirection,
    });
    return element;
});
exports.TextInput = TextInput;
function warn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'production') {
        console.warn.apply(console, args);
    }
}
TextInput.displayName = 'TextInput';
//@ts-ignore
TextInput.State = react_native_web_internals_2.TextInputState;
var styles = react_native_web_internals_1.StyleSheet.create({
    textinput$raw: {
        MozAppearance: 'textfield',
        WebkitAppearance: 'none',
        appearance: 'none',
    },
    placeholder: {
        placeholderTextColor: 'var(--placeholderTextColor)',
    },
    caretHidden: {
        caretColor: 'transparent',
    },
});
exports.default = TextInput;
