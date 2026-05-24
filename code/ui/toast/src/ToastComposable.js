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
exports.Toast = void 0;
exports.useToasts = useToasts;
exports.useToastItem = useToastItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var animate_presence_1 = require("@hanzogui/animate-presence");
var constants_1 = require("@hanzogui/constants");
var native_1 = require("@hanzogui/native");
var core_1 = require("@hanzogui/core");
var helpers_1 = require("@hanzogui/helpers");
var portal_1 = require("@hanzogui/portal");
var stacks_1 = require("@hanzogui/stacks");
var text_1 = require("@hanzogui/text");
var React = require("react");
var ToastState_1 = require("./ToastState");
var dispatchNativeToast_1 = require("./dispatchNativeToast");
var useAnimatedDragGesture_1 = require("./useAnimatedDragGesture");
var useToastAnimations_1 = require("./useToastAnimations");
var useReducedMotion_1 = require("./useReducedMotion");
var ToastItemFrame_1 = require("./ToastItemFrame");
// defaults
var VISIBLE_TOASTS_AMOUNT = 4;
var VIEWPORT_OFFSET = 16;
var TOAST_GAP = 14;
var TOAST_LIFETIME = 4000;
var FIXED_TOAST_HEIGHT = 72;
var TIME_BEFORE_UNMOUNT = 200;
var DEFAULT_HOTKEY = ['altKey', 'KeyT'];
var ToastContext = (0, core_1.createStyledContext)({}, 'Toast__');
var useToastContext = ToastContext.useStyledContext;
var ToastItemContext = React.createContext(null);
function useToastItemContext() {
    var ctx = React.useContext(ToastItemContext);
    if (!ctx) {
        throw new Error('useToastItemContext must be used within Toast.Item or Toast.List');
    }
    return ctx;
}
function resolveSwipeDirection(direction, position) {
    if (direction !== 'auto')
        return direction;
    var _a = position.split('-'), yPosition = _a[0], xPosition = _a[1];
    if (!constants_1.isWeb) {
        // on native, always use vertical swipe to avoid conflicting with
        // iOS/Android navigation back gesture (horizontal edge swipe)
        return yPosition === 'top' ? 'up' : 'down';
    }
    if (xPosition === 'left')
        return 'left';
    if (xPosition === 'right')
        return 'right';
    // center positions: horizontal swipe feels most natural
    return 'horizontal';
}
var ToastRoot = React.forwardRef(function ToastRoot(props, _ref) {
    var children = props.children, _a = props.position, position = _a === void 0 ? 'bottom-right' : _a, _b = props.duration, duration = _b === void 0 ? TOAST_LIFETIME : _b, _c = props.gap, gap = _c === void 0 ? TOAST_GAP : _c, _d = props.visibleToasts, visibleToasts = _d === void 0 ? VISIBLE_TOASTS_AMOUNT : _d, _e = props.swipeDirection, swipeDirectionProp = _e === void 0 ? 'auto' : _e, _f = props.swipeThreshold, swipeThreshold = _f === void 0 ? 50 : _f, _g = props.toastHeight, toastHeight = _g === void 0 ? FIXED_TOAST_HEIGHT : _g, _h = props.closeButton, closeButton = _h === void 0 ? false : _h, _j = props.expand, expand = _j === void 0 ? false : _j, themeProp = props.theme, reducedMotionProp = props.reducedMotion, _k = props.native, native = _k === void 0 ? false : _k, burntOptions = props.burntOptions, notificationOptions = props.notificationOptions, icons = props.icons;
    var reducedMotion = (0, useReducedMotion_1.useReducedMotion)(reducedMotionProp);
    var _l = React.useState([]), toasts = _l[0], setToasts = _l[1];
    var _m = React.useState({}), heights = _m[0], setHeights = _m[1];
    var _o = React.useState(false), localExpanded = _o[0], setExpanded = _o[1];
    var expanded = expand || localExpanded;
    var _p = React.useState(false), interacting = _p[0], setInteracting = _p[1];
    // Lock height updates during expand/collapse CSS transition to prevent
    // font-loading onLayout corrections from restarting the animation mid-flight.
    // useLayoutEffect fires before paint, so the lock is set before any onLayout callbacks.
    var heightsLockedRef = React.useRef(false);
    var prevExpandedRef = React.useRef(expanded);
    React.useLayoutEffect(function () {
        if (prevExpandedRef.current !== expanded) {
            heightsLockedRef.current = true;
            prevExpandedRef.current = expanded;
        }
        var timer = setTimeout(function () {
            heightsLockedRef.current = false;
        }, 350);
        return function () { return clearTimeout(timer); };
    }, [expanded]);
    // Round + skip small changes to prevent cascading re-renders from
    // sub-pixel onLayout jitter during font loading or CSS transitions
    var setToastHeight = React.useCallback(function (toastId, height) {
        if (heightsLockedRef.current)
            return;
        var rounded = Math.round(height);
        setHeights(function (prev) {
            var _a;
            var existing = prev[toastId];
            if (existing != null && Math.abs(existing - rounded) <= 2)
                return prev;
            return __assign(__assign({}, prev), (_a = {}, _a[toastId] = rounded, _a));
        });
    }, []);
    var removeToastHeight = React.useCallback(function (toastId) {
        setHeights(function (prev) {
            if (!(toastId in prev))
                return prev;
            var next = __assign({}, prev);
            delete next[toastId];
            return next;
        });
    }, []);
    // Cooldown after dismiss - prevents collapse while stack rebalances
    var dismissCooldownRef = React.useRef(false);
    var dismissCooldownTimerRef = React.useRef(null);
    var triggerDismissCooldown = React.useCallback(function () {
        dismissCooldownRef.current = true;
        if (dismissCooldownTimerRef.current) {
            clearTimeout(dismissCooldownTimerRef.current);
        }
        dismissCooldownTimerRef.current = setTimeout(function () {
            dismissCooldownRef.current = false;
        }, 800);
    }, []);
    var isInDismissCooldown = React.useCallback(function () { return dismissCooldownRef.current; }, []);
    // Store object props in refs so the subscription effect doesn't
    // re-subscribe on every render when consumers pass inline objects.
    var burntOptionsRef = React.useRef(burntOptions);
    var notificationOptionsRef = React.useRef(notificationOptions);
    React.useEffect(function () {
        burntOptionsRef.current = burntOptions;
    }, [burntOptions]);
    React.useEffect(function () {
        notificationOptionsRef.current = notificationOptions;
    }, [notificationOptions]);
    // subscribe to toast state
    React.useEffect(function () {
        return ToastState_1.ToastState.subscribe(function (toast) {
            if (toast.dismiss) {
                setToasts(function (toasts) {
                    return toasts.map(function (t) { return (t.id === toast.id ? __assign(__assign({}, t), { delete: true }) : t); });
                });
                return;
            }
            // Native dispatch: intercept before entering state so no in-app toast renders.
            // On failure (e.g. permission denied), falls through to in-app.
            if (native) {
                var handled = (0, dispatchNativeToast_1.dispatchNativeToast)(toast, {
                    duration: duration,
                    burntOptions: burntOptionsRef.current,
                    notificationOptions: notificationOptionsRef.current,
                });
                if (handled)
                    return;
            }
            setToasts(function (toasts) {
                var idx = toasts.findIndex(function (t) { return t.id === toast.id; });
                if (idx !== -1) {
                    return __spreadArray(__spreadArray(__spreadArray([], toasts.slice(0, idx), true), [
                        __assign(__assign({}, toasts[idx]), toast)
                    ], false), toasts.slice(idx + 1), true);
                }
                return __spreadArray([toast], toasts, true);
            });
        });
    }, [native, duration]);
    // collapse when 1 toast left, or when a new toast is added while expanded
    var prevToastCountRef = React.useRef(toasts.length);
    React.useEffect(function () {
        var prevCount = prevToastCountRef.current;
        prevToastCountRef.current = toasts.length;
        if (toasts.length <= 1 && !dismissCooldownRef.current) {
            setExpanded(false);
        }
        else if (toasts.length > prevCount && expanded) {
            // new toast added while expanded — collapse to show the new front toast
            setExpanded(false);
        }
    }, [toasts.length, expanded]);
    var removeToast = React.useCallback(function (toastToRemove) {
        setToasts(function (toasts) {
            var _a;
            if (!((_a = toasts.find(function (t) { return t.id === toastToRemove.id; })) === null || _a === void 0 ? void 0 : _a.delete)) {
                ToastState_1.ToastState.dismiss(toastToRemove.id);
            }
            return toasts.filter(function (_a) {
                var id = _a.id;
                return id !== toastToRemove.id;
            });
        });
    }, []);
    var swipeDirection = resolveSwipeDirection(swipeDirectionProp, position);
    var currentTheme = (0, core_1.useThemeName)();
    var resolvedTheme = themeProp === 'system' || !themeProp
        ? (currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.includes('dark'))
            ? 'dark'
            : 'light'
        : themeProp;
    var contextValue = {
        toasts: toasts,
        heights: heights,
        setToastHeight: setToastHeight,
        removeToastHeight: removeToastHeight,
        expanded: expanded,
        setExpanded: setExpanded,
        interacting: interacting,
        setInteracting: setInteracting,
        triggerDismissCooldown: triggerDismissCooldown,
        isInDismissCooldown: isInDismissCooldown,
        removeToast: removeToast,
        position: position,
        duration: duration,
        gap: gap,
        visibleToasts: visibleToasts,
        swipeDirection: swipeDirection,
        swipeThreshold: swipeThreshold,
        toastHeight: toastHeight,
        closeButton: closeButton,
        reducedMotion: reducedMotion,
        native: native,
        burntOptions: burntOptions,
        notificationOptions: notificationOptions,
        icons: icons,
    };
    return ((0, jsx_runtime_1.jsx)(ToastContext.Provider, __assign({}, contextValue, { children: (0, jsx_runtime_1.jsx)(core_1.Theme, { name: resolvedTheme, children: children }) })));
});
/* -------------------------------------------------------------------------------------------------
 * ToastViewport
 * -----------------------------------------------------------------------------------------------*/
var ToastViewportFrame = (0, core_1.styled)(core_1.View, {
    name: 'ToastViewport',
    variants: {
        unstyled: {
            false: __assign(__assign({ position: constants_1.isWeb ? 'fixed' : 'absolute', zIndex: 100000, pointerEvents: 'box-none', maxWidth: '100%' }, (constants_1.isWeb && { width: 356 })), { minHeight: 1 }),
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
var ToastViewport = ToastViewportFrame.styleable(function ToastViewport(props, ref) {
    var _a = props.offset, offset = _a === void 0 ? VIEWPORT_OFFSET : _a, _b = props.hotkey, hotkey = _b === void 0 ? DEFAULT_HOTKEY : _b, _c = props.label, label = _c === void 0 ? 'Notifications' : _c, _d = props.portalToRoot, portalToRoot = _d === void 0 ? true : _d, _e = props.portalZIndex, portalZIndex = _e === void 0 ? Number.MAX_SAFE_INTEGER : _e, children = props.children, rest = __rest(props, ["offset", "hotkey", "label", "portalToRoot", "portalZIndex", "children"]);
    var ctx = useToastContext();
    var listRef = React.useRef(null);
    var hoverTimeoutRef = React.useRef(null);
    var hoverCooldownRef = React.useRef(false);
    var deferredCollapseRef = React.useRef(null);
    var mouseInsideRef = React.useRef(false);
    var _f = ctx.position.split('-'), yPosition = _f[0], xPosition = _f[1];
    // offset styles
    // on native, get safe area insets to avoid status bar / Dynamic Island / home indicator
    // use insets from HanzoguiProvider (passed via useConfiguration)
    // same pattern as Slider — works on native when HanzoguiProvider has insets prop
    var safeInsets = (0, core_1.useConfiguration)().insets;
    var offsetStyles = React.useMemo(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var styles = {};
        var defaultOffset = typeof offset === 'number' ? offset : VIEWPORT_OFFSET;
        var offsetObj = typeof offset === 'object'
            ? offset
            : {
                top: defaultOffset,
                right: defaultOffset,
                bottom: defaultOffset,
                left: defaultOffset,
            };
        var safeTop = (_a = safeInsets === null || safeInsets === void 0 ? void 0 : safeInsets.top) !== null && _a !== void 0 ? _a : 0;
        var safeBottom = (_b = safeInsets === null || safeInsets === void 0 ? void 0 : safeInsets.bottom) !== null && _b !== void 0 ? _b : 0;
        // if safe area already provides spacing, skip the offset to avoid double padding
        var topOffset = safeTop > 0 ? safeTop : ((_c = offsetObj.top) !== null && _c !== void 0 ? _c : defaultOffset);
        var bottomOffset = safeBottom > 0 ? safeBottom : ((_d = offsetObj.bottom) !== null && _d !== void 0 ? _d : defaultOffset);
        if (yPosition === 'top')
            styles.top = topOffset;
        else
            styles.bottom = bottomOffset;
        if (constants_1.isWeb) {
            if (xPosition === 'left')
                styles.left = (_e = offsetObj.left) !== null && _e !== void 0 ? _e : defaultOffset;
            else if (xPosition === 'right')
                styles.right = (_f = offsetObj.right) !== null && _f !== void 0 ? _f : defaultOffset;
            else {
                styles.left = '50%';
                styles.transform = 'translateX(-50%)';
            }
        }
        else {
            // native: always set both left + right so viewport fills screen
            // (no fixed width on native — left/right offsets define the width)
            styles.left = (_g = offsetObj.left) !== null && _g !== void 0 ? _g : defaultOffset;
            styles.right = (_h = offsetObj.right) !== null && _h !== void 0 ? _h : defaultOffset;
        }
        return styles;
    }, [offset, yPosition, xPosition]);
    // hotkey
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        var handleKeyDown = function (event) {
            var _a;
            var isHotkeyPressed = hotkey.length > 0 &&
                hotkey.every(function (key) { return event[key] || event.code === key; });
            if (isHotkeyPressed) {
                ctx.setExpanded(true);
                (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            // Escape is handled by individual toast items via onKeyDown
            // which dismisses the focused toast with cooldown (keeps stack expanded)
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [hotkey]);
    if (ctx.toasts.length === 0)
        return null;
    var hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '');
    var content = ((0, jsx_runtime_1.jsx)(ToastViewportFrame, __assign({ ref: listRef, "aria-label": "".concat(label, " ").concat(hotkeyLabel), tabIndex: -1, "aria-live": "polite", style: offsetStyles, "data-y-position": yPosition, "data-x-position": xPosition }, (constants_1.isWeb
        ? {
            onMouseEnter: function () {
                mouseInsideRef.current = true;
                if (deferredCollapseRef.current) {
                    clearTimeout(deferredCollapseRef.current);
                    deferredCollapseRef.current = null;
                }
                if (ctx.toasts.length > 1 &&
                    !ctx.interacting &&
                    !hoverCooldownRef.current) {
                    hoverTimeoutRef.current = setTimeout(function () { return ctx.setExpanded(true); }, 50);
                }
            },
            onMouseLeave: function () {
                mouseInsideRef.current = false;
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                }
                if (!ctx.interacting && !ctx.isInDismissCooldown()) {
                    ctx.setExpanded(false);
                }
                else if (ctx.isInDismissCooldown()) {
                    // During dismiss cooldown, defer collapse until well after
                    // the exit animation completes to prevent mid-animation bounce.
                    // The cooldown is 800ms, spring exit is ~500ms — 1200ms covers both.
                    if (deferredCollapseRef.current) {
                        clearTimeout(deferredCollapseRef.current);
                    }
                    deferredCollapseRef.current = setTimeout(function () {
                        deferredCollapseRef.current = null;
                        if (!mouseInsideRef.current) {
                            ctx.setExpanded(false);
                        }
                    }, 1200);
                }
            },
            onPointerDown: function () {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                }
                ctx.setInteracting(true);
            },
            onPointerUp: function () { return ctx.setInteracting(false); },
            onPointerCancel: function () { return ctx.setInteracting(false); },
        }
        : {
            onPress: function () {
                if (ctx.toasts.length > 1) {
                    ctx.setExpanded(function (prev) { return !prev; });
                }
            },
        }), (constants_1.isWeb && {
        onFocus: function (event) {
            // keyboard focus entered — expand stack and pause timers
            if (!event.currentTarget.contains(event.relatedTarget)) {
                if (ctx.toasts.length > 1) {
                    ctx.setExpanded(true);
                }
                ctx.setInteracting(true);
            }
        },
        onBlur: function (event) {
            // focus left the toaster — collapse and resume timers
            if (!event.currentTarget.contains(event.relatedTarget)) {
                ctx.setInteracting(false);
                if (!ctx.isInDismissCooldown()) {
                    ctx.setExpanded(false);
                }
            }
        },
    }), rest, { children: children })));
    if (portalToRoot) {
        return (0, jsx_runtime_1.jsx)(portal_1.Portal, { zIndex: portalZIndex, children: content });
    }
    return content;
});
function ToastList(_a) {
    var renderItem = _a.renderItem;
    var ctx = useToastContext();
    // render all toasts — hidden ones have opacity 0 but stay mounted
    // so they smoothly transition when visible toasts are dismissed
    var maxRender = ctx.toasts.length;
    return ((0, jsx_runtime_1.jsx)(animate_presence_1.AnimatePresence, { children: ctx.toasts.slice(0, maxRender).map(function (toast, index) {
            var handleClose = function () {
                var _a;
                if (toast.dismissible === false)
                    return;
                (_a = toast.onDismiss) === null || _a === void 0 ? void 0 : _a.call(toast, toast);
                ctx.removeToast(toast);
            };
            var itemContextValue = {
                toast: toast,
                handleClose: handleClose,
            };
            if (!renderItem) {
                return ((0, jsx_runtime_1.jsx)(ToastItemContext.Provider, { value: itemContextValue, children: (0, jsx_runtime_1.jsx)(ToastItemInner, { toast: toast, index: index, children: (0, jsx_runtime_1.jsx)(DefaultToastContent, { toast: toast }) }) }, toast.id));
            }
            return ((0, jsx_runtime_1.jsx)(ToastItemContext.Provider, { value: itemContextValue, children: renderItem({ toast: toast, index: index, handleClose: handleClose }) }, toast.id));
        }) }));
}
/* -------------------------------------------------------------------------------------------------
 * DefaultToastContent - default rendering for toast items
 * -----------------------------------------------------------------------------------------------*/
function DefaultToastContent(_a) {
    var _b;
    var toast = _a.toast;
    var ctx = useToastContext();
    var handleClose = useToastItemContext().handleClose;
    var toastType = (_b = toast.type) !== null && _b !== void 0 ? _b : 'default';
    var dismissible = toast.dismissible !== false;
    var title = typeof toast.title === 'function' ? toast.title() : toast.title;
    var description = typeof toast.description === 'function' ? toast.description() : toast.description;
    return ((0, jsx_runtime_1.jsxs)(stacks_1.XStack, { alignItems: "flex-start", gap: "$3", children: [(0, jsx_runtime_1.jsx)(ToastIcon, {}), (0, jsx_runtime_1.jsxs)(stacks_1.YStack, { flex: 1, gap: "$1", children: [title && (0, jsx_runtime_1.jsx)(ToastTitle, { children: title }), description && (0, jsx_runtime_1.jsx)(ToastDescription, { children: description }), (toast.action || toast.cancel) && ((0, jsx_runtime_1.jsxs)(stacks_1.XStack, { gap: "$2", marginTop: "$2", children: [toast.cancel && ((0, jsx_runtime_1.jsx)(ToastItemFrame_1.ToastActionFrame, { backgroundColor: "transparent", onPress: function (e) {
                                    var _a, _b;
                                    (_b = (_a = toast.cancel) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a, e);
                                    handleClose();
                                }, children: (0, jsx_runtime_1.jsx)(text_1.SizableText, { size: "$2", color: "$color11", children: toast.cancel.label }) })), toast.action && ((0, jsx_runtime_1.jsx)(ToastItemFrame_1.ToastActionFrame, { backgroundColor: "$color12", hoverStyle: { backgroundColor: '$color11' }, pressStyle: { backgroundColor: '$color10' }, onPress: function (e) {
                                    var _a, _b;
                                    (_b = (_a = toast.action) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a, e);
                                    if (!e.defaultPrevented) {
                                        handleClose();
                                    }
                                }, children: (0, jsx_runtime_1.jsx)(text_1.SizableText, { size: "$2", fontWeight: "600", color: "$background", children: toast.action.label }) }))] }))] }), ctx.closeButton && dismissible && (0, jsx_runtime_1.jsx)(ToastClose, {})] }));
}
function DragWrapper(_a) {
    var animatedStyle = _a.animatedStyle, gestureHandlers = _a.gestureHandlers, gesture = _a.gesture, AnimatedView = _a.AnimatedView, dragRef = _a.dragRef, children = _a.children;
    if (constants_1.isWeb) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ ref: dragRef, style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
                cursor: 'default',
            } }, gestureHandlers, { children: children })));
    }
    // when RNGH gesture is available, wrap with GestureDetector + plain View
    // (GestureDetector needs a native View to attach handlers to)
    if (gesture) {
        var gh = (0, native_1.getGestureHandler)();
        var GestureDetector = gh.state.GestureDetector;
        if (GestureDetector) {
            return ((0, jsx_runtime_1.jsx)(GestureDetector, { gesture: gesture, children: (0, jsx_runtime_1.jsx)(core_1.View, __assign({ style: { flex: 1 } }, { collapsable: false }, { children: (0, jsx_runtime_1.jsx)(AnimatedView, { style: [{ flex: 1 }, animatedStyle], children: children }) })) }));
        }
    }
    // fallback: PanResponder handlers
    return ((0, jsx_runtime_1.jsx)(AnimatedView, __assign({ style: [{ flex: 1 }, animatedStyle] }, gestureHandlers, { children: children })));
}
var ToastItemInner = ToastItemFrame_1.ToastItemFrame.styleable(function ToastItem(props, ref) {
    var _a, _b, _c, _d;
    var toast = props.toast, index = props.index, children = props.children, rest = __rest(props, ["toast", "index", "children"]);
    var ctx = useToastContext();
    var _e = React.useState(false), mounted = _e[0], setMounted = _e[1];
    var _f = React.useState(false), removed = _f[0], setRemoved = _f[1];
    var _g = React.useState(false), swipeOut = _g[0], setSwipeOut = _g[1];
    // Freeze the Y offset when dismiss starts so the exiting toast doesn't jump
    // as other toasts rebalance
    var _h = React.useState(0), offsetBeforeRemove = _h[0], setOffsetBeforeRemove = _h[1];
    // Freeze stackY at swipe time — context re-renders recalculate stackY
    // but the exiting toast should stay at its pre-removal position
    var swipeExitYRef = React.useRef(null);
    var closeTimerRef = React.useRef(null);
    var closeTimerStartRef = React.useRef(0);
    var lastPauseTimeRef = React.useRef(0);
    var remainingTimeRef = React.useRef((_a = toast.duration) !== null && _a !== void 0 ? _a : ctx.duration);
    var isFront = index === 0;
    var isVisible = index < ctx.visibleToasts;
    var toastType = (_b = toast.type) !== null && _b !== void 0 ? _b : 'default';
    var dismissible = toast.dismissible !== false;
    var duration = (_c = toast.duration) !== null && _c !== void 0 ? _c : ctx.duration;
    var yPosition = ctx.position.split('-')[0];
    var isTop = yPosition === 'top';
    // web: dynamic heights (CSS transitions run off main thread, no FPS concern)
    // native: fixed height (avoids React state re-render cascade on JS thread)
    var expandedOffset = constants_1.isWeb
        ? (function () {
            var _a;
            var totalHeight = 0;
            var activeCount = 0;
            for (var i = 0; i < index; i++) {
                var toastId = (_a = ctx.toasts[i]) === null || _a === void 0 ? void 0 : _a.id;
                if (toastId == null)
                    continue;
                var h = ctx.heights[toastId];
                if (h === 0)
                    continue;
                totalHeight += h !== null && h !== void 0 ? h : ctx.toastHeight;
                activeCount++;
            }
            return totalHeight + activeCount * ctx.gap;
        })()
        : index * (ctx.toastHeight + ctx.gap);
    // Refs for stable access in callbacks — avoids putting expandedOffset/expanded
    // in deps which would cause timer restarts on every height measurement
    var expandedOffsetRef = React.useRef(expandedOffset);
    expandedOffsetRef.current = expandedOffset;
    var isExpandedRef = React.useRef(ctx.expanded);
    isExpandedRef.current = ctx.expanded;
    // timer — no height-zeroing needed here because auto-dismiss only fires
    // when not expanded/interacting (timer is paused during hover)
    var startTimer = React.useCallback(function () {
        if (duration === Number.POSITIVE_INFINITY || toastType === 'loading')
            return;
        closeTimerStartRef.current = Date.now();
        closeTimerRef.current = setTimeout(function () {
            var _a;
            (_a = toast.onAutoClose) === null || _a === void 0 ? void 0 : _a.call(toast, toast);
            setRemoved(true);
            setTimeout(function () { return ctx.removeToast(toast); }, TIME_BEFORE_UNMOUNT);
        }, remainingTimeRef.current);
    }, [duration, toastType, toast, ctx.removeToast]);
    var pauseTimer = (0, core_1.useEvent)(function () {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        if (lastPauseTimeRef.current < closeTimerStartRef.current) {
            var elapsed = Date.now() - closeTimerStartRef.current;
            remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        }
        lastPauseTimeRef.current = Date.now();
    });
    var resumeTimer = (0, core_1.useEvent)(function () {
        if (ctx.expanded || ctx.interacting)
            return;
        remainingTimeRef.current = duration;
        startTimer();
    });
    React.useEffect(function () {
        setMounted(true);
    }, []);
    // handle deletion — only zero height when expanded (Sonner rebalance)
    React.useEffect(function () {
        if (toast.delete) {
            setRemoved(true);
            if (isExpandedRef.current) {
                setOffsetBeforeRemove(expandedOffsetRef.current);
            }
            setTimeout(function () { return ctx.removeToast(toast); }, TIME_BEFORE_UNMOUNT);
        }
    }, [toast.delete, toast, ctx.removeToast]);
    React.useEffect(function () {
        // all toasts have independent timers (same as Sonner)
        // stagger comes from creation time differences
        if (ctx.expanded || ctx.interacting) {
            pauseTimer();
        }
        else {
            startTimer();
        }
        return function () {
            if (closeTimerRef.current)
                clearTimeout(closeTimerRef.current);
        };
    }, [ctx.expanded, ctx.interacting, startTimer]);
    // reset remaining time when duration changes
    React.useEffect(function () {
        remainingTimeRef.current = duration;
    }, [duration]);
    // animations
    var _j = (0, useToastAnimations_1.useToastAnimations)({
        reducedMotion: ctx.reducedMotion,
        swipeAxis: ctx.swipeDirection === 'up' ||
            ctx.swipeDirection === 'down' ||
            ctx.swipeDirection === 'vertical'
            ? 'vertical'
            : 'horizontal',
    }), setDragOffset = _j.setDragOffset, springBack = _j.springBack, animateOut = _j.animateOut, animatedStyle = _j.animatedStyle, AnimatedView = _j.AnimatedView, dragRef = _j.dragRef;
    var _k = (0, useAnimatedDragGesture_1.useAnimatedDragGesture)({
        direction: ctx.swipeDirection,
        threshold: ctx.swipeThreshold,
        disabled: !dismissible || toastType === 'loading',
        expanded: ctx.expanded,
        onDragStart: pauseTimer,
        onDragMove: setDragOffset,
        onDismiss: function (exitDirection, velocity) {
            var _a;
            // Trigger cooldown to prevent collapse while stack rebalances
            ctx.triggerDismissCooldown();
            setSwipeOut(true);
            (_a = toast.onDismiss) === null || _a === void 0 ? void 0 : _a.call(toast, toast);
            // freeze stackY at swipe time — after removeToast, context re-renders
            // recalculate expandedOffset with the wrong toast array
            swipeExitYRef.current = isExpandedRef.current
                ? isTop
                    ? expandedOffsetRef.current
                    : -expandedOffsetRef.current
                : isFront
                    ? 0
                    : isTop
                        ? ctx.gap * index
                        : -ctx.gap * index;
            setRemoved(true);
            ctx.removeToast(toast);
            animateOut(exitDirection, velocity);
        },
        onCancel: function () {
            springBack(function () {
                resumeTimer();
            });
        },
    }), isDragging = _k.isDragging, gestureHandlers = _k.gestureHandlers, gesture = _k.gesture;
    // measure height (web only — native uses fixed height)
    var handleLayout = React.useCallback(function (event) {
        if (!constants_1.isWeb)
            return;
        if (removed)
            return;
        if (!ctx.expanded && index !== 0)
            return;
        var height = event.nativeEvent.layout.height;
        ctx.setToastHeight(toast.id, height);
    }, [toast.id, ctx.setToastHeight, index, ctx.expanded, removed]);
    // remove height on unmount (web only)
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        return function () {
            ctx.removeToastHeight(toast.id);
        };
    }, [toast.id, ctx.removeToastHeight]);
    var handleClose = React.useCallback(function () {
        var _a;
        if (!dismissible)
            return;
        ctx.triggerDismissCooldown();
        (_a = toast.onDismiss) === null || _a === void 0 ? void 0 : _a.call(toast, toast);
        setRemoved(true);
        if (isExpandedRef.current) {
            setOffsetBeforeRemove(expandedOffsetRef.current);
        }
        setTimeout(function () { return ctx.removeToast(toast); }, TIME_BEFORE_UNMOUNT);
    }, [dismissible, toast, ctx.removeToast, ctx.triggerDismissCooldown]);
    var itemContextValue = React.useMemo(function () { return ({ toast: toast, handleClose: handleClose }); }, [toast, handleClose]);
    // front toast height for collapsed stacking (web only)
    var frontToastHeight = -1;
    if (constants_1.isWeb) {
        for (var _i = 0, _l = ctx.toasts; _i < _l.length; _i++) {
            var t = _l[_i];
            var h = ctx.heights[t.id];
            if (h != null && h > 0) {
                frontToastHeight = h;
                break;
            }
        }
    }
    var stackScale = !ctx.expanded && !isFront ? 1 - index * 0.05 : 1;
    // When removed, freeze Y at the saved offset so the exiting toast doesn't jump
    // as other toasts rebalance (Sonner: --offset uses offsetBeforeRemove when removed)
    var activeExpandedOffset = removed ? offsetBeforeRemove : expandedOffset;
    var stackY = ctx.expanded
        ? isTop
            ? activeExpandedOffset
            : -activeExpandedOffset
        : isFront
            ? 0
            : isTop
                ? ctx.gap * index
                : -ctx.gap * index;
    var computedOpacity = removed && !swipeOut ? 0 : index >= ctx.visibleToasts ? 0 : 1;
    var computedZIndex = removed ? 0 : ctx.visibleToasts - index + 1;
    // web: use measured height for smooth expand/collapse transitions
    // native: fixed height, no constraint needed
    var computedHeight = constants_1.isWeb
        ? ctx.expanded
            ? ctx.heights[toast.id] || undefined
            : !isFront && frontToastHeight > 0
                ? frontToastHeight
                : undefined
        : undefined;
    var computedPointerEvents = index >= ctx.visibleToasts ? 'none' : 'auto';
    // gap filler for hover stability
    var gapFillerHeight = ctx.expanded ? ctx.gap + 1 : 0;
    // data attributes
    var dataAttributes = {
        'data-mounted': mounted ? 'true' : 'false',
        'data-removed': removed ? 'true' : 'false',
        'data-swipe-out': swipeOut ? 'true' : 'false',
        'data-visible': isVisible ? 'true' : 'false',
        'data-front': isFront ? 'true' : 'false',
        'data-index': String(index),
        'data-type': toastType,
        'data-expanded': ctx.expanded ? 'true' : 'false',
    };
    return ((0, jsx_runtime_1.jsx)(ToastItemFrame_1.ToastPositionWrapper, __assign({ ref: ref, testID: rest.testID, accessibilityLabel: rest.accessibilityLabel }, dataAttributes, { transition: isDragging || ctx.reducedMotion ? undefined : removed ? '200ms' : '400ms', animateOnly: constants_1.isWeb ? ['transform', 'opacity', 'height'] : ['transform', 'opacity'], y: stackY, scale: stackScale, opacity: computedOpacity, zIndex: computedZIndex, height: computedHeight, overflow: "visible", pointerEvents: computedPointerEvents, top: isTop ? 0 : undefined, bottom: isTop ? undefined : 0 }, (constants_1.isWeb &&
        !isFront && {
        style: { transformOrigin: isTop ? 'top center' : 'bottom center' },
    }), { enterStyle: ctx.reducedMotion ? { opacity: 0 } : { opacity: 0, y: isTop ? -80 : 80 }, exitStyle: ctx.reducedMotion
            ? { opacity: 0 }
            : swipeOut
                ? { opacity: 0, y: (_d = swipeExitYRef.current) !== null && _d !== void 0 ? _d : stackY, scale: stackScale }
                : { opacity: 0, y: stackY, scale: stackScale }, children: (0, jsx_runtime_1.jsx)(DragWrapper, { animatedStyle: animatedStyle, gestureHandlers: gestureHandlers, gesture: gesture, AnimatedView: AnimatedView, dragRef: dragRef, children: (0, jsx_runtime_1.jsxs)(ToastItemFrame_1.ToastItemFrame, __assign({ role: "status", "aria-live": "polite", "aria-atomic": true, tabIndex: 0, onLayout: handleLayout }, (constants_1.isWeb && {
                onKeyDown: function (event) {
                    if (event.key === 'Escape' && dismissible) {
                        // move focus to the next toast before dismissing
                        var current = event.currentTarget;
                        var container = current.closest('[aria-label]');
                        if (container) {
                            var focusables = container.querySelectorAll('[tabindex="0"]');
                            var arr = Array.from(focusables);
                            var idx = arr.indexOf(current);
                            var next = arr[idx + 1] || arr[idx - 1];
                            next === null || next === void 0 ? void 0 : next.focus();
                        }
                        handleClose();
                    }
                },
            }), rest, { children: [ctx.expanded && gapFillerHeight > 0 && ((0, jsx_runtime_1.jsx)(core_1.View, __assign({ position: "absolute", left: 0, right: 0, height: gapFillerHeight, pointerEvents: "auto" }, (isTop ? { top: '100%' } : { bottom: '100%' })))), (0, jsx_runtime_1.jsx)(ToastItemContext.Provider, { value: itemContextValue, children: children })] })) }) })));
});
/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/
var ToastTitle = (0, core_1.styled)(text_1.SizableText, {
    name: 'ToastTitle',
    variants: {
        unstyled: {
            false: {
                color: '$color',
                fontWeight: '600',
                size: '$4',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/
var ToastDescription = (0, core_1.styled)(text_1.SizableText, {
    name: 'ToastDescription',
    variants: {
        unstyled: {
            false: {
                color: '$color11',
                size: '$2',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastClose - auto-wired to dismiss current toast
 * -----------------------------------------------------------------------------------------------*/
var ToastClose = ToastItemFrame_1.ToastCloseFrame.styleable(function ToastClose(props, ref) {
    var _a, _b, _c;
    // try to get handleClose from context, but allow manual override
    var handleClose;
    try {
        var itemCtx = useToastItemContext();
        handleClose = itemCtx.handleClose;
    }
    catch (_d) {
        // not inside a Toast.Item context, require manual onPress
    }
    var ctx = useToastContext();
    return ((0, jsx_runtime_1.jsx)(ToastItemFrame_1.ToastCloseFrame, __assign({ ref: ref, "aria-label": "Close toast", onPress: handleClose }, props, { children: (_c = (_a = props.children) !== null && _a !== void 0 ? _a : (_b = ctx.icons) === null || _b === void 0 ? void 0 : _b.close) !== null && _c !== void 0 ? _c : (0, jsx_runtime_1.jsx)(ToastItemFrame_1.DefaultCloseIcon, {}) })));
});
/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/
var ToastAction = ToastItemFrame_1.ToastActionFrame.styleable(function ToastAction(props, ref) {
    return (0, jsx_runtime_1.jsx)(ToastItemFrame_1.ToastActionFrame, __assign({ ref: ref }, props));
});
/* -------------------------------------------------------------------------------------------------
 * ToastIcon - renders icon based on toast type
 * -----------------------------------------------------------------------------------------------*/
function ToastIcon(props) {
    var _a, _b, _c;
    var ctx = useToastContext();
    var toast;
    try {
        var itemCtx = useToastItemContext();
        toast = itemCtx.toast;
    }
    catch (_d) {
        // not inside a Toast.Item context
        return null;
    }
    if (!toast)
        return null;
    // if custom icon provided on toast, use it
    if (toast.icon !== undefined) {
        return ((0, jsx_runtime_1.jsx)(core_1.View, { flexShrink: 0, marginTop: "$0.5", children: toast.icon }));
    }
    var toastType = (_a = toast.type) !== null && _a !== void 0 ? _a : 'default';
    // only show icons if explicitly provided via icons prop (no built-in defaults)
    var icon = (_c = (_b = ctx.icons) === null || _b === void 0 ? void 0 : _b[toastType]) !== null && _c !== void 0 ? _c : null;
    if (!icon)
        return null;
    return ((0, jsx_runtime_1.jsx)(core_1.View, { flexShrink: 0, marginTop: "$0.5", children: icon }));
}
/* -------------------------------------------------------------------------------------------------
 * useToasts hook for rendering
 * -----------------------------------------------------------------------------------------------*/
function useToasts() {
    var ctx = useToastContext();
    return {
        toasts: ctx.toasts,
        expanded: ctx.expanded,
        position: ctx.position,
    };
}
/* -------------------------------------------------------------------------------------------------
 * useToastItem hook for accessing current toast in custom content
 * -----------------------------------------------------------------------------------------------*/
function useToastItem() {
    return useToastItemContext();
}
/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/
ToastRoot.displayName = 'Toast';
exports.Toast = (0, helpers_1.withStaticProperties)(ToastRoot, {
    Viewport: ToastViewport,
    List: ToastList,
    Item: ToastItemInner,
    Title: ToastTitle,
    Description: ToastDescription,
    Close: ToastClose,
    Action: ToastAction,
    Icon: ToastIcon,
});
