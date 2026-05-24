"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.componentSetStates = void 0;
exports.createComponent = createComponent;
var jsx_runtime_1 = require("react/jsx-runtime");
var compose_refs_1 = require("@hanzogui/compose-refs");
var constants_1 = require("@hanzogui/constants");
var native_1 = require("@hanzogui/native");
var helpers_1 = require("@hanzogui/helpers");
var is_equal_shallow_1 = require("@hanzogui/is-equal-shallow");
var react_1 = require("react");
var config_1 = require("./config");
var isDevTools_1 = require("./constants/isDevTools");
var ComponentContext_1 = require("./contexts/ComponentContext");
var GroupContext_1 = require("./contexts/GroupContext");
var createVariable_1 = require("./createVariable");
var defaultComponentState_1 = require("./defaultComponentState");
var eventHandling_1 = require("./eventHandling");
var getDefaultProps_1 = require("./helpers/getDefaultProps");
var resolveAnimationDriver_1 = require("./helpers/resolveAnimationDriver");
var getSplitStyles_1 = require("./helpers/getSplitStyles");
var log_1 = require("./helpers/log");
var mergeProps_1 = require("./helpers/mergeProps");
var mergeRenderElementProps_1 = require("./helpers/mergeRenderElementProps");
var objectIdentityKey_1 = require("./helpers/objectIdentityKey");
var pointerEvents_1 = require("./helpers/pointerEvents");
var pseudoTransitions_1 = require("./helpers/pseudoTransitions");
var setElementProps_1 = require("./helpers/setElementProps");
var subscribeToContextGroup_1 = require("./helpers/subscribeToContextGroup");
var themeable_1 = require("./helpers/themeable");
var wrapStyleTags_1 = require("./helpers/wrapStyleTags");
var useComponentState_1 = require("./hooks/useComponentState");
var useMedia_1 = require("./hooks/useMedia");
var useTheme_1 = require("./hooks/useTheme");
var setupHooks_1 = require("./setupHooks");
var Slot_1 = require("./views/Slot");
var Theme_1 = require("./views/Theme");
/**
 * All things that need one-time setup after createHanzogui is called
 */
var time;
var debugKeyListeners;
var startVisualizer;
exports.componentSetStates = new Set();
var avoidReRenderKeys = new Set([
    'hover',
    'press',
    'pressIn',
    'group',
    'focus',
    'focusWithin',
    'media',
    'group',
]);
if (process.env.TAMAGUI_TARGET !== 'native' && typeof window !== 'undefined') {
    var cancelPresses = function () {
        // clear all press downs
        exports.componentSetStates.forEach(function (setState) {
            return setState(function (prev) {
                if (prev.press || prev.pressIn) {
                    return __assign(__assign({}, prev), { press: false, pressIn: false });
                }
                return prev;
            });
        });
        exports.componentSetStates.clear();
    };
    var cancelTouches = function () {
        // clear press and hover on touch end - hover may have been set
        // via synthetic mouseenter event triggered by touch
        exports.componentSetStates.forEach(function (setState) {
            return setState(function (prev) {
                if (prev.press || prev.pressIn || prev.hover) {
                    return __assign(__assign({}, prev), { press: false, pressIn: false, hover: false });
                }
                return prev;
            });
        });
        exports.componentSetStates.clear();
    };
    addEventListener('mouseup', cancelPresses);
    addEventListener('touchend', cancelTouches);
    addEventListener('touchcancel', cancelTouches);
    // hold option to see debug visualization
    if (process.env.NODE_ENV === 'development') {
        startVisualizer = function () {
            var devVisualizerConfig = config_1.devConfig === null || config_1.devConfig === void 0 ? void 0 : config_1.devConfig.visualizer;
            if (devVisualizerConfig && !globalThis.__hanzoguiDevVisualizer) {
                globalThis.__hanzoguiDevVisualizer = true;
                debugKeyListeners = new Set();
                var tm_1;
                var isShowing_1 = false;
                var resizeListener_1 = null;
                var options_1 = __assign({ key: 'Alt', delay: 800 }, (typeof devVisualizerConfig === 'object' ? devVisualizerConfig : {}));
                function show(val) {
                    clearTimeout(tm_1);
                    isShowing_1 = val;
                    debugKeyListeners === null || debugKeyListeners === void 0 ? void 0 : debugKeyListeners.forEach(function (l) { return l(val); });
                    // Remove resize listener when hiding
                    if (!val && resizeListener_1) {
                        window.removeEventListener('resize', resizeListener_1);
                        resizeListener_1 = null;
                    }
                }
                function cancelShow() {
                    clearTimeout(tm_1);
                    if (resizeListener_1) {
                        window.removeEventListener('resize', resizeListener_1);
                        resizeListener_1 = null;
                    }
                }
                window.addEventListener('blur', function () {
                    show(false);
                });
                window.addEventListener('keydown', function (_a) {
                    var key = _a.key, metaKey = _a.metaKey, defaultPrevented = _a.defaultPrevented;
                    clearTimeout(tm_1); // always clear so we dont trigger on chords
                    if (defaultPrevented)
                        return;
                    if (metaKey)
                        return;
                    if (key === options_1.key) {
                        // Add resize listener immediately when Alt is pressed
                        if (!resizeListener_1) {
                            resizeListener_1 = function () { return cancelShow(); };
                            window.addEventListener('resize', resizeListener_1);
                        }
                        tm_1 = setTimeout(function () {
                            show(true);
                        }, options_1.delay);
                    }
                });
                window.addEventListener('keyup', function (_a) {
                    var defaultPrevented = _a.defaultPrevented;
                    if (defaultPrevented)
                        return;
                    cancelShow();
                    // any key can clear it
                    if (isShowing_1) {
                        show(false);
                    }
                });
            }
        };
    }
}
/**
 * Only on native do we need the actual underlying View/Text
 * On the web we avoid react-native dep altogether.
 */
var BaseText;
var BaseView;
var hasSetupBaseViews = false;
var lastInteractionWasKeyboard = { value: false };
var lastInteractionWasTouch = { value: false };
if (constants_1.isWeb && typeof document !== 'undefined') {
    document.addEventListener('keydown', function () {
        if (!lastInteractionWasKeyboard.value) {
            lastInteractionWasKeyboard.value = true;
        }
    });
    document.addEventListener('mousedown', function () {
        if (lastInteractionWasKeyboard.value) {
            lastInteractionWasKeyboard.value = false;
        }
    });
    document.addEventListener('mousemove', function () {
        if (lastInteractionWasKeyboard.value) {
            lastInteractionWasKeyboard.value = false;
        }
        // Real mouse movement clears touch flag
        lastInteractionWasTouch.value = false;
    });
    document.addEventListener('touchstart', function () {
        lastInteractionWasTouch.value = true;
    });
    // Don't reset on touchend - mouseenter fires after touchend
    // and we need to still detect it as a touch interaction.
    // Mouse move will reset it when there's real mouse activity.
}
function createComponent(staticConfig) {
    var config = null;
    var Component = staticConfig.Component, isText = staticConfig.isText, isHOC = staticConfig.isHOC;
    var component = react_1.default.forwardRef(function (propsIn, forwardedRef) {
        'use no memo';
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        config = config || (0, config_1.getConfig)();
        var internalID = process.env.NODE_ENV === 'development' ? react_1.default.useId() : '';
        if (process.env.NODE_ENV === 'development') {
            if (startVisualizer) {
                startVisualizer();
                startVisualizer = undefined;
            }
        }
        if (process.env.TAMAGUI_TARGET === 'native') {
            // todo this could be moved to a cleaner location
            if (!hasSetupBaseViews) {
                hasSetupBaseViews = true;
                var baseViews = (_a = setupHooks_1.hooks.getBaseViews) === null || _a === void 0 ? void 0 : _a.call(setupHooks_1.hooks);
                if (baseViews) {
                    BaseText = baseViews.Text;
                    BaseView = baseViews.View;
                }
            }
        }
        // test only
        if (process.env.NODE_ENV === 'test') {
            if (propsIn['data-test-renders']) {
                propsIn['data-test-renders']['current'] =
                    (_b = propsIn['data-test-renders']['current']) !== null && _b !== void 0 ? _b : 0;
                propsIn['data-test-renders']['current'] += 1;
            }
        }
        // set variants through context
        // order is after default props but before props
        var context = staticConfig.context, isReactNative = staticConfig.isReactNative;
        var debugProp = propsIn['debug'];
        var styledContextValue = context
            ? react_1.default.useContext(context)
            : undefined;
        var overriddenContextProps = null;
        var componentContext = react_1.default.useContext(ComponentContext_1.ComponentContext);
        var hasTextAncestor = !!(constants_1.isWeb && isText ? componentContext.inText : false);
        // On Android, skip RNGH GestureDetector inside native menus (zeego) and use
        // direct press events instead — GestureDetector consumes touches before they
        // reach MenuView's native handler, preventing the menu from opening
        var isInsideNativeMenu = process.env.TAMAGUI_TARGET === 'native'
            ? react_1.default.useContext(native_1.NativeMenuContext)
            : false;
        if (!process.env.TAMAGUI_IS_CORE_NODE &&
            process.env.NODE_ENV === 'development' &&
            debugProp === 'profile' &&
            !time) {
            var timer = require('@hanzogui/timer').timer();
            time = timer.start();
            globalThis['time'] = time;
        }
        // pick up globalThis.time if set externally (e.g. by a profiling harness)
        if (process.env.NODE_ENV === 'development' && !time && globalThis.time) {
            time = globalThis.time;
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_1 || (templateObject_1 = __makeTemplateObject(["non-hanzogui time (ignore)"], ["non-hanzogui time (ignore)"
                // React inserts default props after your props for some reason...
                // order important so we do loops, you can't just spread because JS does weird things
            ])));
        // React inserts default props after your props for some reason...
        // order important so we do loops, you can't just spread because JS does weird things
        var props = propsIn;
        var componentName = props.componentName || staticConfig.componentName;
        // merge both default props and styled context props - ensure order is preserved
        var defaultProps = (0, getDefaultProps_1.getDefaultProps)(staticConfig, props.componentName);
        // merge styled context props over defaults, ensure order is preserved
        var _o = (0, mergeProps_1.mergeComponentProps)(defaultProps, styledContextValue, propsIn), nextProps = _o[0], overrides = _o[1];
        props = nextProps;
        overriddenContextProps = overrides;
        if (process.env.NODE_ENV === 'development' && constants_1.isClient) {
            react_1.default.useEffect(function () {
                var node;
                var overlay = null;
                var remove = function () {
                    var _a;
                    if (overlay) {
                        try {
                            (_a = overlay.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(overlay);
                            overlay = null;
                        }
                        catch (_b) {
                            // may have unmounted
                        }
                    }
                };
                var debugVisualizerHandler = function (show) {
                    if (show === void 0) { show = false; }
                    node = stateRef.current.host;
                    if (!node)
                        return;
                    if (show) {
                        if (!overlay) {
                            overlay = document.createElement('span');
                            overlay.style.inset = '0px';
                            overlay.style.zIndex = '1000000';
                            overlay.style.position = 'absolute';
                            overlay.style.borderColor = 'red';
                            overlay.style.borderWidth = '1px';
                            overlay.style.borderStyle = 'dotted';
                        }
                        var dataAt = node.getAttribute('data-at') || '';
                        var dataIn = node.getAttribute('data-in') || '';
                        var tooltip = document.createElement('span');
                        tooltip.style.position = 'absolute';
                        tooltip.style.top = '0px';
                        tooltip.style.left = '0px';
                        tooltip.style.padding = '3px';
                        tooltip.style.background = 'rgba(0,0,0,0.75)';
                        tooltip.style.color = 'rgba(255,255,255,1)';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.lineHeight = '12px';
                        tooltip.style.fontFamily = 'monospace';
                        tooltip.innerText = "".concat(componentName || '', " ").concat(dataAt, " ").concat(dataIn).trim();
                        overlay.appendChild(tooltip);
                        node.appendChild(overlay);
                    }
                    else {
                        remove();
                    }
                };
                debugKeyListeners = debugKeyListeners || new Set();
                debugKeyListeners.add(debugVisualizerHandler);
                return function () {
                    remove();
                    debugKeyListeners === null || debugKeyListeners === void 0 ? void 0 : debugKeyListeners.delete(debugVisualizerHandler);
                };
            }, [componentName]);
        }
        var groupContextParent = react_1.default.useContext(GroupContext_1.GroupContext);
        // Get animation driver - either from animatedBy prop lookup or context/config fallback
        var animationDriver = (function () {
            var _a, _b, _c;
            if (props.animatedBy && config) {
                // check animationDrivers for multi-driver config
                if (config.animationDrivers) {
                    return ((_a = config.animationDrivers[props.animatedBy]) !== null && _a !== void 0 ? _a : config.animations);
                }
                // single driver config - only 'default' makes sense
                return props.animatedBy === 'default' ? config.animations : null;
            }
            // fall back to context driver, then config.animations
            // resolveAnimationDriver validates it's a real driver (not a raw multi-driver object)
            return ((_c = (_b = (0, resolveAnimationDriver_1.resolveAnimationDriver)(componentContext.animationDriver)) !== null && _b !== void 0 ? _b : (0, resolveAnimationDriver_1.resolveAnimationDriver)(config === null || config === void 0 ? void 0 : config.animations)) !== null && _c !== void 0 ? _c : null);
        })();
        var useAnimations = animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.useAnimations;
        var componentState = (0, useComponentState_1.useComponentState)(props, (animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.isStub) ? null : animationDriver, staticConfig, config);
        var disabled = componentState.disabled, groupName = componentState.groupName, hasAnimationProp = componentState.hasAnimationProp, hasEnterStyle = componentState.hasEnterStyle, isAnimated = componentState.isAnimated, isExiting = componentState.isExiting, isHydrated = componentState.isHydrated, presence = componentState.presence, presenceState = componentState.presenceState, setState = componentState.setState, noClass = componentState.noClass, state = componentState.state, stateRef = componentState.stateRef, inputStyle = componentState.inputStyle, outputStyle = componentState.outputStyle, willBeAnimated = componentState.willBeAnimated, willBeAnimatedClient = componentState.willBeAnimatedClient, startedUnhydrated = componentState.startedUnhydrated;
        if (hasAnimationProp && (animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.avoidReRenders)) {
            (0, constants_1.useIsomorphicLayoutEffect)(function () {
                var pendingState = stateRef.current.nextState;
                if (pendingState) {
                    stateRef.current.nextState = undefined;
                    componentState.setStateShallow(pendingState);
                }
            });
        }
        // create new context with groups, or else sublings will grab the same one
        var allGroupContexts = (0, react_1.useMemo)(function () {
            var _a;
            var _b, _c;
            if (!groupName || props.passThrough) {
                return groupContextParent;
            }
            var listeners = new Set();
            (_c = (_b = stateRef.current.group) === null || _b === void 0 ? void 0 : _b.listeners) === null || _c === void 0 ? void 0 : _c.clear();
            stateRef.current.group = {
                listeners: listeners,
                emit: function (state) {
                    listeners.forEach(function (l) { return l(state); });
                },
                subscribe: function (cb) {
                    listeners.add(cb);
                    if (listeners.size === 1) {
                        setStateShallow({ hasDynGroupChildren: true });
                    }
                    return function () {
                        listeners.delete(cb);
                        if (listeners.size === 0) {
                            setStateShallow({ hasDynGroupChildren: false });
                        }
                    };
                },
            };
            return __assign(__assign({}, groupContextParent), (_a = {}, _a[groupName] = {
                state: {
                    pseudo: defaultComponentState_1.defaultComponentStateMounted,
                },
                subscribe: function (listener) {
                    var _a;
                    var dispose = (_a = stateRef.current.group) === null || _a === void 0 ? void 0 : _a.subscribe(listener);
                    return function () {
                        dispose === null || dispose === void 0 ? void 0 : dispose();
                    };
                },
            }, _a));
        }, [stateRef, groupName, groupContextParent]);
        // if our animation driver supports avoidReRenders, we'll replace this below with
        // a version that essentially uses an internall emitter rather than setting state
        // but still stores the current state and applies if it it needs to during render
        var setStateShallow = componentState.setStateShallow;
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_2 || (templateObject_2 = __makeTemplateObject(["use-state"], ["use-state"
                // web-only - string-style not valid for native
            ])));
        // web-only - string-style not valid for native
        var renderProp = props.render;
        var isRenderString = !Component || typeof Component === 'string';
        // default to render prop, fallback to component (when both strings)
        var element = constants_1.isWeb
            ? isRenderString
                ? renderProp || Component
                : Component
            : Component;
        var BaseTextComponent = BaseText || element || 'span';
        var BaseViewComponent = BaseView || element || (hasTextAncestor ? 'span' : 'div');
        var BaseComponent = isText ? BaseTextComponent : BaseViewComponent;
        var elementType = BaseComponent;
        var isAnimatedCustomComponent = animationDriver && isAnimated && animationDriver.needsCustomComponent;
        if (isAnimatedCustomComponent) {
            elementType = animationDriver[isText ? 'Text' : 'View'] || elementType;
        }
        // internal use only
        var disableThemeProp = process.env.TAMAGUI_TARGET === 'native' ? false : props['data-disable-theme'];
        var disableTheme = disableThemeProp || isHOC;
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_3 || (templateObject_3 = __makeTemplateObject(["theme-props"], ["theme-props"])));
        var themeStateProps = {
            componentName: componentName,
            disable: disableTheme,
            shallow: props.themeShallow,
            debug: debugProp,
            unstyled: props.unstyled,
        };
        // this is set conditionally if existing in props because we wrap children with
        // a span if they ever set one of these, so avoid wrapping all children with span
        if ('theme' in props) {
            themeStateProps.name = props.theme;
        }
        // Always set needsUpdate callback so it can check the ref's latest value
        // This ensures components with $theme-dark/$theme-light re-render on theme change
        // even when using raw colors (not tokens) since isListeningToTheme is set after useSplitStyles
        themeStateProps.needsUpdate = function () { return !!stateRef.current.isListeningToTheme; };
        // on native we optimize theme changes if fastSchemeChange is enabled, otherwise deopt
        if (process.env.TAMAGUI_TARGET === 'native') {
            themeStateProps.deopt = willBeAnimated;
        }
        if (process.env.NODE_ENV === 'development') {
            if (debugProp && debugProp !== 'profile') {
                var name_1 = "".concat(componentName ||
                    (Component === null || Component === void 0 ? void 0 : Component.displayName) ||
                    (Component === null || Component === void 0 ? void 0 : Component.name) ||
                    '[Unnamed Component]');
                var type = (hasEnterStyle ? '(hasEnter)' : ' ') +
                    (isAnimated ? '(animated)' : ' ') +
                    (isReactNative ? '(rnw)' : ' ') +
                    (noClass ? '(noClass)' : ' ') +
                    (state.press || state.pressIn ? '(PRESSED)' : ' ') +
                    (state.hover ? '(HOVERED)' : ' ') +
                    (state.focus ? '(FOCUSED)' : ' ') +
                    (state.focusWithin ? '(WITHIN FOCUSED)' : ' ') +
                    ((presenceState === null || presenceState === void 0 ? void 0 : presenceState.isPresent) === false ? '(EXIT)' : '');
                var dataIs = propsIn['data-is'] || '';
                var banner = "<".concat(name_1, " /> ").concat(internalID, " ").concat(dataIs ? " ".concat(dataIs) : '', " ").concat(type.trim(), " (hydrated: ").concat(isHydrated, ") (unmounted: ").concat(state.unmounted, ")");
                var ch = propsIn.children;
                var childLog = typeof ch === 'string' ? (ch.length > 4 ? ch.slice(0, 4) + '...' : ch) : '';
                if (childLog.length) {
                    childLog = "(children: ".concat(childLog, ")");
                }
                if (constants_1.isWeb) {
                    console.info("%c ".concat(banner), 'background: green; color: white;');
                    if (constants_1.isServer) {
                        (0, log_1.log)({ noClass: noClass, isAnimated: isAnimated, isWeb: constants_1.isWeb, inputStyle: inputStyle });
                    }
                    else {
                        // if strict mode or something messes with our nesting this fixes:
                        console.groupEnd();
                        console.groupCollapsed("".concat(childLog, " [inspect props, state, context \uD83D\uDC47]"));
                        (0, log_1.log)('props in:', propsIn);
                        (0, log_1.log)('final props:', props, Object.keys(props));
                        (0, log_1.log)({ state: state, staticConfig: staticConfig, elementType: elementType, themeStateProps: themeStateProps });
                        (0, log_1.log)({
                            context: context,
                            overriddenContextProps: overriddenContextProps,
                            componentContext: componentContext,
                        });
                        (0, log_1.log)({ presence: presence, isAnimated: isAnimated, isHOC: isHOC, hasAnimationProp: hasAnimationProp, useAnimations: useAnimations });
                        console.groupEnd();
                    }
                }
                else {
                    console.info("\n\n------------------------------\n".concat(banner, "\n------------------------------\n"));
                    (0, log_1.log)("children:", props.children);
                    (0, log_1.log)({ overriddenContextProps: overriddenContextProps, styledContextValue: styledContextValue });
                    (0, log_1.log)({ noClass: noClass, isAnimated: isAnimated, isWeb: constants_1.isWeb, inputStyle: inputStyle });
                }
            }
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_4 || (templateObject_4 = __makeTemplateObject(["pre-theme-media"], ["pre-theme-media"])));
        var _p = (0, useTheme_1.useThemeWithState)(themeStateProps), theme = _p[0], themeState = _p[1];
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_5 || (templateObject_5 = __makeTemplateObject(["theme"], ["theme"])));
        elementType = element || elementType;
        var isStringElement = typeof elementType === 'string';
        var mediaState = (0, useMedia_1.useMedia)(componentContext, debugProp);
        (0, createVariable_1.setDidGetVariableValue)(false);
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_6 || (templateObject_6 = __makeTemplateObject(["media"], ["media"])));
        var resolveValues = 
        // if HOC + mounted + has animation prop, resolve as value so it passes non-variable to child
        (isAnimated && inputStyle !== 'css') ||
            (isHOC && state.unmounted == false && hasAnimationProp)
            ? 'value'
            : 'auto';
        var styleProps = {
            mediaState: mediaState,
            noClass: noClass,
            resolveValues: resolveValues,
            isExiting: isExiting,
            isAnimated: isAnimated,
            willBeAnimated: willBeAnimated,
            styledContext: styledContextValue,
        };
        var themeName = (themeState === null || themeState === void 0 ? void 0 : themeState.name) || '';
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_7 || (templateObject_7 = __makeTemplateObject(["split-styles-prepare"], ["split-styles-prepare"])));
        var splitStyles = (0, getSplitStyles_1.useSplitStyles)(props, staticConfig, theme, themeName, state, styleProps, null, componentContext, allGroupContexts, elementType, startedUnhydrated, debugProp, animationDriver);
        var isPassthrough = !splitStyles;
        // splitStyles === null === passThrough
        // Merge style-resolved context overrides (issues #3670, #3676)
        // When styles set values that are also context keys (from variants, pseudos, media, etc),
        // we need to add them to overriddenContextProps so they propagate to children
        // Use either the component's own context or its parent's context (for styled() inheritance)
        var contextForOverride = staticConfig.context;
        if (splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.overriddenContextProps) {
            var contextForProps = staticConfig.context || ((_c = staticConfig.parentStaticConfig) === null || _c === void 0 ? void 0 : _c.context);
            if (contextForProps) {
                for (var key in splitStyles.overriddenContextProps) {
                    overriddenContextProps = overriddenContextProps || {};
                    overriddenContextProps[key] = splitStyles.overriddenContextProps[key];
                }
                // Use parent's context if this component doesn't have its own
                if (!staticConfig.context) {
                    contextForOverride = contextForProps;
                }
            }
        }
        var groupContext = groupName ? (allGroupContexts === null || allGroupContexts === void 0 ? void 0 : allGroupContexts[groupName]) || null : null;
        // one tiny mutation 🙏 get width/height optimistically from raw values if possible
        // if set hardcoded it avoids extra renders
        if (!isPassthrough &&
            groupContext &&
            // avoids onLayout if we don't need it
            props.containerType !== 'normal') {
            var groupState = groupContext === null || groupContext === void 0 ? void 0 : groupContext.state;
            if (groupState && groupState.layout === undefined) {
                if (((_d = splitStyles.style) === null || _d === void 0 ? void 0 : _d.width) || ((_e = splitStyles.style) === null || _e === void 0 ? void 0 : _e.height)) {
                    groupState.layout = {
                        width: fromPx(splitStyles.style.width),
                        height: fromPx(splitStyles.style.height),
                    };
                }
            }
        }
        // avoids re-rendering if animation driver supports it
        // TODO believe we need to set some sort of "pendingState" in case it re-renders
        // CRITICAL: Skip avoidReRenders for components with enter/exit transitions
        // The exit state comes from AnimatePresence context, not local state, so
        // updateStyleListener can fire before the component re-renders with the new
        // presence value, causing wrong animation timing (e.g., using enter timing for exit)
        var hasEnterExitTransition = props.transition &&
            typeof props.transition === 'object' &&
            !Array.isArray(props.transition) &&
            ('enter' in props.transition || 'exit' in props.transition);
        if (!isPassthrough &&
            (hasAnimationProp || groupName) &&
            (animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.avoidReRenders) &&
            !hasEnterExitTransition) {
            var ogSetStateShallow_1 = setStateShallow;
            stateRef.current.updateStyleListener = function () {
                var useStyleListener = stateRef.current.useStyleListener;
                // if no animation driver is listening for style updates, fall back to normal re-render
                // this happens when a component has group prop but no transition/animation prop
                if (!useStyleListener) {
                    var pendingState = stateRef.current.nextState;
                    if (pendingState) {
                        stateRef.current.nextState = undefined;
                        ogSetStateShallow_1(pendingState);
                    }
                    return;
                }
                var updatedState = stateRef.current.nextState || state;
                var mediaState = stateRef.current.nextMedia;
                var nextStyles = (0, getSplitStyles_1.getSplitStyles)(props, staticConfig, theme, themeName, updatedState, mediaState ? __assign(__assign({}, styleProps), { mediaState: mediaState }) : styleProps, null, componentContext, allGroupContexts, elementType, startedUnhydrated, debugProp, animationDriver);
                // compute effective transition based on entering/exiting pseudo states
                var effectiveTransition = (0, pseudoTransitions_1.resolveEffectivePseudoTransition)(stateRef.current.prevPseudoState, updatedState, nextStyles === null || nextStyles === void 0 ? void 0 : nextStyles.pseudoTransitions, props.transition);
                // update prev state for next comparison (includes group states)
                stateRef.current.prevPseudoState = (0, pseudoTransitions_1.extractPseudoState)(updatedState);
                useStyleListener(((nextStyles === null || nextStyles === void 0 ? void 0 : nextStyles.style) || {}), effectiveTransition);
            };
            function updateGroupListeners() {
                var updatedState = stateRef.current.nextState;
                if (groupContext) {
                    var group = updatedState.group, hasDynGroupChildren = updatedState.hasDynGroupChildren, unmounted = updatedState.unmounted, transition = updatedState.transition, childrenGroupState = __rest(updatedState, ["group", "hasDynGroupChildren", "unmounted", "transition"]);
                    notifyGroupSubscribers(groupContext, stateRef.current.group || null, childrenGroupState);
                }
            }
            // don't change this ever or else you break ComponentContext and cause re-rendering
            // use a Set of listeners so multiple components can register
            componentContext.mediaEmitListeners =
                componentContext.mediaEmitListeners || new Set();
            // only register once per component instance
            if (!stateRef.current.mediaEmitCleanup) {
                var updateListener_1 = function (next) {
                    var _a, _b;
                    stateRef.current.nextMedia = next;
                    (_b = (_a = stateRef.current).updateStyleListener) === null || _b === void 0 ? void 0 : _b.call(_a);
                };
                componentContext.mediaEmitListeners.add(updateListener_1);
                stateRef.current.mediaEmitCleanup = function () {
                    var _a;
                    (_a = componentContext.mediaEmitListeners) === null || _a === void 0 ? void 0 : _a.delete(updateListener_1);
                };
            }
            componentContext.mediaEmit =
                componentContext.mediaEmit ||
                    (function (next) {
                        // notify all registered components
                        for (var _i = 0, _a = componentContext.mediaEmitListeners; _i < _a.length; _i++) {
                            var listener = _a[_i];
                            listener(next);
                        }
                    });
            stateRef.current.setStateShallow = function (nextOrGetNext) {
                var _a, _b;
                var prev = stateRef.current.nextState || state;
                var next = typeof nextOrGetNext === 'function' ? nextOrGetNext(prev) : nextOrGetNext;
                if (next === prev || (0, is_equal_shallow_1.isEqualShallow)(prev, next)) {
                    return;
                }
                // one thing we have to handle here and where it gets a bit more complex is group styles
                var canAvoidReRender = Object.keys(next).every(function (key) {
                    return avoidReRenderKeys.has(key);
                });
                var updatedState = __assign(__assign({}, prev), next);
                stateRef.current.nextState = updatedState;
                if (canAvoidReRender) {
                    if (process.env.NODE_ENV === 'development' &&
                        debugProp &&
                        debugProp !== 'profile') {
                        console.groupCollapsed("[\u26A1\uFE0F] avoid setState", componentName, next, {
                            updatedState: updatedState,
                            props: props,
                        });
                        console.info(stateRef.current.host);
                        console.groupEnd();
                    }
                    updateGroupListeners();
                    (_b = (_a = stateRef.current).updateStyleListener) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                else {
                    if (process.env.NODE_ENV === 'development' &&
                        debugProp &&
                        debugProp !== 'profile') {
                        console.info("[\uD83D\uDC0C] re-render", { canAvoidReRender: canAvoidReRender, next: next });
                    }
                    ogSetStateShallow_1(next);
                }
            };
            // needs to capture latest props (it's called from memoized `events`)
            setStateShallow = function (state) {
                var _a, _b;
                (_b = (_a = stateRef.current).setStateShallow) === null || _b === void 0 ? void 0 : _b.call(_a, state);
            };
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_8 || (templateObject_8 = __makeTemplateObject(["split-styles"], ["split-styles"
                // hide strategy will set this opacity = 0 until measured
            ])));
        // hide strategy will set this opacity = 0 until measured
        if (splitStyles) {
            if (props.group &&
                props.untilMeasured === 'hide' &&
                !stateRef.current.hasMeasured) {
                splitStyles.style = splitStyles.style || {};
                splitStyles.style.opacity = 0;
            }
            if (splitStyles.dynamicThemeAccess != null) {
                stateRef.current.isListeningToTheme = splitStyles.dynamicThemeAccess;
            }
        }
        // only listen for changes if we are using raw theme values or media space, or dynamic media (native)
        // array = space media breakpoints
        var hasRuntimeMediaKeys = (splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.hasMedia) && splitStyles.hasMedia !== true;
        var shouldListenForMedia = (0, createVariable_1.didGetVariableValue)() ||
            hasRuntimeMediaKeys ||
            (noClass && (splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.hasMedia) === true);
        var mediaListeningKeys = hasRuntimeMediaKeys
            ? splitStyles.hasMedia
            : null;
        if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            console.info("useMedia() createComponent", shouldListenForMedia, mediaListeningKeys);
        }
        (0, useMedia_1.setMediaShouldUpdate)(componentContext, shouldListenForMedia, mediaListeningKeys);
        var _q = splitStyles || {}, viewPropsIn = _q.viewProps, pseudos = _q.pseudos, splitStylesStyle = _q.style, classNames = _q.classNames, pseudoGroups = _q.pseudoGroups, mediaGroups = _q.mediaGroups;
        var propsWithAnimation = props;
        var _r = viewPropsIn || {}, asChild = _r.asChild, children = _r.children, themeShallow = _r.themeShallow, _spaceDirection = _r.spaceDirection, onPress = _r.onPress, onLongPress = _r.onLongPress, onPressIn = _r.onPressIn, onPressOut = _r.onPressOut, onHoverIn = _r.onHoverIn, onHoverOut = _r.onHoverOut, onMouseUp = _r.onMouseUp, onMouseDown = _r.onMouseDown, onMouseEnter = _r.onMouseEnter, onMouseLeave = _r.onMouseLeave, onFocus = _r.onFocus, onBlur = _r.onBlur, separator = _r.separator, 
        // ignore from here on out
        passThrough = _r.passThrough, _forceStyle = _r.forceStyle, 
        // @ts-ignore  for next/link compat etc
        onClick = _r.onClick, _themeProp = _r.theme, nonHanzoguiProps = __rest(_r, ["asChild", "children", "themeShallow", "spaceDirection", "onPress", "onLongPress", "onPressIn", "onPressOut", "onHoverIn", "onHoverOut", "onMouseUp", "onMouseDown", "onMouseEnter", "onMouseLeave", "onFocus", "onBlur", "separator", "passThrough", "forceStyle", "onClick", "theme"]);
        // these can ultimately be for DOM, react-native-web views, or animated views
        // so the type is pretty loose
        var viewProps = nonHanzoguiProps;
        if (props.forceStyle) {
            viewProps.forceStyle = props.forceStyle;
        }
        if (isHOC) {
            if (typeof _themeProp !== 'undefined') {
                viewProps.theme = _themeProp;
            }
            if (typeof passThrough !== 'undefined') {
                viewProps.passThrough = passThrough;
            }
        }
        // once you set animation prop don't remove it, you can set to undefined/false
        // reason is animations are heavy - no way around it, and must be run inline here (🙅 loading as a sub-component)
        var animationStyles;
        var shouldUseAnimation = 
        // if it supports css vars we run it on server too to get matching initial style
        (inputStyle === 'css' ? willBeAnimatedClient : willBeAnimated) &&
            useAnimations &&
            !isHOC;
        var animatedRef;
        if (shouldUseAnimation) {
            var useStyleEmitter = (animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.avoidReRenders)
                ? function (listener) {
                    stateRef.current.useStyleListener = listener;
                }
                : undefined;
            // compute effective transition once here (single source of truth)
            // avoidReRenders path also computes this in updateStyleListener
            var effectiveTransition = (0, pseudoTransitions_1.resolveEffectivePseudoTransition)(stateRef.current.prevPseudoState, state, splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.pseudoTransitions, props.transition);
            // add effectiveTransition to splitStyles for drivers to consume
            if (splitStyles) {
                splitStyles.effectiveTransition = effectiveTransition;
            }
            // update prev state for next comparison (needed for non-avoidReRenders drivers like CSS)
            // avoidReRenders path also updates this in updateStyleListener
            stateRef.current.prevPseudoState = (0, pseudoTransitions_1.extractPseudoState)(state);
            var animations = useAnimations({
                props: propsWithAnimation,
                // clone style to prevent animation driver mutations from leaking to viewProps
                // during SSR/pre-hydration (CSS driver mutates style.transition in place)
                style: isHydrated ? splitStylesStyle || {} : __assign({}, splitStylesStyle),
                // @ts-ignore
                styleState: splitStyles,
                useStyleEmitter: useStyleEmitter,
                presence: presence,
                componentState: state,
                styleProps: styleProps,
                theme: theme,
                themeName: themeName,
                pseudos: pseudos || null,
                staticConfig: staticConfig,
                stateRef: stateRef,
            });
            if (animations) {
                if (animations.ref) {
                    // @ts-ignore
                    animatedRef = animations.ref;
                }
                if (isHydrated && animations) {
                    animationStyles = animations.style;
                    viewProps.style = animationStyles;
                    if (animations.className) {
                        viewProps.className = "".concat(state.unmounted === 'should-enter' ? 't_unmounted ' : '').concat(viewProps.className || '', " ").concat(animations.className);
                    }
                }
            }
            if (process.env.NODE_ENV === 'development' && time)
                time(templateObject_9 || (templateObject_9 = __makeTemplateObject(["animations"], ["animations"])));
        }
        if (process.env.NODE_ENV === 'development' && props.untilMeasured && !props.group) {
            console.warn("You set the untilMeasured prop without setting group. This doesn't work, be sure to set untilMeasured on the parent that sets group, not the children that use the $group- prop.\n\nIf you meant to do this, you can disable this warning - either change untilMeasured and group at the same time, or do group={conditional ? 'name' : undefined}");
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_10 || (templateObject_10 = __makeTemplateObject(["destructure"], ["destructure"])));
        if (!isPassthrough &&
            groupContext && // avoids onLayout if we don't need it
            props.containerType !== 'normal') {
            nonHanzoguiProps.onLayout = (0, helpers_1.composeEventHandlers)(nonHanzoguiProps.onLayout, function (e) {
                var _a;
                // one off update here
                var layout = e.nativeEvent.layout;
                groupContext.state.layout = layout;
                (_a = stateRef.current.group) === null || _a === void 0 ? void 0 : _a.emit({
                    layout: layout,
                });
                // force re-render if measure strategy is hide
                if (!stateRef.current.hasMeasured && props.untilMeasured === 'hide') {
                    setState(function (prev) { return (__assign({}, prev)); });
                }
                stateRef.current.hasMeasured = true;
            });
        }
        viewProps =
            ((_f = setupHooks_1.hooks.usePropsTransform) === null || _f === void 0 ? void 0 : _f.call(setupHooks_1.hooks, elementType, nonHanzoguiProps, stateRef, stateRef.current.willHydrate)) || nonHanzoguiProps;
        if (!stateRef.current.composedRef) {
            stateRef.current.composedRef = (0, compose_refs_1.composeRefs)(function (x) { return (stateRef.current.host = x); }, forwardedRef, setElementProps_1.setElementProps, animatedRef);
        }
        viewProps.ref = stateRef.current.composedRef;
        // handle pointer events (native: maps to touch events, web: no-op)
        (0, pointerEvents_1.usePointerEvents)(props, viewProps);
        if (process.env.NODE_ENV === 'development') {
            if (!isReactNative && !isText && constants_1.isWeb && !isHOC) {
                react_1.default.Children.toArray(props.children).forEach(function (item) {
                    // allow newlines because why not its annoying with mdx
                    if (typeof item === 'string' && item !== '\n') {
                        console.error("Unexpected text node: ".concat(item, ". A text node cannot be a child of a <").concat(staticConfig.componentName || propsIn.tag || 'View', ">."), props);
                    }
                });
            }
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_11 || (templateObject_11 = __makeTemplateObject(["events-hooks"], ["events-hooks"])));
        var unPress = function () {
            setStateShallow({ press: false, pressIn: false });
        };
        if (process.env.NODE_ENV === 'development' && constants_1.isWeb) {
            (0, constants_1.useIsomorphicLayoutEffect)(function () {
                if (debugProp === 'verbose') {
                    function cssStyleDeclarationToObject(style) {
                        var styleObject = {};
                        for (var i = 0; i < style.length; i++) {
                            var prop = style[i];
                            styleObject[prop] = style.getPropertyValue(prop);
                        }
                        return styleObject;
                    }
                    var computed = stateRef.current.host
                        ? cssStyleDeclarationToObject(getComputedStyle(stateRef.current.host))
                        : {};
                    console.groupCollapsed("Rendered > (opacity: ".concat(computed.opacity, ")"));
                    console.warn(stateRef.current.host);
                    console.warn(computed);
                    console.groupEnd();
                }
            });
        }
        // Animation enter state machine: true -> 'should-enter' -> false
        // Stage 1: Set 'should-enter' synchronously before paint to apply enterStyle classes
        // Stage 2: After browser paint, set false to trigger CSS transition
        //
        // CRITICAL: useEffect does NOT guarantee post-paint execution!
        // See: https://thoughtspile.github.io/2021/11/15/unintentional-layout-effect/
        // When layoutEffect updates state → re-render before paint → useEffect flushes pre-paint
        // Solution: Double RAF ensures browser has actually painted before we transition
        (0, constants_1.useIsomorphicLayoutEffect)(function () {
            if (state.unmounted === true && hasEnterStyle) {
                setStateShallow({ unmounted: 'should-enter' });
                return;
            }
            if (state.unmounted) {
                // For CSS transitions, we need browser to paint enterStyle before removing it.
                // Double RAF guarantees paint: first RAF schedules after current frame,
                // second RAF schedules after that frame completes (including paint).
                if (inputStyle === 'css') {
                    var cancelled_1 = false;
                    requestAnimationFrame(function () {
                        if (cancelled_1)
                            return;
                        requestAnimationFrame(function () {
                            if (cancelled_1)
                                return;
                            setStateShallow({ unmounted: false });
                        });
                    });
                    return function () {
                        cancelled_1 = true;
                    };
                }
                // Non-CSS drivers handle their own animation timing
                setStateShallow({ unmounted: false });
            }
            return function () {
                var _a, _b;
                exports.componentSetStates.delete(setState);
                (_b = (_a = stateRef.current).mediaEmitCleanup) === null || _b === void 0 ? void 0 : _b.call(_a);
            };
        }, [state.unmounted, inputStyle]);
        (0, constants_1.useIsomorphicLayoutEffect)(function () {
            if (disabled)
                return;
            if (!pseudoGroups && !mediaGroups)
                return;
            if (!allGroupContexts)
                return;
            return (0, subscribeToContextGroup_1.subscribeToContextGroup)({
                groupContext: allGroupContexts,
                setStateShallow: setStateShallow,
                mediaGroups: mediaGroups,
                pseudoGroups: pseudoGroups,
            });
        }, [
            allGroupContexts,
            disabled,
            pseudoGroups ? (0, objectIdentityKey_1.objectIdentityKey)(pseudoGroups) : 0,
            mediaGroups ? (0, objectIdentityKey_1.objectIdentityKey)(mediaGroups) : 0,
        ]);
        var groupEmitter = stateRef.current.group;
        (0, constants_1.useIsomorphicLayoutEffect)(function () {
            if (!groupContext || !groupEmitter)
                return;
            notifyGroupSubscribers(groupContext, groupEmitter, state);
        }, [groupContext, groupEmitter, state]);
        // if its a group its gotta listen for pseudos to emit them to children
        var runtimePressStyle = !disabled && noClass && (pseudos === null || pseudos === void 0 ? void 0 : pseudos.pressStyle);
        var runtimeFocusStyle = !disabled && noClass && (pseudos === null || pseudos === void 0 ? void 0 : pseudos.focusStyle);
        var runtimeFocusVisibleStyle = !disabled && noClass && (pseudos === null || pseudos === void 0 ? void 0 : pseudos.focusVisibleStyle);
        var attachFocus = Boolean(runtimePressStyle ||
            runtimeFocusStyle ||
            runtimeFocusVisibleStyle ||
            onFocus ||
            onBlur ||
            !!componentContext.setParentFocusState);
        var hasDynamicGroupChildren = Boolean(groupName && state.hasDynGroupChildren);
        var attachPress = Boolean(hasDynamicGroupChildren ||
            runtimePressStyle ||
            onPress ||
            onPressOut ||
            onPressIn ||
            onMouseDown ||
            onMouseUp ||
            onLongPress ||
            onClick ||
            (pseudos === null || pseudos === void 0 ? void 0 : pseudos.focusVisibleStyle));
        var runtimeHoverStyle = !disabled && noClass && (pseudos === null || pseudos === void 0 ? void 0 : pseudos.hoverStyle);
        var needsHoverState = Boolean(hasDynamicGroupChildren || runtimeHoverStyle);
        var attachHover = constants_1.isWeb &&
            !!(hasDynamicGroupChildren || needsHoverState || onMouseEnter || onMouseLeave);
        // check presence rather than value to prevent reparenting bugs
        // allows for onPress={x ? function : undefined} without re-ordering dom
        var shouldAttach = !disabled &&
            !props.asChild &&
            Boolean(attachFocus ||
                attachPress ||
                attachHover ||
                runtimePressStyle ||
                runtimeHoverStyle ||
                runtimeFocusStyle);
        var needsPressState = Boolean(hasDynamicGroupChildren || runtimePressStyle);
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_12 || (templateObject_12 = __makeTemplateObject(["events-setup"], ["events-setup"])));
        if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            (0, log_1.log)("\uD83E\uDEA9 events()", {
                runtimeFocusStyle: runtimeFocusStyle,
                runtimePressStyle: runtimePressStyle,
                runtimeHoverStyle: runtimeHoverStyle,
                runtimeFocusVisibleStyle: runtimeFocusVisibleStyle,
                attachPress: attachPress,
                attachFocus: attachFocus,
                attachHover: attachHover,
                shouldAttach: shouldAttach,
                needsHoverState: needsHoverState,
                pseudos: pseudos,
            });
        }
        var events = shouldAttach
            ? __assign(__assign(__assign(__assign({ onPressOut: attachPress
                    ? function (e) {
                        unPress();
                        onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut(e);
                        onMouseUp === null || onMouseUp === void 0 ? void 0 : onMouseUp(e);
                    }
                    : undefined }, ((attachHover || attachPress) && {
                onMouseEnter: function (e) {
                    var next = {};
                    // Don't set hover on touch devices - touch triggers mouseenter
                    // but there's no corresponding mouseleave on touch end
                    if (needsHoverState && !lastInteractionWasTouch.value) {
                        next.hover = true;
                    }
                    if (needsPressState) {
                        if (state.pressIn) {
                            next.press = true;
                        }
                    }
                    setStateShallow(next);
                    onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn(e);
                    onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(e);
                },
                onMouseLeave: function (e) {
                    var next = {};
                    if (needsHoverState) {
                        next.hover = false;
                    }
                    if (needsPressState) {
                        next.press = false;
                        next.pressIn = false;
                    }
                    setStateShallow(next);
                    onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut(e);
                    onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(e);
                },
            })), { onPressIn: attachPress
                    ? function (e) {
                        if (needsPressState) {
                            setStateShallow({
                                press: true,
                                pressIn: true,
                            });
                        }
                        onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(e);
                        onMouseDown === null || onMouseDown === void 0 ? void 0 : onMouseDown(e);
                        if (constants_1.isWeb) {
                            exports.componentSetStates.add(setState);
                        }
                    }
                    : undefined, onPress: attachPress
                    ? function (e) {
                        unPress();
                        if (process.env.TAMAGUI_TARGET === 'web') {
                            // @ts-ignore
                            onClick === null || onClick === void 0 ? void 0 : onClick(e);
                            // matches RN pressable behavior - only when an explicit press
                            // handler is set, so pressStyle alone doesn't swallow clicks
                            if (onPress || onClick) {
                                e.stopPropagation();
                            }
                        }
                        onPress === null || onPress === void 0 ? void 0 : onPress(e);
                        if (process.env.TAMAGUI_TARGET === 'web') {
                            onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(e);
                        }
                    }
                    : undefined }), (process.env.TAMAGUI_TARGET === 'native' &&
                attachPress &&
                onLongPress && {
                onLongPress: function (e) {
                    unPress();
                    onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress(e);
                },
            })), (attachFocus && {
                onFocus: function (e) {
                    var next = {};
                    if (componentContext.setParentFocusState) {
                        componentContext.setParentFocusState({ focusWithin: true });
                        next.focusWithin = true;
                    }
                    if (pseudos === null || pseudos === void 0 ? void 0 : pseudos.focusVisibleStyle) {
                        if (lastInteractionWasKeyboard.value) {
                            next.focusVisible = true;
                        }
                        else {
                            next.focus = true;
                        }
                    }
                    else {
                        next.focus = true;
                    }
                    setStateShallow(next);
                    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
                },
                onBlur: function (e) {
                    if (componentContext.setParentFocusState) {
                        componentContext.setParentFocusState({ focusWithin: false });
                    }
                    setStateShallow({
                        focus: false,
                        focusVisible: false,
                        focusWithin: false,
                    });
                    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                },
            })) : null;
        if (process.env.TAMAGUI_TARGET === 'native' && events && !asChild) {
            // replicating TouchableWithoutFeedback
            Object.assign(events, {
                cancelable: !viewProps.rejectResponderTermination,
                disabled: disabled,
                hitSlop: viewProps.hitSlop,
                delayLongPress: viewProps.delayLongPress,
                delayPressIn: viewProps.delayPressIn,
                delayPressOut: viewProps.delayPressOut,
                focusable: (_g = viewProps.focusable) !== null && _g !== void 0 ? _g : true,
                minPressDuration: 0,
            });
        }
        if (process.env.TAMAGUI_TARGET === 'web' && events && !isReactNative) {
            Object.assign(viewProps, (0, eventHandling_1.getWebEvents)(events));
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_13 || (templateObject_13 = __makeTemplateObject(["events"], ["events"])));
        if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
            (0, log_1.log)("events", { events: events, attachHover: attachHover, attachPress: attachPress });
        }
        var propsWithHref = props;
        var propsInWithHref = propsIn;
        var pressDebugDetail = (_m = (_l = (_k = (_j = (_h = props.testID) !== null && _h !== void 0 ? _h : propsIn.testID) !== null && _j !== void 0 ? _j : props.accessibilityLabel) !== null && _k !== void 0 ? _k : propsIn.accessibilityLabel) !== null && _l !== void 0 ? _l : (typeof propsWithHref.href === 'string' ? propsWithHref.href : null)) !== null && _m !== void 0 ? _m : (typeof propsInWithHref.href === 'string' ? propsInWithHref.href : null);
        var pressDebugName = [componentName, pressDebugDetail].filter(Boolean).join(':') || null;
        // EVENTS native - handles focus/blur, input special cases, and RNGH press handling
        // Skip gesture setup for HOC components - they may return null which crashes GestureDetector
        var pressGesture = process.env.TAMAGUI_TARGET === 'native'
            ? (0, eventHandling_1.useEvents)(events, viewProps, stateRef, staticConfig, isHOC, isInsideNativeMenu, pressDebugName)
            : null;
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_14 || (templateObject_14 = __makeTemplateObject(["hooks"], ["hooks"])));
        if (asChild) {
            elementType = Slot_1.Slot;
            // on native this is already merged into viewProps in useEvents
            if (process.env.TAMAGUI_TARGET === 'web') {
                var webStyleEvents = asChild === 'web' || asChild === 'except-style-web';
                var passEvents = (0, eventHandling_1.getWebEvents)({
                    onPress: onPress,
                    onLongPress: onLongPress,
                    onPressIn: onPressIn,
                    onPressOut: onPressOut,
                    onMouseUp: onMouseUp,
                    onMouseDown: onMouseDown,
                    onMouseEnter: onMouseEnter,
                    onMouseLeave: onMouseLeave,
                }, webStyleEvents);
                Object.assign(viewProps, passEvents);
            }
            else {
                Object.assign(viewProps, { onPress: onPress, onLongPress: onLongPress });
            }
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_15 || (templateObject_15 = __makeTemplateObject(["spaced-as-child"], ["spaced-as-child"])));
        var content;
        if (isPassthrough) {
            // avoid re-parenting but avoid layout changes
            content = react_1.default.createElement(BaseComponent, {
                style: {
                    display: 'contents',
                },
            }, propsIn.children);
        }
        else {
            // here elementType is either the custom animated driver view, or base view
            if (setupHooks_1.hooks.useChildren) {
                // ONLY native:
                content = setupHooks_1.hooks.useChildren(elementType, content || children, viewProps);
            }
            var isRenderPropString = typeof renderProp === 'string';
            // this ONLY handles the case where render is NOT a string
            // either direct JSX, or a function that returns JSX, we always clone
            if (renderProp && !isRenderPropString) {
                var out = getCustomRender(renderProp, content || children, viewProps, componentState);
                if (out) {
                    viewProps = out.viewProps;
                    elementType = out.elementType;
                }
            }
            if (!content) {
                // web-only, handle render === string passing to custom animated component
                if (isRenderPropString) {
                    viewProps.render === renderProp;
                }
                content = react_1.default.createElement(elementType, viewProps, content || children);
            }
            if (process.env.NODE_ENV === 'development' && time)
                time(templateObject_16 || (templateObject_16 = __makeTemplateObject(["use-children"], ["use-children"])));
        }
        // wrap with GestureDetector for RNGH press handling (native only, no-op on web)
        // Skip for HOC and composite components - they pass press events to inner component instead
        if (process.env.TAMAGUI_TARGET === 'native') {
            var isCompositeComponent = !isHOC && Component && typeof Component !== 'string';
            content = (0, eventHandling_1.wrapWithGestureDetector)(content, pressGesture, stateRef, isHOC, isCompositeComponent);
        }
        // needs to reset the presence state for nested children
        // Use the resolved animationDriver (handles multi-driver config)
        var ResetPresence = animationDriver === null || animationDriver === void 0 ? void 0 : animationDriver.ResetPresence;
        var needsReset = Boolean(
        // not when passing down to child
        !asChild &&
            // not when passThrough
            splitStyles &&
            // not when HOC
            !isHOC &&
            ResetPresence &&
            willBeAnimated &&
            (hasEnterStyle || presenceState));
        // avoid re-parenting
        var hasEverReset = stateRef.current.hasEverResetPresence;
        if (needsReset && !hasEverReset) {
            stateRef.current.hasEverResetPresence = true;
        }
        var renderReset = needsReset || hasEverReset;
        if (renderReset && ResetPresence) {
            content = (0, jsx_runtime_1.jsx)(ResetPresence, { disabled: !needsReset, children: content });
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_17 || (templateObject_17 = __makeTemplateObject(["create-element"], ["create-element"])));
        if ('focusWithinStyle' in propsIn || (pseudos === null || pseudos === void 0 ? void 0 : pseudos.focusWithinStyle)) {
            content = ((0, jsx_runtime_1.jsx)(ComponentContext_1.ComponentContext.Provider, __assign({}, componentContext, { setParentFocusState: setStateShallow, children: content })));
        }
        if ('group' in props) {
            content = ((0, jsx_runtime_1.jsx)(GroupContext_1.GroupContext.Provider, { value: allGroupContexts, children: content }));
        }
        // Text components set inText context for children so nested Text can inherit styles
        if (process.env.TAMAGUI_TARGET === 'web' && !asChild && isText && !hasTextAncestor) {
            content = ((0, jsx_runtime_1.jsx)(ComponentContext_1.ComponentContext.Provider, __assign({}, componentContext, { inText: true, children: content })));
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_18 || (templateObject_18 = __makeTemplateObject(["group-context"], ["group-context"])));
        content =
            disableTheme || !splitStyles
                ? content
                : (0, Theme_1.getThemedChildren)(themeState, content, themeStateProps, false, stateRef);
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_19 || (templateObject_19 = __makeTemplateObject(["themed-children"], ["themed-children"])));
        if (process.env.TAMAGUI_TARGET === 'web') {
            if (isReactNative && !asChild) {
                content = ((0, jsx_runtime_1.jsx)("span", __assign({ className: "_dsp_contents" }, (!isPassthrough && isHydrated && events && (0, eventHandling_1.getWebEvents)(events)), { children: content })));
            }
        }
        if (overriddenContextProps && contextForOverride) {
            var Provider = contextForOverride.Provider;
            // make sure we re-order styled context keys based on how we pass them here:
            for (var key in styledContextValue) {
                if (!(key in overriddenContextProps)) {
                    overriddenContextProps[key] = styledContextValue[key];
                }
            }
            content = ((0, jsx_runtime_1.jsx)(Provider, __assign({ __disableMergeDefaultValues: true }, overriddenContextProps, { children: content })));
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_20 || (templateObject_20 = __makeTemplateObject(["context-override"], ["context-override"
                // SSR style support - for non compiled styles we render them inline until client takes over
                // on client we then switch over to our global sheet insert, because rendering inline is expensive
            ])));
        // SSR style support - for non compiled styles we render them inline until client takes over
        // on client we then switch over to our global sheet insert, because rendering inline is expensive
        if (process.env.TAMAGUI_TARGET === 'web' && startedUnhydrated && splitStyles) {
            content = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [content, !isHydrated ? (0, wrapStyleTags_1.getStyleTags)(Object.values(splitStyles.rulesToInsert)) : null] }));
        }
        if (process.env.NODE_ENV === 'development' && time)
            time(templateObject_21 || (templateObject_21 = __makeTemplateObject(["style-tags"], ["style-tags"])));
        if (process.env.NODE_ENV === 'development') {
            if (debugProp && debugProp !== 'profile') {
                var element_1 = typeof elementType === 'string' ? elementType : 'Component';
                var title = "render <".concat(element_1, " /> (").concat(internalID, ") with props");
                if (!constants_1.isWeb || !constants_1.isClient) {
                    (0, log_1.log)(title);
                    (0, log_1.log)("state: ", state);
                    if (isDevTools_1.isDevTools) {
                        (0, log_1.log)('viewProps', viewProps);
                    }
                    (0, log_1.log)("final styles:");
                    for (var key in splitStylesStyle) {
                        (0, log_1.log)(key, splitStylesStyle[key]);
                    }
                }
                else {
                    console.groupCollapsed(title);
                    try {
                        (0, log_1.log)('viewProps', viewProps);
                        (0, log_1.log)('children', content);
                        if (typeof window !== 'undefined') {
                            (0, log_1.log)({
                                propsIn: propsIn,
                                props: props,
                                attachPress: attachPress,
                                animationStyles: animationStyles,
                                classNames: classNames,
                                content: content,
                                elementType: elementType,
                                events: events,
                                isAnimated: isAnimated,
                                hasRuntimeMediaKeys: hasRuntimeMediaKeys,
                                isStringElement: isStringElement,
                                mediaListeningKeys: mediaListeningKeys,
                                pseudos: pseudos,
                                shouldAttach: shouldAttach,
                                noClass: noClass,
                                shouldListenForMedia: shouldListenForMedia,
                                splitStyles: splitStyles,
                                splitStylesStyle: splitStylesStyle,
                                state: state,
                                stateRef: stateRef,
                                staticConfig: staticConfig,
                                styleProps: styleProps,
                                themeState: themeState,
                                viewProps: viewProps,
                                willBeAnimated: willBeAnimated,
                                startedUnhydrated: startedUnhydrated,
                            });
                        }
                    }
                    catch (_s) {
                        // RN can run into PayloadTooLargeError: request entity too large
                    }
                    finally {
                        console.groupEnd();
                    }
                }
                if (debugProp === 'break') {
                    // debugger intentionally here for debugging
                }
            }
        }
        if (process.env.NODE_ENV === 'development' && time) {
            time(templateObject_22 || (templateObject_22 = __makeTemplateObject(["rest"], ["rest"])));
            if (!globalThis['willPrint']) {
                globalThis['willPrint'] = true;
                setTimeout(function () {
                    delete globalThis['willPrint'];
                    time.print();
                    time = null;
                }, 50);
            }
        }
        return content;
    });
    function notifyGroupSubscribers(groupContext, groupEmitter, pseudo) {
        if (!groupContext || !groupEmitter) {
            return;
        }
        var nextState = __assign(__assign({}, groupContext.state), { pseudo: pseudo });
        groupEmitter.emit(nextState);
        groupContext.state = nextState;
    }
    // let hasLogged = false
    if (staticConfig.componentName) {
        component.displayName = staticConfig.componentName;
    }
    var res = component;
    // we now have avoid re-renders in many more cases so imo this is way more worth it
    // Text/Button/string taking components
    //  + react compiler can memoize children too
    res = react_1.default.memo(res);
    res.staticConfig = staticConfig;
    function extendStyledConfig(extended) {
        return __assign(__assign(__assign({}, staticConfig), extended), { neverFlatten: true, isHOC: true, isStyledHOC: false });
    }
    function styleable(Component, options) {
        var skipForwardRef = typeof Component === 'function' && Component.length === 1;
        var out = skipForwardRef ? Component : react_1.default.forwardRef(Component);
        var extendedConfig = extendStyledConfig(options === null || options === void 0 ? void 0 : options.staticConfig);
        out = (options === null || options === void 0 ? void 0 : options.disableTheme) ? out : (0, themeable_1.themeable)(out, extendedConfig, true);
        if (extendedConfig.memo || process.env.TAMAGUI_MEMOIZE_STYLEABLE) {
            out = react_1.default.memo(out);
        }
        out.staticConfig = extendedConfig;
        out.styleable = styleable;
        return out;
    }
    res.styleable = styleable;
    return res;
}
var fromPx = function (val) {
    if (typeof val === 'number')
        return val;
    if (typeof val === 'string')
        return +val.replace('px', '');
    return 0;
};
// handles all render logic - returns a new component
var getCustomRender = function (renderProp, content, viewProps, state) {
    // Handle render prop variants: function, JSX element, or string
    if (typeof renderProp === 'function') {
        // Render function: full control with props and state
        var out = renderProp(viewProps, state);
        renderProp = getRenderElementForPlatform(out);
    }
    if (renderProp) {
        if (typeof renderProp === 'object' && react_1.default.isValidElement(renderProp)) {
            // JSX element: clone with merged props
            var renderElement = getRenderElementForPlatform(renderProp);
            if (renderElement) {
                var elementProps = renderProp.props;
                var mergedProps = elementProps
                    ? (0, mergeRenderElementProps_1.mergeRenderElementProps)(elementProps, viewProps, content)
                    : viewProps;
                return {
                    elementType: renderProp.type,
                    viewProps: mergedProps,
                };
            }
        }
    }
};
// avoid passing web-only elements to native
function getRenderElementForPlatform(potential) {
    if (process.env.TAMAGUI_TARGET === 'native') {
        if (isHTMLElement(potential)) {
            return;
        }
    }
    return potential;
}
function isHTMLElement(el) {
    return typeof el['type'] === 'string' && el['type'][0] === el['type'][0].toLowerCase();
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
