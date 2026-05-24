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
exports.DismissableBranch = exports.Dismissable = void 0;
exports.dispatchDiscreteCustomEvent = dispatchDiscreteCustomEvent;
exports.getDismissableLayerCount = getDismissableLayerCount;
exports.debugDismissableLayers = debugDismissableLayers;
exports.useHasDismissableLayers = useHasDismissableLayers;
exports.useIsInsideDismissable = useIsInsideDismissable;
exports.useDismissableLayersAbove = useDismissableLayersAbove;
var jsx_runtime_1 = require("react/jsx-runtime");
// forked from radix-ui
// https://github.com/radix-ui/primitives/blob/cfd8dcba5fa6a0e751486af418d05a7b88a7f541/packages/react/dismissable-layer/src/DismissableLayer.tsx#L324
var compose_refs_1 = require("@hanzogui/compose-refs");
var core_1 = require("@hanzogui/core");
var use_escape_keydown_1 = require("@hanzogui/use-escape-keydown");
var use_event_1 = require("@hanzogui/use-event");
var React = require("react");
var ReactDOM = require("react-dom");
function dispatchDiscreteCustomEvent(target, event) {
    if (target)
        ReactDOM.flushSync(function () { return target.dispatchEvent(event); });
}
/* -------------------------------------------------------------------------------------------------
 * Dismissable
 * -----------------------------------------------------------------------------------------------*/
var DISMISSABLE_LAYER_NAME = 'Dismissable';
var CONTEXT_UPDATE = 'dismissable.update';
var POINTER_DOWN_OUTSIDE = 'dismissable.pointerDownOutside';
var FOCUS_OUTSIDE = 'dismissable.focusOutside';
var originalBodyPointerEvents;
// global layer tracking
var globalLayers = new Set();
var layerChangeListeners = new Set();
// track if any layer has disableOutsidePointerEvents - only then do we need position updates
var layersWithPointerEventsDisabledCount = 0;
function notifyLayerChange() {
    for (var _i = 0, layerChangeListeners_1 = layerChangeListeners; _i < layerChangeListeners_1.length; _i++) {
        var listener = layerChangeListeners_1[_i];
        listener();
    }
}
/**
 * returns the number of active dismissable layers
 * useful for non-React contexts (e.g. escape key handlers)
 */
function getDismissableLayerCount() {
    return globalLayers.size;
}
/**
 * debug helper - logs what elements are registered as dismissable layers
 */
function debugDismissableLayers() {
    var layers = Array.from(globalLayers);
    console.log('[Dismissable] Active layers:', layers.length, layers);
    return layers;
}
/**
 * hook that returns true when any dismissable layer is active
 * re-renders when the state changes
 * uses module-level globals, not React context, so works anywhere in tree
 */
function useHasDismissableLayers() {
    var _a = React.useState(function () { return globalLayers.size; }), count = _a[0], setCount = _a[1];
    React.useEffect(function () {
        setCount(globalLayers.size);
        var update = function () { return setCount(globalLayers.size); };
        layerChangeListeners.add(update);
        return function () {
            layerChangeListeners.delete(update);
        };
    }, []);
    return count > 0;
}
var DismissableContext = React.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
});
/**
 * hook to check if a DOM element is inside an active dismissable layer
 * useful for custom escape handling - if inside a dismissable, you may want to defer
 */
function useIsInsideDismissable(ref) {
    var context = React.useContext(DismissableContext);
    var _a = React.useState(false), isInside = _a[0], setIsInside = _a[1];
    React.useEffect(function () {
        var check = function () {
            var el = ref.current;
            if (!el) {
                setIsInside(false);
                return;
            }
            for (var _i = 0, _a = context.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.contains(el)) {
                    setIsInside(true);
                    return;
                }
            }
            setIsInside(false);
        };
        check();
        document.addEventListener(CONTEXT_UPDATE, check);
        return function () { return document.removeEventListener(CONTEXT_UPDATE, check); };
    }, [context.layers, ref]);
    return isInside;
}
/**
 * hook to check if there are dismissable layers above a given element
 * returns the count of layers that are ancestors of the element
 */
function useDismissableLayersAbove(ref) {
    var context = React.useContext(DismissableContext);
    var _a = React.useState(0), count = _a[0], setCount = _a[1];
    React.useEffect(function () {
        var check = function () {
            var el = ref.current;
            if (!el) {
                setCount(0);
                return;
            }
            var above = 0;
            for (var _i = 0, _a = context.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer.contains(el)) {
                    above++;
                }
            }
            setCount(above);
        };
        check();
        document.addEventListener(CONTEXT_UPDATE, check);
        return function () { return document.removeEventListener(CONTEXT_UPDATE, check); };
    }, [context.layers, ref]);
    return count;
}
var Dismissable = React.forwardRef(function (props, forwardedRef) {
    var _a = props.disableOutsidePointerEvents, disableOutsidePointerEvents = _a === void 0 ? false : _a, forceUnmount = props.forceUnmount, onEscapeKeyDown = props.onEscapeKeyDown, onPointerDownOutside = props.onPointerDownOutside, onFocusOutside = props.onFocusOutside, onInteractOutside = props.onInteractOutside, onDismiss = props.onDismiss, asChild = props.asChild, children = props.children, branchesProp = props.branches, layerProps = __rest(props, ["disableOutsidePointerEvents", "forceUnmount", "onEscapeKeyDown", "onPointerDownOutside", "onFocusOutside", "onInteractOutside", "onDismiss", "asChild", "children", "branches"]);
    var Comp = asChild ? core_1.Slot : core_1.View;
    var context = React.useContext(DismissableContext);
    var _b = React.useState(null), node = _b[0], setNode = _b[1];
    var _c = React.useState({}), force = _c[1];
    var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, function (node) {
        return setNode(node);
    });
    var layers = Array.from(context.layers);
    var highestLayerWithOutsidePointerEventsDisabled = __spreadArray([], context.layersWithOutsidePointerEventsDisabled, true).slice(-1)[0];
    var highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    var index = node ? layers.indexOf(node) : -1;
    var isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    var isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    var pointerDownOutside = usePointerDownOutside(function (event) {
        var target = event.target;
        // check prop-based branches first (scoped to this dismissable), then global branches
        var branches = branchesProp || context.branches;
        var isPointerDownOnBranch = __spreadArray([], branches, true).some(function (branch) { return branch.contains(target); });
        if (!isPointerEventsEnabled || isPointerDownOnBranch)
            return;
        onPointerDownOutside === null || onPointerDownOutside === void 0 ? void 0 : onPointerDownOutside(event);
        onInteractOutside === null || onInteractOutside === void 0 ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented)
            onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    });
    var focusOutside = useFocusOutside(function (event) {
        var target = event.target;
        // check prop-based branches first (scoped to this dismissable), then global branches
        var branches = branchesProp || context.branches;
        var isFocusInBranch = __spreadArray([], branches, true).some(function (branch) { return branch.contains(target); });
        if (isFocusInBranch)
            return;
        onFocusOutside === null || onFocusOutside === void 0 ? void 0 : onFocusOutside(event);
        onInteractOutside === null || onInteractOutside === void 0 ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented)
            onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    });
    // track forceUnmount in a ref so escape handler can check it
    var forceUnmountRef = React.useRef(forceUnmount);
    React.useEffect(function () {
        forceUnmountRef.current = forceUnmount;
    }, [forceUnmount]);
    (0, use_escape_keydown_1.useEscapeKeydown)(function (event) {
        // skip if this layer is force-unmounted (e.g. dialog closed but still mounted)
        if (forceUnmountRef.current)
            return;
        // Check layers at callback time, not render time, to avoid stale closures
        var currentLayers = Array.from(context.layers);
        var currentIndex = node ? currentLayers.indexOf(node) : -1;
        var isHighestLayer = currentIndex === currentLayers.length - 1;
        if (!isHighestLayer)
            return;
        onEscapeKeyDown === null || onEscapeKeyDown === void 0 ? void 0 : onEscapeKeyDown(event);
        if (!event.defaultPrevented && onDismiss) {
            event.preventDefault();
            onDismiss();
        }
    });
    React.useEffect(function () {
        if (!node)
            return;
        // don't add to layers when force-unmounted (dialog closed but still mounted)
        if (forceUnmount)
            return;
        if (disableOutsidePointerEvents) {
            if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
                originalBodyPointerEvents = document.body.style.pointerEvents;
                document.body.style.pointerEvents = 'none';
            }
            context.layersWithOutsidePointerEventsDisabled.add(node);
            layersWithPointerEventsDisabledCount++;
        }
        context.layers.add(node);
        globalLayers.add(node);
        // only dispatch position update when pointer-events tracking is active
        if (disableOutsidePointerEvents || layersWithPointerEventsDisabledCount > 0) {
            dispatchUpdate();
        }
        notifyLayerChange();
        return function () {
            if (disableOutsidePointerEvents) {
                if (context.layersWithOutsidePointerEventsDisabled.size === 1) {
                    document.body.style.pointerEvents = originalBodyPointerEvents;
                }
                // decrement AFTER dispatch so other layers still re-render
            }
        };
    }, [node, disableOutsidePointerEvents, forceUnmount, context]);
    /**
     * We purposefully prevent combining this effect with the `disableOutsidePointerEvents` effect
     * because a change to `disableOutsidePointerEvents` would remove this layer from the stack
     * and add it to the end again so the layering order wouldn't be _creation order_.
     * We only want them to be removed from context stacks when unmounted.
     */
    React.useEffect(function () {
        if (forceUnmount)
            return;
        return function () {
            if (!node)
                return;
            var hadPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.has(node);
            context.layers.delete(node);
            context.layersWithOutsidePointerEventsDisabled.delete(node);
            globalLayers.delete(node);
            // only dispatch position update when pointer-events tracking is active
            if (layersWithPointerEventsDisabledCount > 0) {
                dispatchUpdate();
            }
            notifyLayerChange();
            // decrement count AFTER dispatch so other layers see count > 0 and re-render
            if (hadPointerEventsDisabled) {
                layersWithPointerEventsDisabledCount--;
            }
        };
    }, [node, context, forceUnmount]);
    React.useEffect(function () {
        var handleUpdate = function () {
            // only force re-render if we need to track layer positions for pointer-events
            // this avoids N^2 re-renders when multiple dismissables mount/unmount
            if (layersWithPointerEventsDisabledCount > 0) {
                force({});
            }
        };
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return function () { return document.removeEventListener(CONTEXT_UPDATE, handleUpdate); };
    }, []);
    return ((0, jsx_runtime_1.jsx)(Comp, __assign({}, layerProps, { 
        // @ts-ignore
        ref: composedRefs }, (!asChild && {
        display: 'contents',
    }), { pointerEvents: isBodyPointerEventsDisabled
            ? isPointerEventsEnabled
                ? 'auto'
                : 'none'
            : undefined, onFocusCapture: (0, core_1.composeEventHandlers)(props.onFocusCapture, focusOutside.onFocusCapture), onBlurCapture: (0, core_1.composeEventHandlers)(props.onBlurCapture, focusOutside.onBlurCapture), onPointerDownCapture: (0, core_1.composeEventHandlers)(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture), children: children })));
});
exports.Dismissable = Dismissable;
Dismissable.displayName = DISMISSABLE_LAYER_NAME;
/* -------------------------------------------------------------------------------------------------
 * DismissableBranch
 * -----------------------------------------------------------------------------------------------*/
var BRANCH_NAME = 'DismissableBranch';
var DismissableBranch = React.forwardRef(function (props, forwardedRef) {
    var branchesProp = props.branches, rest = __rest(props, ["branches"]);
    var context = React.useContext(DismissableContext);
    var ref = React.useRef(null);
    var composedRefs = (0, compose_refs_1.useComposedRefs)(forwardedRef, ref);
    React.useEffect(function () {
        var node = ref.current;
        if (!(node instanceof HTMLElement))
            return;
        // use prop-based branches if provided, otherwise fall back to global context
        var branches = branchesProp || context.branches;
        if (node && branches) {
            branches.add(node);
            return function () {
                branches.delete(node);
            };
        }
    }, [branchesProp, context.branches]);
    return (0, jsx_runtime_1.jsx)(core_1.View, __assign({ asChild: "except-style" }, rest, { ref: composedRefs }));
});
exports.DismissableBranch = DismissableBranch;
DismissableBranch.displayName = BRANCH_NAME;
/**
 * Listens for `pointerdown` outside a react subtree. We use `pointerdown` rather than `pointerup`
 * to mimic layer dismissing behaviour present in OS.
 * Returns props to pass to the node we want to check for outside events.
 */
function usePointerDownOutside(onPointerDownOutside) {
    var handlePointerDownOutside = (0, use_event_1.useEvent)(onPointerDownOutside);
    var isPointerInsideReactTreeRef = React.useRef(false);
    var handleClickRef = React.useRef(function () { });
    React.useEffect(function () {
        var handlePointerDown = function (event) {
            if (event.target && !isPointerInsideReactTreeRef.current) {
                var eventDetail_1 = { originalEvent: event };
                function handleAndDispatchPointerDownOutsideEvent() {
                    handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail_1, { discrete: true });
                }
                /**
                 * On touch devices, we need to wait for a click event because browsers implement
                 * a ~350ms delay between the time the user stops touching the display and when the
                 * browser executres events. We need to ensure we don't reactivate pointer-events within
                 * this timeframe otherwise the browser may execute events that should have been prevented.
                 *
                 * Additionally, this also lets us deal automatically with cancellations when a click event
                 * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
                 *
                 * This is why we also continuously remove the previous listener, because we cannot be
                 * certain that it was raised, and therefore cleaned-up.
                 */
                if (event.pointerType === 'touch') {
                    document.removeEventListener('click', handleClickRef.current);
                    handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
                    document.addEventListener('click', handleClickRef.current, { once: true });
                }
                else {
                    handleAndDispatchPointerDownOutsideEvent();
                }
            }
            isPointerInsideReactTreeRef.current = false;
        };
        /**
         * if this hook executes in a component that mounts via a `pointerdown` event, the event
         * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
         * this by delaying the event listener registration on the document.
         * This is not React specific, but rather how the DOM works, ie:
         * ```
         * button.addEventListener('pointerdown', () => {
         *   console.log('I will log');
         *   document.addEventListener('pointerdown', () => {
         *     console.log('I will also log');
         *   })
         * });
         */
        var timerId = setTimeout(function () {
            document.addEventListener('pointerdown', handlePointerDown);
        }, 0);
        return function () {
            window.clearTimeout(timerId);
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('click', handleClickRef.current);
        };
    }, [handlePointerDownOutside]);
    return {
        // ensures we check React component tree (not just DOM tree)
        onPointerDownCapture: function () {
            isPointerInsideReactTreeRef.current = true;
        },
    };
}
/**
 * Listens for when focus happens outside a react subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */
function useFocusOutside(onFocusOutside) {
    var handleFocusOutside = (0, use_event_1.useEvent)(onFocusOutside);
    var isFocusInsideReactTreeRef = React.useRef(false);
    React.useEffect(function () {
        var handleFocus = function (event) {
            if (event.target && !isFocusInsideReactTreeRef.current) {
                var eventDetail = { originalEvent: event };
                handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
                    discrete: false,
                });
            }
        };
        document.addEventListener('focusin', handleFocus);
        return function () { return document.removeEventListener('focusin', handleFocus); };
    }, [handleFocusOutside]);
    return {
        onFocusCapture: function () {
            isFocusInsideReactTreeRef.current = true;
        },
        onBlurCapture: function () {
            isFocusInsideReactTreeRef.current = false;
        },
    };
}
function dispatchUpdate() {
    var event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, _a) {
    var discrete = _a.discrete;
    var target = detail.originalEvent.target;
    var event = new CustomEvent(name, { bubbles: false, cancelable: true, detail: detail });
    if (handler)
        target.addEventListener(name, handler, { once: true });
    if (discrete) {
        dispatchDiscreteCustomEvent(target, event);
    }
    else {
        target.dispatchEvent(event);
    }
}
