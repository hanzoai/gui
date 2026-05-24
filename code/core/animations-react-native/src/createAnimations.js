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
exports.useAnimatedNumbersStyle = exports.useAnimatedNumberStyle = exports.useAnimatedNumberReaction = exports.AnimatedText = exports.AnimatedView = void 0;
exports.useAnimatedNumber = useAnimatedNumber;
exports.createAnimations = createAnimations;
var animation_helpers_1 = require("@hanzogui/animation-helpers");
var constants_1 = require("@hanzogui/constants");
var use_presence_1 = require("@hanzogui/use-presence");
var web_1 = require("@hanzogui/web");
var react_1 = require("react");
var react_native_1 = require("react-native");
// detect Fabric (New Architecture) — Paper doesn't support native driver for all style keys
var isFabric = !constants_1.isWeb && typeof global !== 'undefined' && !!global.__nativeFabricUIManager;
// Helper to resolve dynamic theme values like {dynamic: {dark: "value", light: undefined}}
var resolveDynamicValue = function (value, isDark) {
    if (value && typeof value === 'object' && 'dynamic' in value) {
        var dynamicValue = isDark ? value.dynamic.dark : value.dynamic.light;
        return dynamicValue;
    }
    return value;
};
var animatedStyleKey = {
    transform: true,
    opacity: true,
};
var colorStyleKey = {
    backgroundColor: true,
    color: true,
    borderColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderTopColor: true,
    borderBottomColor: true,
};
// these style keys are costly to animate and only work with native driver on Fabric
var costlyToAnimateStyleKey = __assign({ borderRadius: true, borderTopLeftRadius: true, borderTopRightRadius: true, borderBottomLeftRadius: true, borderBottomRightRadius: true, borderWidth: true, borderLeftWidth: true, borderRightWidth: true, borderTopWidth: true, borderBottomWidth: true }, colorStyleKey);
exports.AnimatedView = react_native_1.Animated.View;
exports.AnimatedText = react_native_1.Animated.Text;
function useAnimatedNumber(initial) {
    var state = react_1.default.useRef(null);
    if (!state.current) {
        state.current = {
            composite: null,
            val: new react_native_1.Animated.Value(initial),
            strategy: { type: 'spring' },
        };
    }
    return {
        getInstance: function () {
            return state.current.val;
        },
        getValue: function () {
            return state.current.val['_value'];
        },
        stop: function () {
            var _a;
            (_a = state.current.composite) === null || _a === void 0 ? void 0 : _a.stop();
            state.current.composite = null;
        },
        setValue: function (next, _a, onFinish) {
            var _b, _c;
            if (_a === void 0) { _a = { type: 'spring' }; }
            var type = _a.type, config = __rest(_a, ["type"]);
            var val = state.current.val;
            var handleFinish = onFinish
                ? function (_a) {
                    var finished = _a.finished;
                    return (finished ? onFinish() : null);
                }
                : undefined;
            if (type === 'direct') {
                val.setValue(next);
            }
            else if (type === 'spring') {
                (_b = state.current.composite) === null || _b === void 0 ? void 0 : _b.stop();
                var composite = react_native_1.Animated.spring(val, __assign(__assign({}, config), { toValue: next, useNativeDriver: isFabric }));
                composite.start(handleFinish);
                state.current.composite = composite;
            }
            else {
                (_c = state.current.composite) === null || _c === void 0 ? void 0 : _c.stop();
                var composite = react_native_1.Animated.timing(val, __assign(__assign({}, config), { toValue: next, useNativeDriver: isFabric }));
                composite.start(handleFinish);
                state.current.composite = composite;
            }
        },
    };
}
var useAnimatedNumberReaction = function (_a, onValue) {
    var value = _a.value;
    var onChange = (0, web_1.useEvent)(function (current) {
        onValue(current.value);
    });
    react_1.default.useEffect(function () {
        var id = value.getInstance().addListener(onChange);
        return function () {
            value.getInstance().removeListener(id);
        };
    }, [value, onChange]);
};
exports.useAnimatedNumberReaction = useAnimatedNumberReaction;
var useAnimatedNumberStyle = function (value, getStyle) {
    return getStyle(value.getInstance());
};
exports.useAnimatedNumberStyle = useAnimatedNumberStyle;
var useAnimatedNumbersStyle = function (vals, getStyle) {
    return getStyle.apply(void 0, vals.map(function (v) { return v.getInstance(); }));
};
exports.useAnimatedNumbersStyle = useAnimatedNumbersStyle;
function createAnimations(animations, options) {
    var _a;
    var nativeDriver = (_a = options === null || options === void 0 ? void 0 : options.useNativeDriver) !== null && _a !== void 0 ? _a : isFabric;
    return {
        isReactNative: true,
        inputStyle: 'value',
        outputStyle: 'inline',
        avoidReRenders: true,
        animations: animations,
        needsCustomComponent: true,
        View: exports.AnimatedView,
        Text: exports.AnimatedText,
        useAnimatedNumber: useAnimatedNumber,
        useAnimatedNumberReaction: exports.useAnimatedNumberReaction,
        useAnimatedNumberStyle: exports.useAnimatedNumberStyle,
        useAnimatedNumbersStyle: exports.useAnimatedNumbersStyle,
        usePresence: use_presence_1.usePresence,
        ResetPresence: use_presence_1.ResetPresence,
        useAnimations: function (_a) {
            var _b;
            var props = _a.props, onDidAnimate = _a.onDidAnimate, style = _a.style, componentState = _a.componentState, presence = _a.presence, useStyleEmitter = _a.useStyleEmitter;
            var isDisabled = constants_1.isWeb && componentState.unmounted === true;
            var isExiting = (presence === null || presence === void 0 ? void 0 : presence[0]) === false;
            var sendExitComplete = presence === null || presence === void 0 ? void 0 : presence[1];
            var _c = (0, web_1.useThemeWithState)({}), themeState = _c[1];
            // Check scheme first, then fall back to checking theme name for 'dark'
            var isDark = (themeState === null || themeState === void 0 ? void 0 : themeState.scheme) === 'dark' || ((_b = themeState === null || themeState === void 0 ? void 0 : themeState.name) === null || _b === void 0 ? void 0 : _b.startsWith('dark'));
            /** store Animated value of each key e.g: color: AnimatedValue */
            var animateStyles = react_1.default.useRef({});
            var animatedTranforms = react_1.default.useRef([]);
            var animationsState = react_1.default.useRef(new WeakMap());
            // exit cycle guards to prevent stale/duplicate completion
            var exitCycleIdRef = react_1.default.useRef(0);
            var exitCompletedRef = react_1.default.useRef(false);
            var wasExitingRef = react_1.default.useRef(false);
            // detect transition into/out of exiting state
            var justStartedExiting = isExiting && !wasExitingRef.current;
            var justStoppedExiting = !isExiting && wasExitingRef.current;
            // start new exit cycle only on transition INTO exiting
            if (justStartedExiting) {
                exitCycleIdRef.current++;
                exitCompletedRef.current = false;
            }
            // invalidate pending callbacks when exit is canceled/interrupted
            if (justStoppedExiting) {
                exitCycleIdRef.current++;
            }
            var animateOnly = props.animateOnly || [];
            var hasTransitionOnly = !!props.animateOnly;
            // Track if we just finished entering (transition from entering to not entering)
            // must be declared before args array that uses justFinishedEntering
            var isEntering = !!componentState.unmounted;
            var wasEnteringRef = react_1.default.useRef(isEntering);
            var justFinishedEntering = wasEnteringRef.current && !isEntering;
            react_1.default.useEffect(function () {
                wasEnteringRef.current = isEntering;
            });
            var args = [
                JSON.stringify(style),
                componentState,
                isExiting,
                !!onDidAnimate,
                isDark,
                justFinishedEntering,
                hasTransitionOnly,
            ];
            var res = react_1.default.useMemo(function () {
                var _a;
                var _b;
                var runners = [];
                var completions = [];
                // Determine animation state for enter/exit transitions
                // Use 'enter' if we're entering OR if we just finished entering
                var animationState = isExiting
                    ? 'exit'
                    : isEntering || justFinishedEntering
                        ? 'enter'
                        : 'default';
                var nonAnimatedStyle = {};
                for (var key in style) {
                    var rawVal = style[key];
                    // Resolve dynamic theme values (like $theme-dark)
                    var val = resolveDynamicValue(rawVal, isDark);
                    if (val === undefined)
                        continue;
                    if (isDisabled) {
                        continue;
                    }
                    if (animatedStyleKey[key] == null && !costlyToAnimateStyleKey[key]) {
                        nonAnimatedStyle[key] = val;
                        continue;
                    }
                    if (hasTransitionOnly && !animateOnly.includes(key)) {
                        nonAnimatedStyle[key] = val;
                        continue;
                    }
                    if (key !== 'transform') {
                        animateStyles.current[key] = update(key, animateStyles.current[key], val);
                        continue;
                    }
                    // key: 'transform'
                    // for now just support one transform key
                    if (!val)
                        continue;
                    if (typeof val === 'string') {
                        console.warn("Warning: Hanzogui can't animate string transforms yet!");
                        continue;
                    }
                    for (var _i = 0, _c = val.entries(); _i < _c.length; _i++) {
                        var _d = _c[_i], index = _d[0], transform = _d[1];
                        if (!transform)
                            continue;
                        // tkey: e.g: 'translateX'
                        var tkey = Object.keys(transform)[0];
                        var currentTransform = (_b = animatedTranforms.current[index]) === null || _b === void 0 ? void 0 : _b[tkey];
                        animatedTranforms.current[index] = (_a = {},
                            _a[tkey] = update(tkey, currentTransform, transform[tkey]),
                            _a);
                        animatedTranforms.current = __spreadArray([], animatedTranforms.current, true);
                    }
                }
                var animatedTransformStyle = animatedTranforms.current.length > 0
                    ? {
                        transform: animatedTranforms.current.map(function (r) {
                            var _a;
                            var _b;
                            var key = Object.keys(r)[0];
                            var val = ((_b = animationsState.current.get(r[key])) === null || _b === void 0 ? void 0 : _b.interpolation) || r[key];
                            return _a = {}, _a[key] = val, _a;
                        }),
                    }
                    : {};
                var animatedStyle = __assign(__assign({}, Object.fromEntries(Object.entries(animateStyles.current).map(function (_a) {
                    var _b;
                    var k = _a[0], v = _a[1];
                    return [
                        k,
                        ((_b = animationsState.current.get(v)) === null || _b === void 0 ? void 0 : _b.interpolation) || v,
                    ];
                }))), animatedTransformStyle);
                return {
                    runners: runners,
                    completions: completions,
                    style: [nonAnimatedStyle, animatedStyle],
                };
                function update(key, animated, valIn) {
                    var _a;
                    var isColorStyleKey = colorStyleKey[key];
                    var _b = isColorStyleKey ? [0, undefined] : getValue(valIn), val = _b[0], type = _b[1];
                    var animateToValue = val;
                    var value = animated || new react_native_1.Animated.Value(val);
                    var curInterpolation = animationsState.current.get(value);
                    var interpolateArgs;
                    if (type) {
                        interpolateArgs = getInterpolated((_a = curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.current) !== null && _a !== void 0 ? _a : value['_value'], val, type);
                        animationsState.current.set(value, {
                            interpolation: value.interpolate(interpolateArgs),
                            current: val,
                        });
                    }
                    if (isColorStyleKey) {
                        animateToValue = (curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.animateToValue) ? 0 : 1;
                        interpolateArgs = getColorInterpolated(curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.current, 
                        // valIn is the next color
                        valIn, animateToValue);
                        animationsState.current.set(value, {
                            current: valIn,
                            interpolation: value.interpolate(interpolateArgs),
                            animateToValue: (curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.animateToValue) ? 0 : 1,
                        });
                    }
                    if (value) {
                        var animationConfig_1 = getAnimationConfig(key, animations, props.transition, animationState);
                        var resolve_1;
                        var promise = new Promise(function (res) {
                            resolve_1 = res;
                        });
                        completions.push(promise);
                        runners.push(function () {
                            value.stopAnimation();
                            function getAnimation() {
                                return react_native_1.Animated[animationConfig_1.type || 'spring'](value, __assign({ toValue: animateToValue, useNativeDriver: nativeDriver }, animationConfig_1));
                            }
                            var animation = animationConfig_1.delay
                                ? react_native_1.Animated.sequence([
                                    react_native_1.Animated.delay(animationConfig_1.delay),
                                    getAnimation(),
                                ])
                                : getAnimation();
                            animation.start(function (_a) {
                                var finished = _a.finished;
                                // always resolve during exit (element is leaving anyway)
                                // for non-exit, only resolve on successful completion
                                if (finished || isExiting) {
                                    resolve_1();
                                }
                            });
                        });
                    }
                    if (process.env.NODE_ENV === 'development') {
                        if (props['debug'] === 'verbose') {
                            // prettier-ignore
                            console.info(' 💠 animate', key, "from (".concat(value['_value'], ") to"), valIn, "(".concat(val, ")"), 'type', type, 'interpolate', interpolateArgs);
                        }
                    }
                    return value;
                }
            }, args);
            // track previous exiting state
            react_1.default.useEffect(function () {
                wasExitingRef.current = isExiting;
            });
            (0, constants_1.useIsomorphicLayoutEffect)(function () {
                res.runners.forEach(function (r) { return r(); });
                // capture current cycle id
                var cycleId = exitCycleIdRef.current;
                // handle zero-completion case immediately
                if (res.completions.length === 0) {
                    onDidAnimate === null || onDidAnimate === void 0 ? void 0 : onDidAnimate();
                    if (isExiting && !exitCompletedRef.current) {
                        exitCompletedRef.current = true;
                        sendExitComplete === null || sendExitComplete === void 0 ? void 0 : sendExitComplete();
                    }
                    return;
                }
                var cancel = false;
                Promise.all(res.completions).then(function () {
                    if (cancel)
                        return;
                    // guard against stale cycle completion
                    if (isExiting && cycleId !== exitCycleIdRef.current)
                        return;
                    if (isExiting && exitCompletedRef.current)
                        return;
                    onDidAnimate === null || onDidAnimate === void 0 ? void 0 : onDidAnimate();
                    if (isExiting) {
                        exitCompletedRef.current = true;
                        sendExitComplete === null || sendExitComplete === void 0 ? void 0 : sendExitComplete();
                    }
                });
                return function () {
                    cancel = true;
                };
            }, args);
            // avoidReRenders: receive style changes imperatively from hanzogui
            // and update Animated.Values directly without React re-renders
            // reuses the same update() + runner pattern as the useMemo path
            useStyleEmitter === null || useStyleEmitter === void 0 ? void 0 : useStyleEmitter(function (nextStyle) {
                var _a;
                var _b;
                for (var key in nextStyle) {
                    var rawVal = nextStyle[key];
                    var val = resolveDynamicValue(rawVal, isDark);
                    if (val === undefined)
                        continue;
                    if (key === 'transform' && Array.isArray(val)) {
                        for (var _i = 0, _c = val.entries(); _i < _c.length; _i++) {
                            var _d = _c[_i], index = _d[0], transform = _d[1];
                            if (!transform)
                                continue;
                            var tkey = Object.keys(transform)[0];
                            var currentTransform = (_b = animatedTranforms.current[index]) === null || _b === void 0 ? void 0 : _b[tkey];
                            animatedTranforms.current[index] = (_a = {},
                                _a[tkey] = update(tkey, currentTransform, transform[tkey]),
                                _a);
                        }
                    }
                    else if (animatedStyleKey[key] != null || costlyToAnimateStyleKey[key]) {
                        animateStyles.current[key] = update(key, animateStyles.current[key], val);
                    }
                }
                // run the queued animations immediately
                res.runners.forEach(function (r) { return r(); });
                function update(key, animated, valIn) {
                    var _a;
                    var isColor = colorStyleKey[key];
                    var _b = isColor ? [0, undefined] : getValue(valIn), numVal = _b[0], type = _b[1];
                    var animateToValue = numVal;
                    var value = animated || new react_native_1.Animated.Value(numVal);
                    var curInterpolation = animationsState.current.get(value);
                    if (type) {
                        animationsState.current.set(value, {
                            interpolation: value.interpolate(getInterpolated((_a = curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.current) !== null && _a !== void 0 ? _a : value['_value'], numVal, type)),
                            current: numVal,
                        });
                    }
                    if (isColor) {
                        animateToValue = (curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.animateToValue) ? 0 : 1;
                        animationsState.current.set(value, {
                            current: valIn,
                            interpolation: value.interpolate(getColorInterpolated(curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.current, valIn, animateToValue)),
                            animateToValue: (curInterpolation === null || curInterpolation === void 0 ? void 0 : curInterpolation.animateToValue) ? 0 : 1,
                        });
                    }
                    var animationConfig = getAnimationConfig(key, animations, props.transition, 'default');
                    res.runners.push(function () {
                        value.stopAnimation();
                        var anim = react_native_1.Animated[animationConfig.type || 'spring'](value, __assign({ toValue: animateToValue, useNativeDriver: nativeDriver }, animationConfig));
                        (animationConfig.delay
                            ? react_native_1.Animated.sequence([react_native_1.Animated.delay(animationConfig.delay), anim])
                            : anim).start();
                    });
                    return value;
                }
            });
            if (process.env.NODE_ENV === 'development') {
                if (props['debug'] === 'verbose') {
                    console.info("Animated", { response: res, inputStyle: style, isExiting: isExiting });
                }
            }
            return res;
        },
    };
}
function getColorInterpolated(currentColor, nextColor, animateToValue) {
    var inputRange = [0, 1];
    var outputRange = [currentColor ? currentColor : nextColor, nextColor];
    if (animateToValue === 0) {
        // because we are animating from value 1 to 0, we need to put target color at the beginning
        outputRange.reverse();
    }
    return {
        inputRange: inputRange,
        outputRange: outputRange,
    };
}
function getInterpolated(current, next, postfix) {
    if (postfix === void 0) { postfix = 'deg'; }
    if (next === current) {
        current = next - 0.000000001;
    }
    var inputRange = [current, next];
    var outputRange = ["".concat(current).concat(postfix), "".concat(next).concat(postfix)];
    if (next < current) {
        inputRange.reverse();
        outputRange.reverse();
    }
    return {
        inputRange: inputRange,
        outputRange: outputRange,
    };
}
function getAnimationConfig(key, animations, transition, animationState) {
    var _a;
    if (animationState === void 0) { animationState = 'default'; }
    var normalized = (0, animation_helpers_1.normalizeTransition)(transition);
    var shortKey = transformShorthands[key];
    // Check for property-specific animation
    var propAnimation = (_a = normalized.properties[key]) !== null && _a !== void 0 ? _a : normalized.properties[shortKey];
    var animationType = null;
    var extraConf = {};
    if (typeof propAnimation === 'string') {
        // Direct animation name: { x: 'quick' }
        animationType = propAnimation;
    }
    else if (propAnimation && typeof propAnimation === 'object') {
        // Config object: { x: { type: 'quick', delay: 100 } }
        // Use effective animation based on state if no explicit type in config
        animationType =
            propAnimation.type || (0, animation_helpers_1.getEffectiveAnimation)(normalized, animationState);
        extraConf = propAnimation;
    }
    else {
        // Fall back to effective animation based on state (enter/exit/default)
        animationType = (0, animation_helpers_1.getEffectiveAnimation)(normalized, animationState);
    }
    // Apply global delay if no property-specific delay
    if (normalized.delay && !extraConf.delay) {
        extraConf = __assign(__assign({}, extraConf), { delay: normalized.delay });
    }
    var found = animationType ? animations[animationType] : {};
    return __assign(__assign(__assign({}, found), normalized.config), extraConf);
}
// try both combos
var transformShorthands = {
    x: 'translateX',
    y: 'translateY',
    translateX: 'x',
    translateY: 'y',
};
function getValue(input, isColor) {
    var _a;
    if (isColor === void 0) { isColor = false; }
    if (typeof input !== 'string') {
        return [input];
    }
    var _b = (_a = input.match(/([-0-9]+)(deg|%|px)/)) !== null && _a !== void 0 ? _a : [], _ = _b[0], number = _b[1], after = _b[2];
    return [+number, after];
}
