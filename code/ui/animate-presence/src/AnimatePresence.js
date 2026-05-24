"use strict";
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
exports.AnimatePresence = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var use_constant_1 = require("@hanzogui/use-constant");
var use_force_update_1 = require("@hanzogui/use-force-update");
var react_2 = require("react");
var LayoutGroupContext_1 = require("./LayoutGroupContext");
var PresenceChild_1 = require("./PresenceChild");
var getChildKey = function (child) {
    return (child.key ||
        (function () {
            // we can help a bit by falling back to hanzogui name or component name
            var ct = child.type;
            var defaultName = ct['displayName'] || ct['name'] || '';
            if (ct && typeof ct === 'object' && 'staticConfig' in ct) {
                // @ts-expect-error
                return ct.staticConfig.componentName || defaultName;
            }
            return defaultName;
        })());
};
function onlyElements(children) {
    var filtered = [];
    // We use forEach here instead of map as map mutates the component key by preprending `.$`
    react_2.Children.forEach(children, function (child) {
        if ((0, react_2.isValidElement)(child))
            filtered.push(child);
    });
    return filtered;
}
var AnimatePresence = function (_a) {
    var _b;
    var children = _a.children, enterVariant = _a.enterVariant, exitVariant = _a.exitVariant, enterExitVariant = _a.enterExitVariant, _c = _a.initial, initial = _c === void 0 ? true : _c, onExitComplete = _a.onExitComplete, exitBeforeEnter = _a.exitBeforeEnter, mode = _a.mode, _d = _a.presenceAffectsLayout, presenceAffectsLayout = _d === void 0 ? true : _d, custom = _a.custom, passThrough = _a.passThrough;
    // Determine effective mode: mode prop takes precedence, then exitBeforeEnter for backwards compatibility
    var effectiveMode = mode !== null && mode !== void 0 ? mode : (exitBeforeEnter ? 'wait' : 'sync');
    /**
     * Filter any children that aren't ReactElements. We can only track components
     * between renders with a props.key.
     * IMPORTANT: useMemo ensures reference stability for the comparison below
     */
    var presentChildren = (0, react_2.useMemo)(function () { return onlyElements(children); }, [children]);
    /**
     * Track the keys of the currently rendered children.
     */
    var presentKeys = presentChildren.map(getChildKey);
    /**
     * If `initial={false}` we only want to pass this to components in the first render.
     */
    var isInitialRender = (0, react_2.useRef)(true);
    /**
     * Freeze custom prop for exiting children so direction doesn't reverse mid-exit.
     */
    var frozenCustomRef = (0, react_2.useRef)(new Map());
    /**
     * A ref containing the currently present children. When all exit animations
     * are complete, we use this to re-render with the latest children *committed*
     * rather than the latest children *rendered*.
     */
    var pendingPresentChildren = (0, react_2.useRef)(presentChildren);
    /**
     * Track which exiting children have finished animating out.
     */
    var exitComplete = (0, use_constant_1.useConstant)(function () { return new Map(); });
    /**
     * Save children to render as React state. To ensure this component is concurrent-safe,
     * we check for exiting children via an effect.
     */
    var _e = (0, react_2.useState)(presentChildren), diffedChildren = _e[0], setDiffedChildren = _e[1];
    var _f = (0, react_2.useState)(presentChildren), renderedChildren = _f[0], setRenderedChildren = _f[1];
    /**
     * If we've been provided a forceRender function by the LayoutGroupContext,
     * we can use it to force a re-render amongst all surrounding components once
     * all components have finished animating out.
     */
    var forceRender = (_b = (0, react_2.useContext)(LayoutGroupContext_1.LayoutGroupContext).forceRender) !== null && _b !== void 0 ? _b : (0, use_force_update_1.useForceUpdate)();
    if (passThrough) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    // useInsertionEffect runs before ALL useLayoutEffects (including children's)
    // this ensures pendingPresentChildren and exitComplete are set before
    // animation drivers call sendExitComplete() in their layout effects
    // (critical for immediate completions like animateOnly=[])
    (0, react_1.useInsertionEffect)(function () {
        isInitialRender.current = false;
        pendingPresentChildren.current = presentChildren;
        /**
         * Update complete status of exiting children.
         */
        for (var i = 0; i < renderedChildren.length; i++) {
            var key = getChildKey(renderedChildren[i]);
            if (!presentKeys.includes(key)) {
                if (exitComplete.get(key) !== true) {
                    exitComplete.set(key, false);
                }
            }
            else {
                exitComplete.delete(key);
                frozenCustomRef.current.delete(key);
            }
        }
    }, [renderedChildren, presentKeys.length, presentKeys.join('-')]);
    if (presentChildren !== diffedChildren) {
        var nextChildren = __spreadArray([], presentChildren, true);
        /**
         * Loop through all the currently rendered components and decide which
         * are exiting.
         */
        for (var i = 0; i < renderedChildren.length; i++) {
            var child = renderedChildren[i];
            var key = getChildKey(child);
            if (!presentKeys.includes(key)) {
                nextChildren.splice(i, 0, child);
                // freeze custom at the moment of exit so direction doesn't reverse
                if (!frozenCustomRef.current.has(key)) {
                    frozenCustomRef.current.set(key, custom);
                }
            }
        }
        /**
         * If we're in "wait" mode, and we have exiting children, we want to
         * only render these until they've all exited.
         */
        var exitingChildren = renderedChildren.filter(function (child) { return !presentKeys.includes(getChildKey(child)); });
        if (effectiveMode === 'wait' && exitingChildren.length) {
            nextChildren = exitingChildren;
        }
        setRenderedChildren(onlyElements(nextChildren));
        setDiffedChildren(presentChildren);
        /**
         * Early return to ensure once we've set state with the latest diffed
         * children, we can immediately re-render.
         */
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: renderedChildren.map(function (child) {
            var _a;
            var key = getChildKey(child);
            var isPresent = presentChildren === renderedChildren || presentKeys.includes(key);
            var onExit = function () {
                if (exitComplete.has(key)) {
                    exitComplete.set(key, true);
                }
                else {
                    return;
                }
                var isEveryExitComplete = true;
                exitComplete.forEach(function (isExitComplete) {
                    if (!isExitComplete)
                        isEveryExitComplete = false;
                });
                if (isEveryExitComplete) {
                    forceRender === null || forceRender === void 0 ? void 0 : forceRender();
                    setRenderedChildren(pendingPresentChildren.current);
                    onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
                }
            };
            return ((0, jsx_runtime_1.jsx)(PresenceChild_1.PresenceChild, { isPresent: isPresent, initial: !isInitialRender.current || initial ? undefined : false, custom: isPresent ? custom : ((_a = frozenCustomRef.current.get(key)) !== null && _a !== void 0 ? _a : custom), presenceAffectsLayout: presenceAffectsLayout, enterExitVariant: enterExitVariant, enterVariant: enterVariant, exitVariant: exitVariant, onExitComplete: isPresent ? undefined : onExit, children: child }, key));
        }) }));
};
exports.AnimatePresence = AnimatePresence;
exports.AnimatePresence.displayName = 'AnimatePresence';
