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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComponentState = void 0;
var constants_1 = require("@hanzogui/constants");
var is_equal_shallow_1 = require("@hanzogui/is-equal-shallow");
var use_did_finish_ssr_1 = require("@hanzogui/use-did-finish-ssr");
var react_1 = require("react");
var config_1 = require("../config");
var defaultComponentState_1 = require("../defaultComponentState");
var isObj_1 = require("../helpers/isObj");
var log_1 = require("../helpers/log");
var useComponentState = function (props, animationDriver, staticConfig, config) {
    'use no memo';
    var _a;
    var _b, _c, _d;
    var isHydrated = (0, use_did_finish_ssr_1.useDidFinishSSR)();
    var needsHydration = !(0, use_did_finish_ssr_1.useIsClientOnly)();
    var useAnimations = (animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.isStub)
        ? undefined
        : animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.useAnimations;
    var isHOC = staticConfig.isHOC;
    var stateRef = (0, react_1.useRef)(
    // performance: avoid creating object every render
    undefined);
    if (!stateRef.current) {
        stateRef.current = {
            startedUnhydrated: needsHydration && !isHydrated,
        };
    }
    // after we get states mount we need to turn off isAnimated for server side
    var hasAnimationProp = Boolean((!isHOC && 'transition' in props) ||
        (props.style && hasAnimatedStyleValue(props.style)));
    var inputStyle = (_b = animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.inputStyle) !== null && _b !== void 0 ? _b : 'css';
    var outputStyle = (_c = animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.outputStyle) !== null && _c !== void 0 ? _c : 'css';
    var curStateRef = stateRef.current;
    if (!needsHydration && hasAnimationProp) {
        curStateRef.hasAnimated = true;
    }
    var willBeAnimatedClient = (function () {
        var next = !!(hasAnimationProp && !isHOC && useAnimations);
        return Boolean(next || curStateRef.hasAnimated);
    })();
    var willBeAnimated = !constants_1.isServer && willBeAnimatedClient;
    // once animated, always animated to preserve hooks / vdom structure
    if (willBeAnimated && !curStateRef.hasAnimated) {
        curStateRef.hasAnimated = true;
    }
    var disableClassName = props.disableClassName;
    // HOOK
    var presence = (!isHOC &&
        willBeAnimated &&
        props['animatePresence'] !== false &&
        ((_d = animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.usePresence) === null || _d === void 0 ? void 0 : _d.call(animationDriver))) ||
        null;
    var presenceState = presence === null || presence === void 0 ? void 0 : presence[2];
    var isExiting = (presenceState === null || presenceState === void 0 ? void 0 : presenceState.isPresent) === false;
    var isEntering = (presenceState === null || presenceState === void 0 ? void 0 : presenceState.isPresent) === true && presenceState.initial !== false;
    var hasEnterStyle = !!props.enterStyle;
    var hasAnimationThatNeedsHydrate = hasAnimationProp &&
        !isHydrated &&
        ((animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.isReactNative) || inputStyle !== 'css');
    var canImmediatelyEnter = hasEnterStyle || isEntering;
    // this can be conditional because its only ever needed with animations
    var shouldEnter = !isHOC &&
        (hasEnterStyle ||
            isEntering ||
            hasAnimationThatNeedsHydrate ||
            // disableClassName doesnt work server side, only client, so needs hydrate
            // this is just for a better ux, supports css variables for light/dark, media queries, etc
            disableClassName);
    // two stage enter: because we switch from css driver to spring driver
    //   - first render: render to match server with css driver
    //   - second render: state.unmounted = should-enter, still rendering the initial,
    //     non-entered state but now with the spring animation driver
    var initialState = shouldEnter
        ? // on the very first render we switch all spring animation drivers to css rendering
            // this is because we need to use css variables, which they don't support to do proper SSR
            // without flickers of the wrong colors.
            // but once we do that initial hydration and we are in client side rendering mode,
            // we can avoid the extra re-render on mount
            canImmediatelyEnter
                ? defaultComponentState_1.defaultComponentStateShouldEnter
                : defaultComponentState_1.defaultComponentState
        : defaultComponentState_1.defaultComponentStateMounted;
    // will be nice to deprecate half of these:
    var disabled = isDisabled(props);
    if (disabled != null) {
        initialState.disabled = disabled;
    }
    // HOOK
    var states = (0, react_1.useState)(initialState);
    var state = props.forceStyle ? __assign(__assign({}, states[0]), (_a = {}, _a[props.forceStyle] = true, _a)) : states[0];
    var setState = states[1];
    // apply states we never updated from avoiding re-renders in animation driver
    // unsafe yea yea
    // if (stateRef.current.nextComponentState) {
    //   Object.assign(state, stateRef.current.nextComponentState)
    // }
    // only web server + initial client render run this when not hydrated:
    var isAnimated = willBeAnimated;
    if (constants_1.isWeb && hasAnimationThatNeedsHydrate && !staticConfig.isHOC && !isHydrated) {
        isAnimated = false;
        curStateRef.willHydrate = true;
    }
    // immediately update disabled state and reset component state
    if (disabled !== state.disabled) {
        // if disabled remove all press/focus/hover states
        if (disabled) {
            Object.assign(state, defaultComponentState_1.defaultComponentStateMounted);
        }
        state.disabled = disabled;
        setState(function (_) { return (__assign({}, state)); });
    }
    var groupName = props.group;
    var setStateShallow = (0, is_equal_shallow_1.useCreateShallowSetState)(setState, props.debug);
    // set enter/exit variants onto our new props object
    if (presenceState && isAnimated && isHydrated && staticConfig.variants) {
        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
            console.warn("has presenceState ".concat(JSON.stringify(presenceState)));
        }
        var enterVariant = presenceState.enterVariant, exitVariant = presenceState.exitVariant, enterExitVariant = presenceState.enterExitVariant, custom = presenceState.custom;
        if ((0, isObj_1.isObj)(custom)) {
            Object.assign(props, custom);
        }
        var exv = exitVariant !== null && exitVariant !== void 0 ? exitVariant : enterExitVariant;
        var env = enterVariant !== null && enterVariant !== void 0 ? enterVariant : enterExitVariant;
        if (state.unmounted && env && staticConfig.variants[env]) {
            if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
                console.warn("Animating presence ENTER \"".concat(env, "\""));
            }
            props[env] = true;
        }
        else if (isExiting && exv) {
            if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
                console.warn("Animating presence EXIT \"".concat(exv, "\""));
            }
            props[exv] = exitVariant !== enterExitVariant;
        }
    }
    var noClass = !constants_1.isWeb || !!props.forceStyle;
    if (!isHydrated) {
        noClass = false;
    }
    else {
        // on server for SSR and animation compat added the && isHydrated but perhaps we want
        // disableClassName="until-hydrated" to be more straightforward
        // see issue if not, Button sets disableClassName to true <Button transition="" /> with
        // the react-native driver errors because it tries to animate var(--color) to rbga(..)
        // no matter what if fully unmounted or on the server we use className
        // only once we hydrate do we switch to spring animation drivers or disableClassName etc
        if (constants_1.isWeb && isHydrated) {
            var isAnimatedAndHydrated = isAnimated && isHydrated;
            var isClassNameDisabled = !staticConfig.acceptsClassName && ((0, config_1.getSetting)('disableSSR') || !state.unmounted);
            var isDisabledManually = disableClassName && !state.unmounted;
            if (
            // Only disable className for animation drivers that output inline styles (not css)
            (isAnimatedAndHydrated && outputStyle !== 'css') ||
                isDisabledManually ||
                isClassNameDisabled) {
                noClass = true;
                if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
                    (0, log_1.log)("avoiding className", {
                        isAnimatedAndHydrated: isAnimatedAndHydrated,
                        isDisabledManually: isDisabledManually,
                        isClassNameDisabled: isClassNameDisabled,
                    });
                }
            }
        }
    }
    return {
        startedUnhydrated: curStateRef.startedUnhydrated,
        curStateRef: curStateRef,
        disabled: disabled,
        groupName: groupName,
        hasAnimationProp: hasAnimationProp,
        hasEnterStyle: hasEnterStyle,
        isAnimated: isAnimated,
        isExiting: isExiting,
        isHydrated: isHydrated,
        presence: presence,
        presenceState: presenceState,
        setState: setState,
        setStateShallow: setStateShallow,
        noClass: noClass,
        state: state,
        stateRef: stateRef,
        inputStyle: inputStyle,
        outputStyle: outputStyle,
        willBeAnimated: willBeAnimated,
        willBeAnimatedClient: willBeAnimatedClient,
    };
};
exports.useComponentState = useComponentState;
function hasAnimatedStyleValue(style) {
    return Object.keys(style).some(function (k) {
        var val = style[k];
        return val && typeof val === 'object' && '_animation' in val;
    });
}
var isDisabled = function (props) {
    var _a;
    return (props.disabled ||
        props.passThrough ||
        ((_a = props.accessibilityState) === null || _a === void 0 ? void 0 : _a.disabled) ||
        props['aria-disabled'] ||
        props.accessibilityDisabled ||
        false);
};
