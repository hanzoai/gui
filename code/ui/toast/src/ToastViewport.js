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
exports.VIEWPORT_RESUME = exports.VIEWPORT_PAUSE = exports.VIEWPORT_DEFAULT_HOTKEY = exports.ToastViewport = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var animate_presence_1 = require("@hanzogui/animate-presence");
var compose_refs_1 = require("@hanzogui/compose-refs");
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var portal_1 = require("@hanzogui/portal");
var stacks_1 = require("@hanzogui/stacks");
var visually_hidden_1 = require("@hanzogui/visually-hidden");
var React = require("react");
var constants_2 = require("./constants");
var ToastPortal_1 = require("./ToastPortal");
var ToastProvider_1 = require("./ToastProvider");
var VIEWPORT_NAME = 'ToastViewport';
var VIEWPORT_DEFAULT_HOTKEY = ['F8'];
exports.VIEWPORT_DEFAULT_HOTKEY = VIEWPORT_DEFAULT_HOTKEY;
var VIEWPORT_PAUSE = 'toast.viewportPause';
exports.VIEWPORT_PAUSE = VIEWPORT_PAUSE;
var VIEWPORT_RESUME = 'toast.viewportResume';
exports.VIEWPORT_RESUME = VIEWPORT_RESUME;
var ToastViewportWrapperFrame = (0, core_1.styled)(stacks_1.YStack, {
    name: 'ViewportWrapper',
    variants: {
        unstyled: {
            false: {
                pointerEvents: 'box-none',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                position: constants_1.isWeb ? 'fixed' : 'absolute',
                maxWidth: '100%',
                tabIndex: 0,
                zIndex: 100000,
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
var ToastViewportFrame = (0, core_1.styled)(stacks_1.YStack, {
    name: VIEWPORT_NAME,
    variants: {
        unstyled: {
            false: {
                pointerEvents: 'box-none',
                position: constants_1.isWeb ? 'fixed' : 'absolute',
                maxWidth: '100%',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
var ToastViewport = React.memo(React.forwardRef(function (props, forwardedRef) {
    var scope = props.scope, _a = props.hotkey, hotkey = _a === void 0 ? VIEWPORT_DEFAULT_HOTKEY : _a, _b = props.label, label = _b === void 0 ? 'Notifications ({hotkey})' : _b, _c = props.name, name = _c === void 0 ? 'default' : _c, multipleToasts = props.multipleToasts, zIndex = props.zIndex, portalToRoot = props.portalToRoot, viewportProps = __rest(props, ["scope", "hotkey", "label", "name", "multipleToasts", "zIndex", "portalToRoot"]);
    var context = (0, ToastProvider_1.useToastProviderContext)(scope);
    var getItems = (0, ToastProvider_1.useCollection)(scope || constants_2.TOAST_CONTEXT);
    var headFocusProxyRef = React.useRef(null);
    var tailFocusProxyRef = React.useRef(null);
    var wrapperRef = React.useRef(null);
    var ref = React.useRef(null);
    var onViewportChange = React.useCallback(function (el) {
        if (context.viewports[name] !== el)
            context.onViewportChange(name, el);
    }, [name, context.viewports]);
    // @ts-ignore TODO react 19 type needs fix
    var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, ref, onViewportChange);
    var hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '');
    var hasToasts = context.toastCount > 0;
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        if (context.toastCount === 0)
            return;
        var handleKeyDown = function (event) {
            var _a;
            // we use `event.code` as it is consistent regardless of meta keys that were pressed.
            // for example, `event.key` for `Control+Alt+t` is `†` and `t !== †`
            var isHotkeyPressed = hotkey.every(function (key) { return event[key] || event.code === key; });
            if (isHotkeyPressed)
                (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [hotkey, context.toastCount]);
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        if (context.toastCount === 0)
            return;
        var wrapper = wrapperRef.current;
        var viewport = ref.current;
        if (hasToasts && wrapper && viewport) {
            var handlePause_1 = function () {
                if (!context.isClosePausedRef.current) {
                    var pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
                    viewport.dispatchEvent(pauseEvent);
                    context.isClosePausedRef.current = true;
                }
            };
            var handleResume_1 = function () {
                if (context.isClosePausedRef.current) {
                    var resumeEvent = new CustomEvent(VIEWPORT_RESUME);
                    viewport.dispatchEvent(resumeEvent);
                    context.isClosePausedRef.current = false;
                }
            };
            var handleFocusOutResume_1 = function (event) {
                var isFocusMovingOutside = !wrapper.contains(event.relatedTarget);
                if (isFocusMovingOutside)
                    handleResume_1();
            };
            var handlePointerLeaveResume_1 = function () {
                var isFocusInside = wrapper.contains(document.activeElement);
                if (!isFocusInside)
                    handleResume_1();
            };
            // Toasts are not in the viewport React tree so we need to bind DOM events
            wrapper.addEventListener('focusin', handlePause_1);
            wrapper.addEventListener('focusout', handleFocusOutResume_1);
            wrapper.addEventListener('pointermove', handlePause_1);
            wrapper.addEventListener('pointerleave', handlePointerLeaveResume_1);
            window.addEventListener('blur', handlePause_1);
            window.addEventListener('focus', handleResume_1);
            return function () {
                wrapper.removeEventListener('focusin', handlePause_1);
                wrapper.removeEventListener('focusout', handleFocusOutResume_1);
                wrapper.removeEventListener('pointermove', handlePause_1);
                wrapper.removeEventListener('pointerleave', handlePointerLeaveResume_1);
                window.removeEventListener('blur', handlePause_1);
                window.removeEventListener('focus', handleResume_1);
            };
        }
    }, [hasToasts, context.isClosePausedRef, context.toastCount]);
    var getSortedTabbableCandidates = React.useCallback(function (_a) {
        var tabbingDirection = _a.tabbingDirection;
        var toastItems = getItems();
        var tabbableCandidates = toastItems.map(function (toastItem) {
            var toastNode = toastItem.ref.current;
            var toastTabbableCandidates = __spreadArray([
                toastNode
            ], getTabbableCandidates(toastNode), true);
            return tabbingDirection === 'forwards'
                ? toastTabbableCandidates
                : toastTabbableCandidates.reverse();
        });
        return (tabbingDirection === 'forwards'
            ? tabbableCandidates.reverse()
            : tabbableCandidates).flat();
    }, [getItems]);
    React.useEffect(function () {
        if (!constants_1.isWeb)
            return;
        if (context.toastCount === 0)
            return;
        var viewport = ref.current;
        // We programmatically manage tabbing as we are unable to influence
        // the source order with portals, this allows us to reverse the
        // tab order so that it runs from most recent toast to least
        if (viewport) {
            var handleKeyDown_1 = function (event) {
                var _a, _b, _c;
                var isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
                var isTabKey = event.key === 'Tab' && !isMetaKey;
                if (isTabKey) {
                    var focusedElement_1 = document.activeElement;
                    var isTabbingBackwards = event.shiftKey;
                    var targetIsViewport = event.target === viewport;
                    // If we're back tabbing after jumping to the viewport then we simply
                    // proxy focus out to the preceding document
                    if (targetIsViewport && isTabbingBackwards) {
                        // @ts-ignore ali TODO type
                        (_a = headFocusProxyRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                        return;
                    }
                    var tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards';
                    var sortedCandidates = getSortedTabbableCandidates({ tabbingDirection: tabbingDirection });
                    var index = sortedCandidates.findIndex(function (candidate) { return candidate === focusedElement_1; });
                    if (focusFirst(sortedCandidates.slice(index + 1))) {
                        event.preventDefault();
                    }
                    else {
                        // If we can't focus that means we're at the edges so we
                        // proxy to the corresponding exit point and let the browser handle
                        // tab/shift+tab keypress and implicitly pass focus to the next valid element in the document
                        isTabbingBackwards
                            ? // @ts-ignore ali TODO type
                                (_b = headFocusProxyRef.current) === null || _b === void 0 ? void 0 : _b.focus()
                            : // @ts-ignore ali TODO type
                                (_c = tailFocusProxyRef.current) === null || _c === void 0 ? void 0 : _c.focus();
                    }
                }
            };
            // Toasts are not in the viewport React tree so we need to bind DOM events
            viewport.addEventListener('keydown', handleKeyDown_1);
            return function () { return viewport.removeEventListener('keydown', handleKeyDown_1); };
        }
    }, [getItems, getSortedTabbableCandidates, context.toastCount]);
    var contents = ((0, jsx_runtime_1.jsxs)(ToastViewportWrapperFrame, { ref: wrapperRef, 
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role: "region", "aria-label": label.replace('{hotkey}', hotkeyLabel), 
        // // Ensure virtual cursor from landmarks menus triggers focus/blur for pause/resume
        tabIndex: -1, children: [hasToasts && ((0, jsx_runtime_1.jsx)(FocusProxy, { context: context, viewportName: name, ref: headFocusProxyRef, onFocusFromOutsideViewport: function () {
                    var tabbableCandidates = getSortedTabbableCandidates({
                        tabbingDirection: 'forwards',
                    });
                    focusFirst(tabbableCandidates);
                } })), (0, jsx_runtime_1.jsx)(ToastProvider_1.Collection.Slot, { scope: context.toastScope, children: (0, jsx_runtime_1.jsx)(ToastViewportFrame, __assign({ focusable: context.toastCount > 0, ref: composedRefs }, viewportProps, { children: (0, jsx_runtime_1.jsx)(portal_1.PortalHost, { render: function (children) { return ((0, jsx_runtime_1.jsx)(animate_presence_1.AnimatePresence, { exitBeforeEnter: !multipleToasts, children: children })); }, name: name !== null && name !== void 0 ? name : 'default' }) })) }), hasToasts && ((0, jsx_runtime_1.jsx)(FocusProxy, { context: context, viewportName: name, ref: tailFocusProxyRef, onFocusFromOutsideViewport: function () {
                    var tabbableCandidates = getSortedTabbableCandidates({
                        tabbingDirection: 'backwards',
                    });
                    focusFirst(tabbableCandidates);
                } }))] }));
    if (portalToRoot) {
        return ((0, jsx_runtime_1.jsx)(ToastPortal_1.ToastPortal, __assign({ context: context }, (typeof zIndex === 'number' ? { zIndex: zIndex } : {}), { children: contents })));
    }
    return contents;
}));
exports.ToastViewport = ToastViewport;
ToastViewport.displayName = VIEWPORT_NAME;
/* -----------------------------------------------------------------------------------------------*/
var FOCUS_PROXY_NAME = 'ToastFocusProxy';
var FocusProxy = React.forwardRef(function (props, forwardedRef) {
    var onFocusFromOutsideViewport = props.onFocusFromOutsideViewport, viewportName = props.viewportName, context = props.context, proxyProps = __rest(props, ["onFocusFromOutsideViewport", "viewportName", "context"]);
    var viewport = context.viewports[viewportName];
    return ((0, jsx_runtime_1.jsx)(visually_hidden_1.VisuallyHidden, __assign({ "aria-hidden": true, tabIndex: 0 }, proxyProps, { ref: forwardedRef, 
        // Avoid page scrolling when focus is on the focus proxy
        position: constants_1.isWeb ? 'fixed' : 'absolute', onFocus: function (event) {
            if (!constants_1.isWeb)
                return;
            var prevFocusedElement = event.relatedTarget;
            var isFocusFromOutsideViewport = !(viewport === null || viewport === void 0 ? void 0 : viewport.contains(prevFocusedElement));
            if (isFocusFromOutsideViewport)
                onFocusFromOutsideViewport();
        } })));
});
FocusProxy.displayName = FOCUS_PROXY_NAME;
/* -----------------------------------------------------------------------------------------------*/
function focusFirst(candidates) {
    if (!constants_1.isWeb)
        return;
    var previouslyFocusedElement = document.activeElement;
    return candidates.some(function (candidate) {
        // if focus is already where we want to go, we don't want to keep going through the candidates
        if (candidate === previouslyFocusedElement)
            return true;
        candidate.focus();
        return document.activeElement !== previouslyFocusedElement;
    });
}
/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container) {
    if (!constants_1.isWeb)
        return [];
    var containerHtml = container;
    var nodes = [];
    var walker = document.createTreeWalker(containerHtml, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (node) {
            var isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
            if (node.disabled || node.hidden || isHiddenInput)
                return NodeFilter.FILTER_SKIP;
            // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
            // runtime's understanding of tabbability, so this automatically accounts
            // for any kind of element that could be tabbed to.
            return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        },
    });
    while (walker.nextNode())
        nodes.push(walker.currentNode);
    // we do not take into account the order of nodes with positive `tabIndex` as it
    // hinders accessibility to have tab order different from visual order.
    return nodes;
}
