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
exports.createAnimations = createAnimations;
var animation_helpers_1 = require("@hanzogui/animation-helpers");
var constants_1 = require("@hanzogui/constants");
var use_presence_1 = require("@hanzogui/use-presence");
var web_1 = require("@hanzogui/web");
var react_1 = require("react"); // import { animate } from '@hanzogui/cubic-bezier-animator'
var EXTRACT_MS_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var EXTRACT_S_REGEX = /(\d+(?:\.\d+)?)\s*s/;
/**
 * Helper function to extract duration from CSS animation string
 * Examples: "ease-in 200ms" -> 200, "cubic-bezier(0.215, 0.610, 0.355, 1.000) 400ms" -> 400
 * "ease-in 0.5s" -> 500, "slow 2s" -> 2000
 */
function extractDuration(animation) {
    // Try to match milliseconds first
    var msMatch = animation.match(EXTRACT_MS_REGEX);
    if (msMatch) {
        return Number.parseInt(msMatch[1], 10);
    }
    // Try to match seconds and convert to milliseconds
    var sMatch = animation.match(EXTRACT_S_REGEX);
    if (sMatch) {
        return Math.round(Number.parseFloat(sMatch[1]) * 1000);
    }
    // Default to 300ms if no duration found
    return 300;
}
var MS_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*ms/;
var S_DURATION_REGEX = /(\d+(?:\.\d+)?)\s*s(?!tiffness)/;
/**
 * Apply duration override to a CSS animation string
 * Replaces the existing duration with the override value
 */
function applyDurationOverride(animation, durationMs) {
    // Replace ms duration
    var msReplaced = animation.replace(MS_DURATION_REGEX, "".concat(durationMs, "ms"));
    if (msReplaced !== animation) {
        return msReplaced;
    }
    // Replace seconds duration
    var sReplaced = animation.replace(S_DURATION_REGEX, "".concat(durationMs, "ms"));
    if (sReplaced !== animation) {
        return sReplaced;
    }
    // No duration found, prepend the duration
    return "".concat(durationMs, "ms ").concat(animation);
}
// transform keys that need special handling
var TRANSFORM_KEYS = [
    'x',
    'y',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skewX',
    'skewY',
];
/**
 * Build a CSS transform string from a style object containing transform properties
 */
function buildTransformString(style) {
    var _a, _b;
    if (!style)
        return '';
    var parts = [];
    if (style.x !== undefined || style.y !== undefined) {
        var x = (_a = style.x) !== null && _a !== void 0 ? _a : 0;
        var y = (_b = style.y) !== null && _b !== void 0 ? _b : 0;
        parts.push("translate(".concat(x, "px, ").concat(y, "px)"));
    }
    if (style.scale !== undefined) {
        parts.push("scale(".concat(style.scale, ")"));
    }
    if (style.scaleX !== undefined) {
        parts.push("scaleX(".concat(style.scaleX, ")"));
    }
    if (style.scaleY !== undefined) {
        parts.push("scaleY(".concat(style.scaleY, ")"));
    }
    if (style.rotate !== undefined) {
        var val = style.rotate;
        var unit = typeof val === 'string' && val.includes('deg') ? '' : 'deg';
        parts.push("rotate(".concat(val).concat(unit, ")"));
    }
    if (style.rotateX !== undefined) {
        parts.push("rotateX(".concat(style.rotateX, "deg)"));
    }
    if (style.rotateY !== undefined) {
        parts.push("rotateY(".concat(style.rotateY, "deg)"));
    }
    if (style.rotateZ !== undefined) {
        parts.push("rotateZ(".concat(style.rotateZ, "deg)"));
    }
    if (style.skewX !== undefined) {
        parts.push("skewX(".concat(style.skewX, "deg)"));
    }
    if (style.skewY !== undefined) {
        parts.push("skewY(".concat(style.skewY, "deg)"));
    }
    return parts.join(' ');
}
/**
 * Apply a style object to a DOM node, handling transform keys specially
 */
function applyStylesToNode(node, style) {
    if (!style)
        return;
    // collect transform values
    var transformStr = buildTransformString(style);
    if (transformStr) {
        node.style.transform = transformStr;
    }
    // apply non-transform properties
    for (var _i = 0, _a = Object.entries(style); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (TRANSFORM_KEYS.includes(key))
            continue;
        if (value === undefined)
            continue;
        if (key === 'opacity') {
            node.style.opacity = String(value);
        }
        else if (key === 'backgroundColor') {
            node.style.backgroundColor = String(value);
        }
        else if (key === 'color') {
            node.style.color = String(value);
        }
        else {
            // generic fallback
            node.style[key] = typeof value === 'number' ? "".concat(value, "px") : String(value);
        }
    }
}
function createAnimations(animations) {
    var reactionListeners = new WeakMap();
    return {
        animations: animations,
        usePresence: use_presence_1.usePresence,
        ResetPresence: use_presence_1.ResetPresence,
        inputStyle: 'css',
        outputStyle: 'css',
        useAnimatedNumber: function (initial) {
            var _a = react_1.default.useState(initial), val = _a[0], setVal = _a[1];
            var finishTimerRef = react_1.default.useRef(null);
            return {
                getInstance: function () {
                    return setVal;
                },
                getValue: function () {
                    return val;
                },
                setValue: function (next, config, onFinish) {
                    setVal(next);
                    // clear any pending finish callback from a previous setValue
                    if (finishTimerRef.current) {
                        clearTimeout(finishTimerRef.current);
                        finishTimerRef.current = null;
                    }
                    if (onFinish) {
                        if (!config ||
                            config.type === 'direct' ||
                            (config.type === 'timing' && config.duration === 0)) {
                            onFinish();
                        }
                        else {
                            // estimate duration: use explicit duration, or fall back to
                            // default CSS transition duration for spring-type configs
                            var duration = config.type === 'timing' ? config.duration : 300;
                            finishTimerRef.current = setTimeout(onFinish, duration);
                        }
                    }
                    // call reaction listeners with the new value
                    var listeners = reactionListeners.get(setVal);
                    if (listeners) {
                        listeners.forEach(function (listener) { return listener(next); });
                    }
                },
                stop: function () {
                    if (finishTimerRef.current) {
                        clearTimeout(finishTimerRef.current);
                        finishTimerRef.current = null;
                    }
                },
            };
        },
        useAnimatedNumberReaction: function (_a, onValue) {
            var value = _a.value;
            react_1.default.useEffect(function () {
                var instance = value.getInstance();
                var queue = reactionListeners.get(instance);
                if (!queue) {
                    var next = new Set();
                    reactionListeners.set(instance, next);
                    queue = next;
                }
                queue.add(onValue);
                return function () {
                    queue === null || queue === void 0 ? void 0 : queue.delete(onValue);
                };
            }, []);
        },
        useAnimatedNumberStyle: function (val, getStyle) {
            return getStyle(val.getValue());
        },
        useAnimatedNumbersStyle: function (vals, getStyle) {
            return getStyle.apply(void 0, vals.map(function (v) { return v.getValue(); }));
        },
        // @ts-ignore - styleState is added by createComponent
        useAnimations: function (_a) {
            var _b, _c;
            var props = _a.props, presence = _a.presence, style = _a.style, componentState = _a.componentState, stateRef = _a.stateRef, styleState = _a.styleState;
            var isHydrating = componentState.unmounted === true;
            var isEntering = !!componentState.unmounted;
            var isExiting = (presence === null || presence === void 0 ? void 0 : presence[0]) === false;
            var sendExitComplete = presence === null || presence === void 0 ? void 0 : presence[1];
            // Track if we just finished entering (transition from entering to not entering)
            // This is needed because the CSS transition happens on the render AFTER t_unmounted is removed
            var wasEnteringRef = react_1.default.useRef(isEntering);
            var justFinishedEntering = wasEnteringRef.current && !isEntering;
            react_1.default.useEffect(function () {
                wasEnteringRef.current = isEntering;
            });
            // exit cycle guards to prevent stale/duplicate completion
            var exitCycleIdRef = react_1.default.useRef(0);
            var exitCompletedRef = react_1.default.useRef(false);
            var wasExitingRef = react_1.default.useRef(false);
            var exitInterruptedRef = react_1.default.useRef(false);
            // detect transition into/out of exiting state
            var justStartedExiting = isExiting && !wasExitingRef.current;
            var justStoppedExiting = !isExiting && wasExitingRef.current;
            // start new exit cycle only on transition INTO exiting
            if (justStartedExiting) {
                exitCycleIdRef.current++;
                exitCompletedRef.current = false;
            }
            // track interruptions so we know to force-restart transitions
            if (justStoppedExiting) {
                exitCycleIdRef.current++;
                exitInterruptedRef.current = true;
            }
            // track previous exiting state
            react_1.default.useEffect(function () {
                wasExitingRef.current = isExiting;
            });
            // use effectiveTransition computed by createComponent (single source of truth)
            var effectiveTransition = (_b = styleState === null || styleState === void 0 ? void 0 : styleState.effectiveTransition) !== null && _b !== void 0 ? _b : props.transition;
            // Normalize the transition prop to a consistent format
            var normalized = (0, animation_helpers_1.normalizeTransition)(effectiveTransition);
            // Determine animation state and get effective animation
            // Use 'enter' if we're entering OR if we just finished entering (transition is happening)
            var animationState = isExiting
                ? 'exit'
                : isEntering || justFinishedEntering
                    ? 'enter'
                    : 'default';
            var effectiveAnimationKey = (0, animation_helpers_1.getEffectiveAnimation)(normalized, animationState);
            var defaultAnimation = effectiveAnimationKey
                ? animations[effectiveAnimationKey]
                : null;
            var animatedProperties = (0, animation_helpers_1.getAnimatedProperties)(normalized);
            // Determine which properties to animate
            // - animateOnly prop is an exclusive filter (only animate those properties)
            // - per-property configs WITHOUT a default = only animate those specific properties
            // - per-property configs WITH a default = per-property overrides + default for rest
            var hasDefault = normalized.default !== null ||
                normalized.enter !== null ||
                normalized.exit !== null;
            var hasPerPropertyConfigs = animatedProperties.length > 0;
            var keys;
            if (props.animateOnly) {
                // animateOnly is explicit filter
                keys = props.animateOnly;
            }
            else if (hasPerPropertyConfigs && !hasDefault) {
                // object format without default: { opacity: '200ms' } = only animate opacity
                keys = animatedProperties;
            }
            else if (hasPerPropertyConfigs && hasDefault) {
                // array format or object with default: 'all' first, then per-property overrides
                // CSS transition specificity: later declarations override earlier ones for the same property
                keys = __spreadArray(['all'], animatedProperties, true);
            }
            else {
                // simple string format: 'quick' = animate all
                keys = ['all'];
            }
            (0, constants_1.useIsomorphicLayoutEffect)(function () {
                var _a, _b;
                var host = stateRef.current.host;
                if (!sendExitComplete || !isExiting || !host)
                    return;
                var node = host;
                // capture current cycle id for this effect
                var cycleId = exitCycleIdRef.current;
                // helper to complete exit with guards
                var completeExit = function () {
                    if (cycleId !== exitCycleIdRef.current)
                        return;
                    if (exitCompletedRef.current)
                        return;
                    exitCompletedRef.current = true;
                    sendExitComplete();
                };
                // if no properties to animate (animateOnly=[]), complete immediately
                if (keys.length === 0) {
                    completeExit();
                    return;
                }
                // Force transition restart for interrupted exits
                // When an exit is interrupted and restarted, the element may already be at
                // the exit style, so no CSS transition fires. We need to:
                // 1. Reset to non-exit state
                // 2. Force reflow
                // 3. Re-apply exit state to trigger transition
                var rafId;
                var wasInterrupted = exitInterruptedRef.current;
                // flag to ignore transitioncancel during reset (we intentionally cancel the old transition)
                var ignoreCancelEvents = wasInterrupted;
                // get enter/exit styles for potential restart
                var enterStyle = props.enterStyle;
                var exitStyle = props.exitStyle;
                // Build the exit transition string - needed for both normal and interrupted exits
                var delayStr = normalized.delay ? " ".concat(normalized.delay, "ms") : '';
                var durationOverride = (_a = normalized.config) === null || _a === void 0 ? void 0 : _a.duration;
                var exitTransitionString = keys
                    .map(function (key) {
                    var propAnimation = normalized.properties[key];
                    var animationValue = null;
                    if (typeof propAnimation === 'string') {
                        animationValue = animations[propAnimation];
                    }
                    else if (propAnimation &&
                        typeof propAnimation === 'object' &&
                        propAnimation.type) {
                        animationValue = animations[propAnimation.type];
                    }
                    else if (defaultAnimation) {
                        animationValue = defaultAnimation;
                    }
                    if (animationValue && durationOverride) {
                        animationValue = applyDurationOverride(animationValue, durationOverride);
                    }
                    return animationValue ? "".concat(key, " ").concat(animationValue).concat(delayStr) : null;
                })
                    .filter(Boolean)
                    .join(', ');
                if (wasInterrupted) {
                    exitInterruptedRef.current = false;
                    // disable transition, reset to enter state
                    node.style.transition = 'none';
                    // reset: apply active/open state for each exit property (not enterStyle,
                    // which may equal exitStyle — see comment in the normal exit path below)
                    if (exitStyle) {
                        var resetStyle = {};
                        for (var _i = 0, _c = Object.keys(exitStyle); _i < _c.length; _i++) {
                            var key = _c[_i];
                            if (key === 'opacity') {
                                resetStyle[key] = 1;
                            }
                            else if (TRANSFORM_KEYS.includes(key)) {
                                resetStyle[key] =
                                    key === 'scale' || key === 'scaleX' || key === 'scaleY' ? 1 : 0;
                            }
                            else if ((enterStyle === null || enterStyle === void 0 ? void 0 : enterStyle[key]) !== undefined) {
                                resetStyle[key] = enterStyle[key];
                            }
                        }
                        applyStylesToNode(node, resetStyle);
                    }
                    else {
                        // fallback if no exitStyle defined
                        node.style.opacity = '1';
                        node.style.transform = 'none';
                    }
                    // force reflow
                    void node.offsetHeight;
                }
                else if (exitStyle) {
                    // For normal (non-interrupted) exits, we need to ensure the CSS transition is
                    // processed by the browser BEFORE the exitStyle takes effect. The issue is that
                    // React may have already applied exitStyle in the same render batch. To fix this:
                    // 1. Disable transition and reset to non-exit state
                    // 2. Force reflow so browser processes the reset
                    // 3. Use RAF to ensure we're in a new frame
                    // 4. Re-enable transition and apply exitStyle
                    // This mirrors the interrupted exit handling approach (which also uses RAF).
                    ignoreCancelEvents = true;
                    node.style.transition = 'none';
                    // Reset to the active/open state (not enterStyle, which may equal exitStyle).
                    // enterStyle is the "unmounted" initial state and can share values with exitStyle
                    // (e.g., both have opacity: 0). resetting to enterStyle would mean no value change
                    // when exitStyle is applied, so the CSS transition wouldn't fire.
                    var resetStyle = {};
                    for (var _d = 0, _e = Object.keys(exitStyle); _d < _e.length; _d++) {
                        var key = _e[_d];
                        if (key === 'opacity') {
                            resetStyle[key] = 1;
                        }
                        else if (TRANSFORM_KEYS.includes(key)) {
                            resetStyle[key] =
                                key === 'scale' || key === 'scaleX' || key === 'scaleY' ? 1 : 0;
                        }
                        else if ((enterStyle === null || enterStyle === void 0 ? void 0 : enterStyle[key]) !== undefined) {
                            resetStyle[key] = enterStyle[key];
                        }
                    }
                    applyStylesToNode(node, resetStyle);
                    // Force reflow
                    void node.offsetHeight;
                    // Use RAF to ensure transition is applied in a new frame
                    rafId = requestAnimationFrame(function () {
                        if (cycleId !== exitCycleIdRef.current)
                            return;
                        // Re-enable transition
                        node.style.transition = exitTransitionString;
                        // Force reflow to ensure transition is active
                        void node.offsetHeight;
                        // Apply exit styles - this triggers the animation
                        applyStylesToNode(node, exitStyle);
                        // Re-enable cancel event handling
                        ignoreCancelEvents = false;
                    });
                }
                /**
                 * Exit animation handling for Dialog/Modal components
                 *
                 * The Challenge: When users close dialogs (via Escape key or clicking outside),
                 * the element can disappear from the DOM before CSS transitions finish, which causes:
                 * 1. Dialogs to stick around on screen
                 * 2. Event handlers to stop working
                 *
                 * Fix: Calculate the MAXIMUM duration across all animated properties, not just
                 * the default. With animateOnly and per-property configs, different properties
                 * can have different durations, and we need to wait for the LONGEST one.
                 */
                // calculate max duration across all animated properties
                var maxDuration = defaultAnimation ? extractDuration(defaultAnimation) : 200;
                // check per-property animation durations using shared helper
                var animationConfigs = (0, animation_helpers_1.getAnimationConfigsForKeys)(normalized, animations, keys, defaultAnimation);
                for (var _f = 0, _g = animationConfigs.values(); _f < _g.length; _f++) {
                    var animationValue = _g[_f];
                    if (animationValue) {
                        var duration = extractDuration(animationValue);
                        if (duration > maxDuration) {
                            maxDuration = duration;
                        }
                    }
                }
                var delay = (_b = normalized.delay) !== null && _b !== void 0 ? _b : 0;
                var fallbackTimeout = maxDuration + delay;
                var timeoutId = setTimeout(function () {
                    completeExit();
                }, fallbackTimeout);
                // track number of transitioning properties to wait for all to finish
                // (each property fires its own transitionend event)
                var transitioningProps = new Set(keys);
                var completedCount = 0;
                var onFinishAnimation = function (event) {
                    // only count transitions on THIS element, not bubbled from children
                    if (event.target !== node)
                        return;
                    // map CSS property names to our key names
                    // e.g., transitionend fires with propertyName 'transform' for scale/x/y
                    var eventProp = event.propertyName;
                    if (transitioningProps.has(eventProp) || eventProp === 'all') {
                        completedCount++;
                        // wait for all properties to finish
                        if (completedCount >= transitioningProps.size) {
                            clearTimeout(timeoutId);
                            completeExit();
                        }
                    }
                };
                // on cancel, still complete (element is exiting and animation was interrupted)
                // the guards prevent duplicate completion if this is a stale cycle
                var onCancelAnimation = function () {
                    // ignore cancel events during reset phase (we intentionally cancel the old transition)
                    if (ignoreCancelEvents)
                        return;
                    clearTimeout(timeoutId);
                    completeExit();
                };
                node.addEventListener('transitionend', onFinishAnimation);
                node.addEventListener('transitioncancel', onCancelAnimation);
                // For interrupted exits, re-enable transition and re-apply exit styles
                // This must happen AFTER listeners are set up so we catch the transitionend
                if (wasInterrupted) {
                    rafId = requestAnimationFrame(function () {
                        if (cycleId !== exitCycleIdRef.current)
                            return;
                        // re-enable transition using the pre-built string
                        node.style.transition = exitTransitionString;
                        // force reflow again
                        void node.offsetHeight;
                        // now apply exit styles - this triggers the transition
                        applyStylesToNode(node, exitStyle);
                        // re-enable cancel event handling now that reset is complete
                        ignoreCancelEvents = false;
                    });
                }
                return function () {
                    clearTimeout(timeoutId);
                    if (rafId !== undefined)
                        cancelAnimationFrame(rafId);
                    node.removeEventListener('transitionend', onFinishAnimation);
                    node.removeEventListener('transitioncancel', onCancelAnimation);
                    // restore transition: the exit handling sets node.style.transition='none'
                    // directly on the DOM (bypassing React). if exit is interrupted (e.g. same-key
                    // re-entry in AnimatePresence), React won't re-apply its managed transition
                    // value because it hasn't changed in the virtual DOM. clearing the inline
                    // override lets React's value take effect again.
                    node.style.transition = '';
                };
            }, [
                sendExitComplete,
                isExiting,
                stateRef,
                keys,
                normalized,
                defaultAnimation,
                props.enterStyle,
                props.exitStyle,
            ]);
            // hanzogui doesnt even use animation output during hydration
            if (isHydrating) {
                return null;
            }
            // Check if we have any animation to apply
            if (!(0, animation_helpers_1.hasAnimation)(normalized)) {
                return null;
            }
            if (Array.isArray(style.transform)) {
                style.transform = (0, web_1.transformsToString)(style.transform);
            }
            // Build CSS transition string
            // TODO: we disabled the transform transition, because it will create issue for inverse function and animate function
            // for non layout transform properties either use animate function or find a workaround to do it with css
            var delayStr = normalized.delay ? " ".concat(normalized.delay, "ms") : '';
            var durationOverride = (_c = normalized.config) === null || _c === void 0 ? void 0 : _c.duration;
            style.transition = keys
                .map(function (key) {
                // Check for property-specific animation, fall back to default
                var propAnimation = normalized.properties[key];
                var animationValue = null;
                if (typeof propAnimation === 'string') {
                    animationValue = animations[propAnimation];
                }
                else if (propAnimation &&
                    typeof propAnimation === 'object' &&
                    propAnimation.type) {
                    animationValue = animations[propAnimation.type];
                }
                else if (defaultAnimation) {
                    animationValue = defaultAnimation;
                }
                // Apply global duration override if specified
                if (animationValue && durationOverride) {
                    animationValue = applyDurationOverride(animationValue, durationOverride);
                }
                return animationValue ? "".concat(key, " ").concat(animationValue).concat(delayStr) : null;
            })
                .filter(Boolean)
                .join(', ');
            if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
                console.info('CSS animation', {
                    props: props,
                    animations: animations,
                    normalized: normalized,
                    defaultAnimation: defaultAnimation,
                    style: style,
                    isEntering: isEntering,
                    isExiting: isExiting,
                });
            }
            return { style: style, className: isEntering ? 't_unmounted' : '' };
        },
    };
}
// layout animations
// useIsomorphicLayoutEffect(() => {
//   if (!host || !props.layout) {
//     return
//   }
//   // @ts-ignore
//   const boundingBox = host?.getBoundingClientRect()
//   if (isChanged(initialPositionRef.current, boundingBox)) {
//     const transform = invert(
//       host,
//       boundingBox,
//       initialPositionRef.current
//     )
//     animate({
//       from: transform,
//       to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
//       duration: 1000,
//       onUpdate: ({ x, y, scaleX, scaleY }) => {
//         // @ts-ignore
//         host.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
//         // TODO: handle childRef inverse scale
//         //   childRef.current.style.transform = `scaleX(${1 / scaleX}) scaleY(${
//         //     1 / scaleY
//         //   })`
//       },
//       // TODO: extract ease-in from string and convert/map it to a cubicBezier array
//       cubicBezier: [0, 1.38, 1, -0.41],
//     })
//   }
//   initialPositionRef.current = boundingBox
// })
// style.transition = `${keys} ${animation}${
//   props.layout ? ',width 0s, height 0s, margin 0s, padding 0s, transform' : ''
// }`
// const isChanged = (initialBox: any, finalBox: any) => {
//   // we just mounted, so we don't have complete data yet
//   if (!initialBox || !finalBox) return false
//   // deep compare the two boxes
//   return JSON.stringify(initialBox) !== JSON.stringify(finalBox)
// }
// const invert = (el, from, to) => {
//   const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from
//   const { x, y, width, height } = to
//   const transform = {
//     x: x - fromX - (fromWidth - width) / 2,
//     y: y - fromY - (fromHeight - height) / 2,
//     scaleX: width / fromWidth,
//     scaleY: height / fromHeight,
//   }
//   el.style.transform = `
