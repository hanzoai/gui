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
exports.useToastInteractiveContext = exports.ToastImplFrame = exports.ToastImpl = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var animate_presence_1 = require("@hanzogui/animate-presence");
var compose_refs_1 = require("@hanzogui/compose-refs");
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var dismissable_1 = require("@hanzogui/dismissable");
var helpers_1 = require("@hanzogui/helpers");
var portal_1 = require("@hanzogui/portal");
var stacks_1 = require("@hanzogui/stacks");
var React = require("react");
// Lazy load PanResponder only on native to avoid SSR issues
var getPanResponder = function () {
    if (process.env.TAMAGUI_TARGET === 'native') {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('react-native').PanResponder;
    }
    return null;
};
var constants_2 = require("./constants");
var ToastAnnounce_1 = require("./ToastAnnounce");
var ToastProvider_1 = require("./ToastProvider");
var ToastViewport_1 = require("./ToastViewport");
var ToastImplFrame = (0, core_1.styled)(stacks_1.YStack, {
    name: 'ToastImpl',
    tabIndex: 0,
    variants: {
        unstyled: {
            false: {
                focusStyle: {
                    outlineStyle: 'solid',
                    outlineWidth: 2,
                    outlineColor: '$outlineColor',
                },
                backgroundColor: '$color6',
                borderRadius: '$4',
                paddingHorizontal: '$4',
                paddingVertical: '$3',
                marginHorizontal: 'auto',
                marginVertical: '$1',
                elevation: '$3',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
exports.ToastImplFrame = ToastImplFrame;
var _a = (0, core_1.createStyledContext)({
    onClose: function () { },
}), ToastInteractiveProvider = _a.Provider, useToastInteractiveContext = _a.useStyledContext;
exports.useToastInteractiveContext = useToastInteractiveContext;
var ToastImpl = React.forwardRef(function (props, forwardedRef) {
    var _a, _b;
    var scope = props.scope, _c = props.type, type = _c === void 0 ? 'foreground' : _c, durationProp = props.duration, open = props.open, onClose = props.onClose, onEscapeKeyDown = props.onEscapeKeyDown, onPause = props.onPause, onResume = props.onResume, onSwipeStart = props.onSwipeStart, onSwipeMove = props.onSwipeMove, onSwipeCancel = props.onSwipeCancel, onSwipeEnd = props.onSwipeEnd, _d = props.viewportName, viewportName = _d === void 0 ? 'default' : _d, toastProps = __rest(props, ["scope", "type", "duration", "open", "onClose", "onEscapeKeyDown", "onPause", "onResume", "onSwipeStart", "onSwipeMove", "onSwipeCancel", "onSwipeEnd", "viewportName"]);
    var isPresent = (0, animate_presence_1.useIsPresent)();
    var context = (0, ToastProvider_1.useToastProviderContext)(scope);
    var _e = React.useState(null), node = _e[0], setNode = _e[1];
    var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, setNode);
    var duration = durationProp || context.duration;
    var closeTimerStartTimeRef = React.useRef(0);
    var closeTimerRemainingTimeRef = React.useRef(duration);
    var closeTimerRef = React.useRef(0);
    var onToastAdd = context.onToastAdd, onToastRemove = context.onToastRemove;
    var viewport = React.useMemo(function () {
        return context.viewports[viewportName];
    }, [context.viewports, viewportName]);
    var handleClose = (0, core_1.useEvent)(function () {
        if (!isPresent) {
            // already removed from the react tree
            return;
        }
        // focus viewport if focus is within toast to read the remaining toast
        // count to SR users and ensure focus isn't lost
        if (constants_1.isWeb) {
            var isFocusInToast = node === null || node === void 0 ? void 0 : node.contains(document.activeElement);
            if (isFocusInToast)
                viewport === null || viewport === void 0 ? void 0 : viewport.focus();
        }
        onClose();
    });
    var startTimer = React.useCallback(function (duration) {
        if (!duration || duration === Number.POSITIVE_INFINITY)
            return;
        clearTimeout(closeTimerRef.current);
        closeTimerStartTimeRef.current = new Date().getTime();
        closeTimerRef.current = setTimeout(handleClose, duration);
    }, [handleClose]);
    var handleResume = React.useCallback(function () {
        startTimer(closeTimerRemainingTimeRef.current);
        onResume === null || onResume === void 0 ? void 0 : onResume();
    }, [onResume, startTimer]);
    var handlePause = React.useCallback(function () {
        var elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current;
        closeTimerRemainingTimeRef.current =
            closeTimerRemainingTimeRef.current - elapsedTime;
        window.clearTimeout(closeTimerRef.current);
        onPause === null || onPause === void 0 ? void 0 : onPause();
    }, [onPause]);
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        if (viewport) {
            viewport.addEventListener(ToastViewport_1.VIEWPORT_PAUSE, handlePause);
            viewport.addEventListener(ToastViewport_1.VIEWPORT_RESUME, handleResume);
            return function () {
                viewport.removeEventListener(ToastViewport_1.VIEWPORT_PAUSE, handlePause);
                viewport.removeEventListener(ToastViewport_1.VIEWPORT_RESUME, handleResume);
            };
        }
    }, [viewport, duration, onPause, onResume, startTimer]);
    // start timer when toast opens or duration changes.
    // we include `open` in deps because closed !== unmounted when animating
    // so it could reopen before being completely unmounted
    React.useEffect(function () {
        if (open && !context.isClosePausedRef.current) {
            startTimer(duration);
        }
    }, [open, duration, context.isClosePausedRef, startTimer]);
    React.useEffect(function () {
        onToastAdd();
        return function () { return onToastRemove(); };
    }, [onToastAdd, onToastRemove]);
    var announceTextContent = React.useMemo(function () {
        if (!constants_1.isWeb)
            return null;
        return node ? getAnnounceTextContent(node) : null;
    }, [node]);
    var isHorizontalSwipe = ['left', 'right', 'horizontal'].includes(context.swipeDirection);
    var animationDriver = (0, core_1.useConfiguration)().animationDriver;
    if (!animationDriver) {
        throw new Error('Must set animations in hanzogui.config.ts');
    }
    var useAnimatedNumber = animationDriver.useAnimatedNumber, useAnimatedNumberStyle = animationDriver.useAnimatedNumberStyle;
    var animatedNumber = useAnimatedNumber(0);
    // temp until reanimated useAnimatedNumber fix
    var AnimatedView = ((_b = (_a = animationDriver['NumberView']) !== null && _a !== void 0 ? _a : animationDriver.View) !== null && _b !== void 0 ? _b : core_1.View);
    var animatedStyles = useAnimatedNumberStyle(animatedNumber, function (val) {
        'worklet';
        return {
            transform: [isHorizontalSwipe ? { translateX: val } : { translateY: val }],
        };
    });
    var panResponder = React.useMemo(function () {
        var PanResponder = getPanResponder();
        if (!PanResponder)
            return null;
        return PanResponder.create({
            onMoveShouldSetPanResponder: function (e, gesture) {
                var shouldMove = shouldGrantGestureMove(context.swipeDirection, gesture);
                if (shouldMove) {
                    onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart(e);
                    return true;
                }
                return false;
            },
            onPanResponderGrant: function (e) {
                if (!constants_1.isWeb) {
                    handlePause === null || handlePause === void 0 ? void 0 : handlePause();
                }
            },
            onPanResponderMove: function (e, gesture) {
                var _a = getGestureDistance(context.swipeDirection, gesture), x = _a.x, y = _a.y;
                var delta = { x: x, y: y };
                animatedNumber.setValue(isHorizontalSwipe ? x : y, { type: 'direct' });
                if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) {
                    onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd(e);
                }
                onSwipeMove === null || onSwipeMove === void 0 ? void 0 : onSwipeMove(e);
            },
            onPanResponderEnd: function (e, _a) {
                var dx = _a.dx, dy = _a.dy;
                if (!isDeltaInDirection({ x: dx, y: dy }, context.swipeDirection, context.swipeThreshold)) {
                    if (!constants_1.isWeb) {
                        handleResume === null || handleResume === void 0 ? void 0 : handleResume();
                    }
                    onSwipeCancel === null || onSwipeCancel === void 0 ? void 0 : onSwipeCancel(e);
                    animatedNumber.setValue(0, { type: 'spring' });
                }
            },
        });
    }, [handlePause, handleResume]);
    // need to get the theme name from context and apply it again since portals don't retain the theme
    var themeName = (0, core_1.useThemeName)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [announceTextContent && ((0, jsx_runtime_1.jsx)(ToastAnnounce_1.ToastAnnounce, { scope: scope, 
                // Toasts are always role=status to avoid stuttering issues with role=alert in SRs.
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role: "status", "aria-live": type === 'foreground' ? 'assertive' : 'polite', "aria-atomic": true, children: announceTextContent })), (0, jsx_runtime_1.jsx)(portal_1.PortalItem, { hostName: viewportName !== null && viewportName !== void 0 ? viewportName : 'default', children: (0, jsx_runtime_1.jsx)(ToastInteractiveProvider, { scope: scope, onClose: function () {
                        handleClose();
                    }, children: (0, jsx_runtime_1.jsx)(dismissable_1.Dismissable
                    // asChild
                    , { 
                        // asChild
                        onEscapeKeyDown: (0, helpers_1.composeEventHandlers)(onEscapeKeyDown, function () {
                            if (!context.isFocusedToastEscapeKeyDownRef.current) {
                                handleClose();
                            }
                            context.isFocusedToastEscapeKeyDownRef.current = false;
                        }), children: (0, jsx_runtime_1.jsx)(core_1.Theme, { contain: true, forceClassName: true, name: themeName, children: (0, jsx_runtime_1.jsx)(AnimatedView, __assign({}, panResponder === null || panResponder === void 0 ? void 0 : panResponder.panHandlers, { style: [{ margin: 'auto' }, animatedStyles], children: (0, jsx_runtime_1.jsx)(ToastProvider_1.Collection.ItemSlot, { scope: context.toastScope, children: (0, jsx_runtime_1.jsx)(ToastImplFrame
                                    // Ensure toasts are announced as status list or status when focused
                                    , __assign({ 
                                        // Ensure toasts are announced as status list or status when focused
                                        role: "status", "aria-live": "off", "aria-atomic": true, "data-state": open ? 'open' : 'closed', "data-swipe-direction": context.swipeDirection, pointerEvents: "auto", "$platform-web": {
                                            touchAction: 'none',
                                            userSelect: 'none',
                                        } }, toastProps, { ref: composedRefs }, (constants_1.isWeb && {
                                        onKeyDown: (0, helpers_1.composeEventHandlers)(props.onKeyDown, function (event) {
                                            if (event.key !== 'Escape')
                                                return;
                                            onEscapeKeyDown === null || onEscapeKeyDown === void 0 ? void 0 : onEscapeKeyDown(event);
                                            if (!event.defaultPrevented) {
                                                context.isFocusedToastEscapeKeyDownRef.current = true;
                                                handleClose();
                                            }
                                        }),
                                    }))) }) })) }) }) }, props.id) })] }));
});
exports.ToastImpl = ToastImpl;
ToastImpl.propTypes = {
    type: function (props) {
        if (props.type && !['foreground', 'background'].includes(props.type)) {
            var error = "Invalid prop `type` supplied to `".concat(constants_2.TOAST_NAME, "`. Expected `foreground | background`.");
            return new Error(error);
        }
        return null;
    },
};
/* ---------------------------------------------------------------------------------------------- */
var isDeltaInDirection = function (delta, direction, threshold) {
    if (threshold === void 0) { threshold = 0; }
    var deltaX = Math.abs(delta.x);
    var deltaY = Math.abs(delta.y);
    var isDeltaX = deltaX > deltaY;
    if (direction === 'left' || direction === 'right' || direction === 'horizontal') {
        return isDeltaX && deltaX > threshold;
    }
    return !isDeltaX && deltaY > threshold;
};
function getAnnounceTextContent(container) {
    if (!constants_1.isWeb)
        return '';
    var textContent = [];
    var childNodes = Array.from(container.childNodes);
    childNodes.forEach(function (node) {
        if (node.nodeType === node.TEXT_NODE && node.textContent)
            textContent.push(node.textContent);
        if (isHTMLElement(node)) {
            var isHidden = node.ariaHidden || node.hidden || node.style.display === 'none';
            var isExcluded = node.dataset.toastAnnounceExclude === '';
            if (!isHidden) {
                if (isExcluded) {
                    var altText = node.dataset.toastAnnounceAlt;
                    if (altText)
                        textContent.push(altText);
                }
                else {
                    textContent.push.apply(textContent, getAnnounceTextContent(node));
                }
            }
        }
    });
    // We return a collection of text rather than a single concatenated string.
    // This allows SR VO to naturally pause break between nodes while announcing.
    return textContent;
}
function isHTMLElement(node) {
    return node.nodeType === node.ELEMENT_NODE;
}
var GESTURE_GRANT_THRESHOLD = 10;
var shouldGrantGestureMove = function (dir, _a) {
    var dx = _a.dx, dy = _a.dy;
    if ((dir === 'horizontal' || dir === 'left') && dx < -GESTURE_GRANT_THRESHOLD) {
        return true;
    }
    if ((dir === 'horizontal' || dir === 'right') && dx > GESTURE_GRANT_THRESHOLD) {
        return true;
    }
    if ((dir === 'vertical' || dir === 'up') && dy > -GESTURE_GRANT_THRESHOLD) {
        return true;
    }
    if ((dir === 'vertical' || dir === 'down') && dy < GESTURE_GRANT_THRESHOLD) {
        return true;
    }
    return false;
};
var getGestureDistance = function (dir, _a) {
    var dx = _a.dx, dy = _a.dy;
    var y = 0;
    var x = 0;
    if (dir === 'horizontal')
        x = dx;
    else if (dir === 'left')
        x = Math.min(0, dx);
    else if (dir === 'right')
        x = Math.max(0, dx);
    else if (dir === 'vertical')
        y = dy;
    else if (dir === 'up')
        y = Math.min(0, dy);
    else if (dir === 'down')
        y = Math.max(0, dy);
    return {
        x: x,
        y: y,
    };
};
