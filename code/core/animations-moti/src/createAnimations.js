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
exports.createAnimations = createAnimations;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck - deprecated package, moti dependency intentionally not included
var use_presence_1 = require("@hanzogui/use-presence");
// we need core for hooks.usePropsTransform
var core_1 = require("@hanzogui/core");
// Helper to resolve dynamic theme values like {dynamic: {dark: "value", light: undefined}}
var resolveDynamicValue = function (value, isDark) {
    if (value && typeof value === 'object' && 'dynamic' in value) {
        var dynamicValue = isDark ? value.dynamic.dark : value.dynamic.light;
        return dynamicValue;
    }
    return value;
};
var author_1 = require("moti/author");
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
// fix for building with type module
// see https://github.com/evanw/esbuild/issues/2480#issuecomment-1833104754
var safeESModule = function (a) {
    var b = a;
    var out = b.__esModule || b[Symbol.toStringTag] === 'Module' ? b.default : b;
    // add metro support
    return out || a;
};
var Animated = safeESModule(react_native_reanimated_1.default);
// this is our own custom reanimated animated component so we can allow data- attributes, className etc
// this should ultimately be merged with react-native-web-lite
function createHanzoguiAnimatedComponent(defaultTag) {
    if (defaultTag === void 0) { defaultTag = 'div'; }
    var isText = defaultTag === 'span';
    var Component = Animated.createAnimatedComponent((0, react_1.forwardRef)(function (propsIn, ref) {
        var _a;
        var forwardedRef = propsIn.forwardedRef, animation = propsIn.animation, _b = propsIn.render, render = _b === void 0 ? defaultTag : _b, propsRest = __rest(propsIn, ["forwardedRef", "animation", "render"]);
        var hostRef = (0, react_1.useRef)(null);
        var composedRefs = (0, core_1.useComposedRefs)(forwardedRef, ref, hostRef);
        var stateRef = (0, react_1.useRef)(null);
        if (!stateRef.current) {
            stateRef.current = {
                get host() {
                    return hostRef.current;
                },
            };
        }
        var _c = (0, core_1.useThemeWithState)({}), _ = _c[0], state = _c[1];
        // get styles but only inline style
        var result = (0, core_1.getSplitStyles)(propsRest, isText ? core_1.Text.staticConfig : core_1.View.staticConfig, state === null || state === void 0 ? void 0 : state.theme, state === null || state === void 0 ? void 0 : state.name, {
            unmounted: false,
        }, {
            isAnimated: false,
            noClass: true,
        });
        var props = (result === null || result === void 0 ? void 0 : result.viewProps) || {};
        var Element = render;
        var transformedProps = (_a = core_1.hooks.usePropsTransform) === null || _a === void 0 ? void 0 : _a.call(core_1.hooks, render, props, stateRef, false);
        return (0, jsx_runtime_1.jsx)(Element, __assign({}, transformedProps, { ref: composedRefs }));
    }));
    Component['acceptRenderProp'] = true;
    return Component;
}
var AnimatedView = createHanzoguiAnimatedComponent('div');
var AnimatedText = createHanzoguiAnimatedComponent('span');
// const AnimatedView = styled(View, {
//   disableClassName: true,
// })
// const AnimatedText = styled(Text, {
//   disableClassName: true,
// })
var onlyAnimateKeys = {
    transform: true,
    opacity: true,
    height: true,
    width: true,
    backgroundColor: true,
    borderColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderTopColor: true,
    borderBottomColor: true,
    borderRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    borderLeftWidth: true,
    borderRightWidth: true,
    borderTopWidth: true,
    borderBottomWidth: true,
    color: true,
    left: true,
    right: true,
    top: true,
    bottom: true,
    fontSize: true,
    fontWeight: true,
    lineHeight: true,
    letterSpacing: true,
};
function createAnimations(animations) {
    return {
        needsCustomComponent: true,
        View: core_1.isWeb ? AnimatedView : Animated.View,
        Text: core_1.isWeb ? AnimatedText : Animated.Text,
        // View: Animated.View,
        // Text: Animated.Text,
        isReactNative: true,
        inputStyle: 'value',
        outputStyle: 'inline',
        animations: animations,
        usePresence: use_presence_1.usePresence,
        ResetPresence: use_presence_1.ResetPresence,
        useAnimatedNumber: function (initial) {
            var sharedValue = (0, react_native_reanimated_1.useSharedValue)(initial);
            return react_1.default.useMemo(function () { return ({
                getInstance: function () {
                    'worklet';
                    return sharedValue;
                },
                getValue: function () {
                    'worklet';
                    return sharedValue.value;
                },
                setValue: function (next, config, onFinish) {
                    'worklet';
                    if (config === void 0) { config = { type: 'spring' }; }
                    if (config.type === 'direct') {
                        sharedValue.value = next;
                        onFinish === null || onFinish === void 0 ? void 0 : onFinish();
                    }
                    else if (config.type === 'spring') {
                        sharedValue.value = (0, react_native_reanimated_1.withSpring)(next, config, onFinish
                            ? function () {
                                'worklet';
                                (0, react_native_reanimated_1.runOnJS)(onFinish)();
                            }
                            : undefined);
                    }
                    else {
                        sharedValue.value = (0, react_native_reanimated_1.withTiming)(next, config, onFinish
                            ? function () {
                                'worklet';
                                (0, react_native_reanimated_1.runOnJS)(onFinish)();
                            }
                            : undefined);
                    }
                },
                stop: function () {
                    'worklet';
                    (0, react_native_reanimated_1.cancelAnimation)(sharedValue);
                },
            }); }, [sharedValue]);
        },
        useAnimatedNumberReaction: function (_a, onValue) {
            var value = _a.value;
            var instance = value.getInstance();
            return (0, react_native_reanimated_1.useAnimatedReaction)(function () {
                return instance.value;
            }, function (next, prev) {
                if (prev !== next) {
                    // @nate what is the point of this hook? is this necessary?
                    // without runOnJS, onValue would need to be a worklet
                    (0, react_native_reanimated_1.runOnJS)(onValue)(next);
                }
            }, 
            // dependency array is very important here
            [onValue, instance]);
        },
        /**
         * `getStyle` must be a worklet
         */
        useAnimatedNumberStyle: function (val, getStyle) {
            var instance = val.getInstance();
            // this seems wrong but it works
            var derivedValue = (0, react_native_reanimated_1.useDerivedValue)(function () {
                return instance.value;
                // dependency array is very important here
            }, [instance, getStyle]);
            return (0, react_native_reanimated_1.useAnimatedStyle)(function () {
                return getStyle(derivedValue.value);
                // dependency array is very important here
            }, [val, getStyle, derivedValue, instance]);
        },
        useAnimations: function (animationProps) {
            var _a;
            var props = animationProps.props, presence = animationProps.presence, style = animationProps.style, componentState = animationProps.componentState;
            var animationKey = Array.isArray(props.transition)
                ? props.transition[0]
                : props.transition;
            var isHydrating = componentState.unmounted === true;
            var disableAnimation = isHydrating || !animationKey;
            var presenceContext = react_1.default.useContext(use_presence_1.PresenceContext);
            var _b = (0, core_1.useThemeWithState)({}), themeState = _b[1];
            // Check scheme first, then fall back to checking theme name for 'dark'
            var isDark = (themeState === null || themeState === void 0 ? void 0 : themeState.scheme) === 'dark' || ((_a = themeState === null || themeState === void 0 ? void 0 : themeState.name) === null || _a === void 0 ? void 0 : _a.startsWith('dark'));
            // this memo is very important for performance, there's a big cost to
            // updating these values every render
            var _c = (0, react_1.useMemo)(function () {
                var animate = {};
                var dontAnimate = {};
                if (disableAnimation) {
                    // Resolve dynamic objects based on current theme
                    for (var key in style) {
                        var rawValue = style[key];
                        var value = resolveDynamicValue(rawValue, isDark);
                        if (value === undefined)
                            continue;
                        dontAnimate[key] = value;
                    }
                }
                else {
                    var animateOnly = props.animateOnly;
                    for (var key in style) {
                        var rawValue = style[key];
                        // Resolve dynamic theme values (like $theme-dark)
                        var value = resolveDynamicValue(rawValue, isDark);
                        if (value === undefined)
                            continue;
                        if (!onlyAnimateKeys[key] ||
                            value === 'auto' ||
                            (typeof value === 'string' && value.startsWith('calc')) ||
                            (animateOnly && !animateOnly.includes(key))) {
                            dontAnimate[key] = value;
                        }
                        else {
                            animate[key] = value;
                        }
                    }
                }
                // if we don't do this moti seems to flicker a frame before applying animation
                if (componentState.unmounted === 'should-enter') {
                    // Resolve dynamic objects based on current theme
                    for (var key in style) {
                        var rawValue = style[key];
                        var value = resolveDynamicValue(rawValue, isDark);
                        if (value === undefined)
                            continue;
                        dontAnimate[key] = value;
                    }
                }
                var styles = animate;
                var isExiting = Boolean(presence === null || presence === void 0 ? void 0 : presence[1]);
                var usePresenceValue = (presence || undefined);
                // TODO moti is giving us type troubles, but this should work
                var transition = isHydrating
                    ? { type: 'transition', duration: 0 }
                    : animations[animationKey];
                var hasClonedTransition = false;
                if (Array.isArray(props.transition)) {
                    var config = props.transition[1];
                    if (config && typeof config === 'object') {
                        for (var key in config) {
                            var val = config[key];
                            // performance - this seems to have (strangely) huge performance effect in uniswap
                            // so instead of cloning up front, we clone only when we absolutely have to
                            if (!hasClonedTransition) {
                                transition = Object.assign({}, transition);
                                hasClonedTransition = true;
                            }
                            // referencing a pre-defined config
                            if (typeof val === 'string') {
                                transition[key] = animations[val];
                            }
                            else {
                                transition[key] = val;
                            }
                        }
                    }
                }
                return {
                    dontAnimate: dontAnimate,
                    motiProps: {
                        animate: isExiting || componentState.unmounted === true ? {} : styles,
                        transition: componentState.unmounted ? { duration: 0 } : transition,
                        usePresenceValue: usePresenceValue,
                        presenceContext: presenceContext,
                        exit: isExiting ? styles : undefined,
                    },
                };
            }, [
                presenceContext,
                presence,
                animationKey,
                componentState.unmounted,
                JSON.stringify(style),
                presenceContext,
                isDark,
            ]), dontAnimate = _c.dontAnimate, motiProps = _c.motiProps;
            var moti = (0, author_1.useMotify)(motiProps);
            if (process.env.NODE_ENV === 'development' &&
                props['debug'] &&
                props['debug'] !== 'profile') {
                console.info("useMotify(", JSON.stringify(motiProps, null, 2) + ')', {
                    'componentState.unmounted': componentState.unmounted,
                    animationProps: animationProps,
                    motiProps: motiProps,
                    moti: moti,
                    style: [dontAnimate, moti.style],
                });
            }
            return {
                style: [dontAnimate, moti.style],
            };
        },
    };
}
