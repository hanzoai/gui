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
exports.useSplitStyles = exports.getSubStyle = exports.getSplitStyles = exports.PROP_SPLIT = exports.styleOriginalValues = void 0;
var constants_1 = require("@hanzogui/constants");
var helpers_1 = require("@hanzogui/helpers");
var react_1 = require("react");
var config_1 = require("../config");
var isDevTools_1 = require("../constants/isDevTools");
var useMedia_1 = require("../hooks/useMedia");
var mediaState_1 = require("./mediaState");
var createMediaStyle_1 = require("./createMediaStyle");
var expandStyles_1 = require("./expandStyles");
var getCSSStylesAtomic_1 = require("./getCSSStylesAtomic");
var getDefaultProps_1 = require("./getDefaultProps");
var getDynamicVal_1 = require("./getDynamicVal");
var getGroupPropParts_1 = require("./getGroupPropParts");
var insertStyleRule_1 = require("./insertStyleRule");
var isActivePlatform_1 = require("./isActivePlatform");
var isActiveTheme_1 = require("./isActiveTheme");
var log_1 = require("./log");
var normalizeValueWithProperty_1 = require("./normalizeValueWithProperty");
var propMapper_1 = require("./propMapper");
var pseudoDescriptors_1 = require("./pseudoDescriptors");
var skipProps_1 = require("./skipProps");
var sortString_1 = require("./sortString");
var transformsToString_1 = require("./transformsToString");
var conf;
// WeakMap to track original token values for style objects
// Used to preserve '$8' style tokens instead of resolved 'var(--t-space-8)'
// for context prop propagation to children (issues #3670, #3676)
exports.styleOriginalValues = new WeakMap();
exports.PROP_SPLIT = '-';
// Normalize group keys like $group-press to $group-true-press when the group name
// doesn't exist in context (defaults to the unnamed 'true' group)
function normalizeGroupKey(key, groupContext) {
    var parts = key.split('-');
    var plen = parts.length;
    if (
    // check if its actually a simple group selector to avoid breaking selectors
    plen === 2 ||
        (plen === 3 && pseudoDescriptors_1.pseudoPriorities[parts[parts.length - 1]])) {
        var name_1 = parts[1];
        if (name_1 !== 'true' && groupContext && !groupContext[name_1]) {
            return key.replace('$group-', '$group-true-');
        }
    }
    return key;
}
// if you need and easier way to test performance, you can do something like this
// add this early return somewhere in this file and you can see roughly where it slows down:
// return {
//   space,
//   hasMedia,
//   fontFamily: styleState.fontFamily,
//   viewProps: {
//     children: props.children,
//   },
//   style: {
//     borderColor: props.borderColor,
//     borderWidth: props.borderWidth,
//     padding: props.padding,
//   },
//   pseudos,
//   classNames,
//   rulesToInsert,
//   dynamicThemeAccess,
// }
function isValidStyleKey(key, validStyles, accept) {
    return key in validStyles ? true : accept && key in accept;
}
var getSplitStyles = function (props, staticConfig, theme, themeName, componentState, styleProps, parentSplitStyles, componentContext, groupContext, elementType, startedUnhydrated, debug, animationDriver) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    conf = conf || (0, config_1.getConfig)();
    // use passed animationDriver or fall back to context/config
    var driver = animationDriver ||
        (componentContext === null || componentContext === void 0 ? void 0 : componentContext.animationDriver) ||
        conf.animations;
    if (props.passThrough) {
        return null;
    }
    // a bit icky, we need no normalize but not fully
    if (constants_1.isWeb &&
        styleProps.isAnimated &&
        (driver === null || driver === void 0 ? void 0 : driver.isReactNative) &&
        !styleProps.noNormalize) {
        styleProps.noNormalize = 'values';
    }
    var shorthands = conf.shorthands;
    var isHOC = staticConfig.isHOC, isText = staticConfig.isText, isInput = staticConfig.isInput, variants = staticConfig.variants, isReactNative = staticConfig.isReactNative, inlineProps = staticConfig.inlineProps, inlineWhenUnflattened = staticConfig.inlineWhenUnflattened, parentStaticConfig = staticConfig.parentStaticConfig, acceptsClassName = staticConfig.acceptsClassName;
    var viewProps = {};
    var mediaState = styleProps.mediaState || mediaState_1.mediaState;
    var shouldDoClasses = acceptsClassName && constants_1.isWeb && !styleProps.noClass;
    var rulesToInsert = process.env.TAMAGUI_TARGET === 'native' ? undefined : {};
    var classNames = {};
    var space = props.space;
    var pseudos = null;
    var hasMedia = false;
    var dynamicThemeAccess;
    var pseudoGroups;
    var mediaGroups;
    var className = props.className || ''; // existing classNames
    var mediaStylesSeen = 0;
    var validStyles = staticConfig.validStyles ||
        (staticConfig.isText || staticConfig.isInput ? helpers_1.stylePropsText : helpers_1.validStyles);
    if (process.env.NODE_ENV === 'development' &&
        (debug === 'profile' || globalThis.time)) {
        // @ts-expect-error
        time(templateObject_1 || (templateObject_1 = __makeTemplateObject(["split-styles-setup"], ["split-styles-setup"])));
    }
    /**
     * Not the biggest fan of creating an object but it is a nice API
     */
    var styleState = {
        classNames: classNames,
        conf: conf,
        props: props,
        styleProps: styleProps,
        componentState: componentState,
        staticConfig: staticConfig,
        style: null,
        theme: theme,
        usedKeys: {},
        viewProps: viewProps,
        context: componentContext,
        debug: debug,
        // resolved animation driver (respects animatedBy prop)
        animationDriver: driver,
    };
    // only used by compiler
    if (process.env.IS_STATIC === 'is_static') {
        var fallbackProps_1 = styleProps.fallbackProps;
        if (fallbackProps_1) {
            styleState.props = new Proxy(props, {
                get: function (_, key, val) {
                    if (!Reflect.has(props, key)) {
                        return Reflect.get(fallbackProps_1, key);
                    }
                    return Reflect.get(props, key);
                },
            });
        }
    }
    if (process.env.NODE_ENV === 'development' &&
        (debug === 'profile' || globalThis.time)) {
        // @ts-expect-error
        time(templateObject_2 || (templateObject_2 = __makeTemplateObject(["style-state"], ["style-state"])));
    }
    if (process.env.NODE_ENV === 'development' && debug === 'verbose' && constants_1.isClient) {
        if (isDevTools_1.isDevTools) {
            console.groupCollapsed('🔹 getSplitStyles 👇');
            (0, log_1.log)({
                props: props,
                staticConfig: staticConfig,
                shouldDoClasses: shouldDoClasses,
                styleProps: styleProps,
                rulesToInsert: rulesToInsert,
                componentState: componentState,
                styleState: styleState,
                theme: __assign({}, theme),
            });
        }
    }
    var asChild = props.asChild;
    var accept = staticConfig.accept;
    var noSkip = styleProps.noSkip, disableExpandShorthands = styleProps.disableExpandShorthands, noExpand = styleProps.noExpand, styledContext = styleProps.styledContext;
    var webContainerType = conf.settings.webContainerType;
    var parentVariants = parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.variants;
    var _loop_1 = function (keyOg) {
        var keyInit = keyOg;
        var valInit = props[keyInit];
        if (keyInit === 'children') {
            viewProps[keyInit] = valInit;
            return "continue";
        }
        if (process.env.NODE_ENV === 'development' &&
            (debug === 'profile' || globalThis.time)) {
            // @ts-expect-error
            time(templateObject_3 || (templateObject_3 = __makeTemplateObject(["before-prop-", ""], ["before-prop-", ""])), keyInit);
        }
        if (process.env.NODE_ENV === 'test' && keyInit === 'jestAnimatedStyle') {
            return "continue";
        }
        // for custom accept sub-styles
        if (accept) {
            var accepted = accept[keyInit];
            if ((accepted === 'style' || accepted === 'textStyle') &&
                valInit &&
                typeof valInit === 'object') {
                viewProps[keyInit] = (0, exports.getSubStyle)(styleState, keyInit, valInit, styleProps.noClass);
                return "continue";
            }
        }
        // normalize shorthands up front
        if (!disableExpandShorthands) {
            if (keyInit in shorthands) {
                keyInit = shorthands[keyInit];
            }
        }
        if (keyInit === 'className')
            return "continue"; // handled above first
        // when asChild, skip default props - they shouldn't be passed down to children
        if (asChild) {
            var defaults = (0, getDefaultProps_1.getDefaultProps)(staticConfig);
            if (defaults) {
                // check both original key and expanded key (after shorthand expansion)
                var defaultVal = (_a = defaults[keyOg]) !== null && _a !== void 0 ? _a : defaults[keyInit];
                if (defaultVal !== undefined && valInit === defaultVal) {
                    return "continue";
                }
            }
        }
        // keyInit === 'style' is handled in skipProps
        if (keyInit in skipProps_1.skipProps && !noSkip && !isHOC) {
            if (keyInit === 'group') {
                if (process.env.TAMAGUI_TARGET === 'web') {
                    // add container style
                    var identifier = "t_group_".concat(valInit);
                    var containerType = webContainerType || 'inline-size';
                    var containerCSS = [
                        'container',
                        undefined,
                        identifier,
                        undefined,
                        [
                            ".".concat(identifier, " { container-name: ").concat(valInit, "; container-type: ").concat(containerType, "; }"),
                        ],
                    ];
                    addStyleToInsertRules(rulesToInsert, containerCSS);
                }
            }
            // transition prop is skipped when it's a named animation (e.g. 'quick')
            // but raw CSS values (from $platform-web) should pass through as style
            if (keyInit === 'transition' &&
                typeof valInit === 'string' &&
                !((_b = driver === null || driver === void 0 ? void 0 : driver.animations) === null || _b === void 0 ? void 0 : _b[valInit])) {
                // not a known animation name, treat as raw CSS
            }
            else {
                return "continue";
            }
        }
        var isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept);
        // this is all for partially optimized (not flattened)... maybe worth removing?
        if (process.env.TAMAGUI_TARGET === 'web') {
            // react-native-web ignores data-* attributes, fixes passing them to animated views
            if (staticConfig.isReactNative && keyInit.startsWith('data-')) {
                keyInit = keyInit.replace('data-', '');
                viewProps['dataSet'] || (viewProps['dataSet'] = {});
                viewProps['dataSet'][keyInit] = valInit;
                return "continue";
            }
        }
        if (process.env.TAMAGUI_TARGET === 'native') {
            if (!isValidStyleKeyInit) {
                if (!constants_1.isAndroid) {
                    // only works in android
                    if (keyInit === 'elevationAndroid')
                        return "continue";
                }
                // map userSelect to native prop
                if (keyInit === 'userSelect') {
                    keyInit = 'selectable';
                    valInit = valInit !== 'none';
                }
                else if (keyInit.startsWith('data-')) {
                    return "continue";
                }
            }
        }
        if (process.env.TAMAGUI_TARGET === 'web') {
            if (!noExpand) {
                /**
                 * Copying in the accessibility/prop handling from react-native-web here
                 * Keeps it in a single loop, avoids dup de-structuring to avoid bundle size
                 */
                if (keyInit === 'disabled' && valInit === true) {
                    viewProps['aria-disabled'] = true;
                    // Enhance with native semantics
                    if (elementType === 'button' ||
                        elementType === 'form' ||
                        elementType === 'input' ||
                        elementType === 'select' ||
                        elementType === 'textarea') {
                        viewProps.disabled = true;
                    }
                    if (!(variants === null || variants === void 0 ? void 0 : variants.disabled)) {
                        return "continue";
                    }
                }
                if (keyInit === 'testID') {
                    if (isReactNative) {
                        viewProps.testID = valInit;
                    }
                    else {
                        viewProps['data-testid'] = valInit;
                        // also keep testID when using RN animation driver (Animated.View
                        // from react-native-web only forwards testID, not data-testid)
                        if (styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.isReactNative)) {
                            viewProps.testID = valInit;
                        }
                    }
                    return "continue";
                }
                if (keyInit === 'id') {
                    viewProps.id = valInit;
                    return "continue";
                }
            }
        }
        /**
         * There's (some) reason to this madness: we want to allow returning media/pseudo from variants
         * Say you have a variant hoverable: { true: { hoverStyle: {} } }
         * We run propMapper first to expand variant, then we run the inner loop and look again
         * for if there's a pseudo/media returned from it.
         */
        var isVariant = !isValidStyleKeyInit && variants && keyInit in variants;
        var isStyleLikeKey = isValidStyleKeyInit || isVariant;
        var isPseudo = keyInit in helpers_1.validPseudoKeys;
        var isMedia = !isStyleLikeKey && !isPseudo ? (0, useMedia_1.getMediaKey)(keyInit) : false;
        var isMediaOrPseudo = Boolean(isMedia || isPseudo);
        if (isMediaOrPseudo && isMedia === 'group') {
            keyInit = normalizeGroupKey(keyInit, groupContext);
        }
        var isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || (isVariant && !noExpand);
        if (isStyleProp && (asChild === 'except-style' || asChild === 'except-style-web')) {
            return "continue";
        }
        var shouldPassProp = (!isStyleProp && isHOC) ||
            // is in parent variants
            (isHOC && parentVariants && keyInit in parentVariants) ||
            (inlineProps === null || inlineProps === void 0 ? void 0 : inlineProps.has(keyInit));
        var parentVariant = parentVariants === null || parentVariants === void 0 ? void 0 : parentVariants[keyInit];
        var isHOCShouldPassThrough = Boolean(isHOC &&
            (isValidStyleKeyInit || isMediaOrPseudo || parentVariant || keyInit in skipProps_1.skipProps));
        var shouldPassThrough = shouldPassProp || isHOCShouldPassThrough;
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // console.groupEnd() // react native was not nesting right
            console.groupCollapsed("  \uD83D\uDD11 ".concat(keyOg).concat(keyInit !== keyOg ? " (shorthand for ".concat(keyInit, ")") : '', " ").concat(shouldPassThrough ? '(pass)' : ''));
            (0, log_1.log)({ isVariant: isVariant, valInit: valInit, shouldPassProp: shouldPassProp });
            if (constants_1.isClient) {
                (0, log_1.log)({
                    variants: variants,
                    variant: variants === null || variants === void 0 ? void 0 : variants[keyInit],
                    isVariant: isVariant,
                    isHOCShouldPassThrough: isHOCShouldPassThrough,
                    usedKeys: __assign({}, styleState.usedKeys),
                    parentStaticConfig: parentStaticConfig,
                });
            }
        }
        if (shouldPassThrough) {
            // // TODO bring this back but probably improve it?
            // if (isPseudo) {
            //   // this is a lot... but we need to track sub-keys so we don't override them in future things that aren't passed down
            //   // like our own variants that aren't in parent
            //   const pseudoStyleObject = getSubStyle(
            //     styleState,
            //     keyInit,
            //     valInit,
            //     fontFamily,
            //     true,
            //     state.noClass
            //   )
            //   const descriptor = pseudoDescriptors[keyInit]
            //   for (const key in pseudoStyleObject) {
            //     debugger
            //   }
            // }
            passDownProp(viewProps, keyInit, valInit, isMediaOrPseudo);
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                console.groupEnd();
            }
            // if it's a variant here, we have a two layer variant...
            // aka styled(Input, { unstyled: true, variants: { unstyled: {} } })
            // which now has it's own unstyled + the child unstyled...
            // so *don't* skip applying the styles if its different from the parent one
            if (!isVariant) {
                return "continue";
            }
        }
        // after shouldPassThrough
        if (!noSkip) {
            if (keyInit in skipProps_1.skipProps &&
                !(keyInit === 'transition' &&
                    typeof valInit === 'string' &&
                    !((_c = driver === null || driver === void 0 ? void 0 : driver.animations) === null || _c === void 0 ? void 0 : _c[valInit]))) {
                if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                    console.groupEnd();
                }
                return "continue";
            }
        }
        // we sort of have to update fontFamily all the time: before variants run, after each variant
        if (isText || isInput) {
            if (valInit &&
                (keyInit === 'fontFamily' || keyInit === shorthands['fontFamily']) &&
                valInit in conf.fontsParsed) {
                styleState.fontFamily = valInit;
            }
        }
        var disablePropMap = isMediaOrPseudo || !isStyleLikeKey;
        (0, propMapper_1.propMapper)(keyInit, valInit, styleState, disablePropMap, function (key, val, originalVal) {
            var _a, _b, _c, _d, _e;
            var isStyledContextProp = styledContext && key in styledContext;
            if (!isHOC && disablePropMap && !isStyledContextProp && !isMediaOrPseudo) {
                viewProps[key] = val;
                return;
            }
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                console.groupCollapsed('  💠 expanded', keyInit, '=>', key);
                (0, log_1.log)(val);
                console.groupEnd();
            }
            if (val == null)
                return;
            if (process.env.TAMAGUI_TARGET === 'native') {
                if (key === 'pointerEvents') {
                    viewProps[key] = val;
                    return;
                }
            }
            if ((!isHOC && isValidStyleKey(key, validStyles, accept)) ||
                (process.env.TAMAGUI_TARGET === 'native' && constants_1.isAndroid && key === 'elevation')) {
                mergeStyle(styleState, key, val, 1, false, originalVal);
                return;
            }
            // re-run with expanded key
            isPseudo = key in helpers_1.validPseudoKeys;
            isMedia = isPseudo ? false : (0, useMedia_1.getMediaKey)(key);
            isMediaOrPseudo = Boolean(isMedia || isPseudo);
            isVariant = variants && key in variants;
            // handle group key transformation for variant-expanded keys (issue #3613)
            if (isMedia === 'group') {
                key = normalizeGroupKey(key, groupContext);
            }
            if ((inlineProps === null || inlineProps === void 0 ? void 0 : inlineProps.has(key)) ||
                (process.env.IS_STATIC === 'is_static' && (inlineWhenUnflattened === null || inlineWhenUnflattened === void 0 ? void 0 : inlineWhenUnflattened.has(key)))) {
                viewProps[key] = (_a = props[key]) !== null && _a !== void 0 ? _a : val;
            }
            // have to run this logic again here because expansions may need to be passed down
            // see StyledButtonVariantPseudoMerge test
            var shouldPassThrough = (styleProps.noExpand && isPseudo) ||
                (isHOC && (isMediaOrPseudo || ((_b = parentStaticConfig === null || parentStaticConfig === void 0 ? void 0 : parentStaticConfig.variants) === null || _b === void 0 ? void 0 : _b[keyInit])));
            if (shouldPassThrough) {
                passDownProp(viewProps, key, val, isMediaOrPseudo);
                if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                    console.groupCollapsed(" - passing down prop ".concat(key));
                    (0, log_1.log)({ val: val, after: __assign({}, viewProps[key]) });
                    console.groupEnd();
                }
                return;
            }
            if (isPseudo) {
                if (!val)
                    return;
                // TODO can avoid processing this if !shouldDoClasses + state is off
                // (note: can't because we need to set defaults on enter/exit or else enforce that they should)
                var pseudoStyleObject = (0, exports.getSubStyle)(styleState, key, val, styleProps.noClass && !(process.env.IS_STATIC === 'is_static'));
                if (!shouldDoClasses || process.env.IS_STATIC === 'is_static') {
                    pseudos || (pseudos = {});
                    pseudos[key] || (pseudos[key] = {});
                    // if compiler we can just set this and continue on our way
                    if (process.env.IS_STATIC === 'is_static') {
                        Object.assign(pseudos[key], pseudoStyleObject);
                        return;
                    }
                }
                var descriptor = pseudoDescriptors_1.pseudoDescriptors[key];
                var isEnter = key === 'enterStyle';
                var isExit = key === 'exitStyle';
                // don't continue here on isEnter && !state.unmounted because we need to merge defaults
                if (!descriptor) {
                    return;
                }
                // on server only generate classes for enterStyle
                if (shouldDoClasses && !isExit) {
                    var pseudoStyles = (0, getCSSStylesAtomic_1.getStyleAtomic)(pseudoStyleObject, descriptor);
                    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                        console.info('pseudo:', key, pseudoStyleObject, pseudoStyles);
                    }
                    for (var _i = 0, pseudoStyles_1 = pseudoStyles; _i < pseudoStyles_1.length; _i++) {
                        var psuedoStyle = pseudoStyles_1[_i];
                        var fullKey = "".concat(psuedoStyle[helpers_1.StyleObjectProperty]).concat(exports.PROP_SPLIT).concat(descriptor.name);
                        addStyleToInsertRules(rulesToInsert, psuedoStyle);
                        classNames[fullKey] = psuedoStyle[helpers_1.StyleObjectIdentifier];
                    }
                }
                if (!shouldDoClasses || isExit || isEnter) {
                    // we don't skip this if disabled because we need to animate to default states that aren't even set:
                    // so if we have <Stack enterStyle={{ opacity: 0 }} />
                    // we need to animate from 0 => 1 once enter is finished
                    // see the if (isDisabled) block below which loops through animatableDefaults
                    var descriptorKey = descriptor.stateKey || descriptor.name;
                    var isDisabled = componentState[descriptorKey] === false;
                    if (isExit) {
                        isDisabled = !styleProps.isExiting;
                    }
                    if (isEnter && componentState.unmounted === false) {
                        isDisabled = true;
                    }
                    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                        console.groupCollapsed('pseudo', key, { isDisabled: isDisabled });
                        (0, log_1.log)({ pseudoStyleObject: pseudoStyleObject, isDisabled: isDisabled, descriptor: descriptor, componentState: componentState });
                        console.groupEnd();
                    }
                    var importance = descriptor.priority;
                    var pseudoOriginalValues = exports.styleOriginalValues.get(pseudoStyleObject);
                    for (var pkey in pseudoStyleObject) {
                        var val_1 = pseudoStyleObject[pkey];
                        // when disabled ensure the default value is set for future animations to align
                        if (isDisabled) {
                            applyDefaultStyle(pkey, styleState);
                        }
                        else {
                            var curImportance = styleState.usedKeys[pkey] || 0;
                            var shouldMerge = importance >= curImportance;
                            if (shouldMerge) {
                                if (process.env.IS_STATIC === 'is_static') {
                                    pseudos || (pseudos = {});
                                    pseudos[key] || (pseudos[key] = {});
                                    pseudos[key][pkey] = val_1;
                                }
                                mergeStyle(styleState, pkey, val_1, importance, false, pseudoOriginalValues === null || pseudoOriginalValues === void 0 ? void 0 : pseudoOriginalValues[pkey]);
                            }
                            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                                (0, log_1.log)('    subKey', pkey, shouldMerge, {
                                    importance: importance,
                                    curImportance: curImportance,
                                    pkey: pkey,
                                    val: val_1,
                                });
                            }
                        }
                    }
                    // set this after the loop over pseudoStyleObject so it applies before setting usedKeys
                    if (!isDisabled) {
                        // mark usedKeys based on pseudoStyleObject
                        for (var key_1 in val) {
                            var k = shorthands[key_1] || key_1;
                            styleState.usedKeys[k] = Math.max(importance, styleState.usedKeys[k] || 0);
                        }
                    }
                }
                return;
            }
            // media
            if (isMedia) {
                if (!val)
                    return;
                // for some reason 'space' in val upsetting next ssr during prod build
                // technically i guess this also will not apply if 0 space which makes sense?
                var mediaKeyShort_1 = key.slice(isMedia == 'theme' ? 7 : 1);
                hasMedia || (hasMedia = true);
                var hasSpace = val['space'];
                if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
                    if (!hasMedia || typeof hasMedia === 'boolean') {
                        hasMedia = new Set();
                    }
                    hasMedia.add(mediaKeyShort_1);
                }
                // can bail early
                if (isMedia === 'platform') {
                    if (!(0, isActivePlatform_1.isActivePlatform)(key)) {
                        return;
                    }
                }
                if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                    (0, log_1.log)("  \uD83D\uDCFA ".concat(key), {
                        key: key,
                        val: val,
                        props: props,
                        shouldDoClasses: shouldDoClasses,
                        acceptsClassName: acceptsClassName,
                        componentState: componentState,
                        mediaState: mediaState,
                    });
                }
                var priority = mediaStylesSeen;
                mediaStylesSeen += 1;
                // for theme media ($theme-light, $theme-dark), generate CSS classes for proper SSR
                // when noClass is set (inline animation drivers), de-opt to inline styles so the
                if (shouldDoClasses) {
                    var mediaStyle = (0, exports.getSubStyle)(styleState, key, val, false);
                    var mediaStyles = (0, getCSSStylesAtomic_1.getCSSStylesAtomic)(mediaStyle);
                    for (var _f = 0, mediaStyles_1 = mediaStyles; _f < mediaStyles_1.length; _f++) {
                        var style = mediaStyles_1[_f];
                        // handle nested media:
                        // for now we're doing weird stuff, getCSSStylesAtomic will put the
                        // $platform-web into property so we can check it here
                        var property = style[helpers_1.StyleObjectProperty];
                        var isSubStyle = property[0] === '$';
                        if (isSubStyle && !(0, isActivePlatform_1.isActivePlatform)(property)) {
                            continue;
                        }
                        var out = (0, createMediaStyle_1.createMediaStyle)(style, mediaKeyShort_1, mediaState_1.mediaQueryConfig, isMedia, false, priority);
                        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                            (0, log_1.log)("\uD83D\uDCFA media style:", out);
                        }
                        // this is imperfect it should be fixed further down, we mess up property when dealing with
                        // media-sub-style, like $sm={{ $platform-web: {} }}
                        // property is just $platform-web, it should br $platform-web-bg, so we add extra info from style
                        // but that info includes the value too
                        var subKey = isSubStyle ? style[2] : '';
                        var fullKey = "".concat(style[helpers_1.StyleObjectProperty]).concat(subKey).concat(exports.PROP_SPLIT).concat(mediaKeyShort_1).concat(style[helpers_1.StyleObjectPseudo] || '');
                        addStyleToInsertRules(rulesToInsert, out);
                        classNames[fullKey] = out[helpers_1.StyleObjectIdentifier];
                    }
                }
                else {
                    var isThemeMedia = isMedia === 'theme';
                    var isGroupMedia = isMedia === 'group';
                    var isPlatformMedia = isMedia === 'platform';
                    if (!isThemeMedia && !isPlatformMedia && !isGroupMedia) {
                        if (!mediaState[mediaKeyShort_1]) {
                            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                                (0, log_1.log)("  \uD83D\uDCFA \u274C DISABLED ".concat(mediaKeyShort_1));
                            }
                            return;
                        }
                        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                            (0, log_1.log)("  \uD83D\uDCFA \u2705 ENABLED ".concat(mediaKeyShort_1));
                        }
                    }
                    var mediaStyle_1 = (0, exports.getSubStyle)(styleState, key, val, true);
                    var importanceBump_1 = 0;
                    if (isThemeMedia) {
                        if (process.env.TAMAGUI_TARGET === 'native' &&
                            constants_1.isIos &&
                            (0, config_1.getSetting)('fastSchemeChange')) {
                            // iOS will use https://reactnative.dev/docs/dynamiccolorios
                            // so need to predefine the dynamic color before merging the styles
                            // for example: <StyledYStack $theme-dark={{borderColor: '$red10'}} $theme-light={{borderColor: '$green10'}}> => {borderColor: {dynamic: {dark: '$red10', light: '$green10'}}}
                            styleState.style || (styleState.style = {});
                            var scheme = mediaKeyShort_1;
                            var oppositeScheme = (0, getDynamicVal_1.getOppositeScheme)(mediaKeyShort_1);
                            var themeOriginalValues = exports.styleOriginalValues.get(mediaStyle_1);
                            var isCurrentScheme = themeName === scheme || themeName.startsWith(scheme);
                            for (var subKey in mediaStyle_1) {
                                var val_2 = (0, getDynamicVal_1.extractValueFromDynamic)(mediaStyle_1[subKey], scheme);
                                var existing = styleState.style[subKey];
                                // Only color properties support DynamicColorIOS - non-color properties
                                // like opacity, dimensions, etc. will crash if wrapped with {dynamic: {...}}
                                // See: https://github.com/hanzoai/gui/issues/3096
                                // See: https://github.com/hanzoai/gui/issues/2980
                                if (!(0, getDynamicVal_1.isColorStyleKey)(subKey)) {
                                    // non-color properties require re-render to update
                                    dynamicThemeAccess = true;
                                    // only apply if this is the current theme
                                    if (isCurrentScheme) {
                                        // update mediaStyle so the later merge loop uses correct value
                                        mediaStyle_1[subKey] = val_2;
                                    }
                                    else {
                                        // remove from mediaStyle so it doesn't get merged with wrong theme's value
                                        delete mediaStyle_1[subKey];
                                    }
                                    continue;
                                }
                                // if there's already a dynamic object from the other theme pseudo prop,
                                // merge directly to avoid importance conflicts between $theme-dark and $theme-light
                                if (existing === null || existing === void 0 ? void 0 : existing.dynamic) {
                                    existing.dynamic[scheme] = val_2;
                                    mediaStyle_1[subKey] = existing;
                                }
                                else {
                                    var oppositeVal = (0, getDynamicVal_1.extractValueFromDynamic)(existing, oppositeScheme);
                                    mediaStyle_1[subKey] = (0, getDynamicVal_1.getDynamicVal)({
                                        scheme: scheme,
                                        val: val_2,
                                        oppositeVal: oppositeVal,
                                    });
                                    mergeStyle(styleState, subKey, mediaStyle_1[subKey], priority, false, themeOriginalValues === null || themeOriginalValues === void 0 ? void 0 : themeOriginalValues[subKey]);
                                }
                            }
                        }
                        else {
                            // non-ios or no fastschemechange - need re-renders for theme changes
                            dynamicThemeAccess = true;
                            if (!(themeName === mediaKeyShort_1 || themeName.startsWith(mediaKeyShort_1))) {
                                return;
                            }
                        }
                    }
                    else if (isGroupMedia) {
                        var groupInfo = (0, getGroupPropParts_1.getGroupPropParts)(mediaKeyShort_1);
                        var groupName = groupInfo.name;
                        // $group-x
                        var groupState = (_c = groupContext === null || groupContext === void 0 ? void 0 : groupContext[groupName]) === null || _c === void 0 ? void 0 : _c.state;
                        var groupPseudoKey = groupInfo.pseudo;
                        var groupMediaKey = groupInfo.media;
                        if (!groupState) {
                            if (process.env.NODE_ENV === 'development' && debug) {
                                (0, log_1.log)("No parent with group prop, skipping styles: ".concat(groupName));
                            }
                            // we still want to indicate we should listen! this is how subscribeToGroupContext knows to run
                            pseudoGroups || (pseudoGroups = new Set());
                            return;
                        }
                        var componentGroupState = (_d = componentState.group) === null || _d === void 0 ? void 0 : _d[groupName];
                        if (groupMediaKey) {
                            mediaGroups || (mediaGroups = new Set());
                            mediaGroups.add(groupMediaKey);
                            var mediaState_2 = componentGroupState === null || componentGroupState === void 0 ? void 0 : componentGroupState.media;
                            var isActive = mediaState_2 === null || mediaState_2 === void 0 ? void 0 : mediaState_2[groupMediaKey];
                            // use parent styles if width and height hardcoded we can do an inline media match and avoid double render
                            if (!mediaState_2 && groupState.layout) {
                                isActive = (0, useMedia_1.mediaKeyMatch)(groupMediaKey, groupState.layout);
                            }
                            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                                (0, log_1.log)(" \uD83C\uDFD8\uFE0F GROUP media ".concat(groupMediaKey, " active? ").concat(isActive), __assign(__assign({}, mediaState_2), { usedKeys: __assign({}, styleState.usedKeys) }));
                            }
                            if (!isActive) {
                                // ensure we set the defaults so animations work
                                for (var pkey in mediaStyle_1) {
                                    applyDefaultStyle(pkey, styleState);
                                }
                                return;
                            }
                            importanceBump_1 = 2;
                        }
                        if (groupPseudoKey) {
                            pseudoGroups || (pseudoGroups = new Set());
                            pseudoGroups.add(groupName);
                            var componentGroupPseudoState = (_e = (componentGroupState ||
                                (
                                // fallback to context initially
                                groupContext === null || groupContext === void 0 ? void 0 : groupContext[groupName].state))) === null || _e === void 0 ? void 0 : _e.pseudo;
                            var isActive = componentGroupPseudoState === null || componentGroupPseudoState === void 0 ? void 0 : componentGroupPseudoState[groupPseudoKey];
                            var priority_1 = pseudoDescriptors_1.pseudoPriorities[groupPseudoKey];
                            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                                (0, log_1.log)(" \uD83C\uDFD8\uFE0F GROUP pseudo ".concat(groupMediaKey, " active? ").concat(isActive, ", priority ").concat(priority_1), {
                                    componentGroupPseudoState: __assign({}, componentGroupPseudoState),
                                    usedKeys: __assign({}, styleState.usedKeys),
                                });
                            }
                            if (!isActive) {
                                // ensure we set the defaults so animations work
                                for (var pkey in mediaStyle_1) {
                                    applyDefaultStyle(pkey, styleState);
                                }
                                return;
                            }
                            importanceBump_1 = priority_1;
                        }
                    }
                    else if (isPlatformMedia) {
                        // Platform styles use specificity-based importance bumps so that more
                        // specific platform selectors reliably win over broader ones regardless
                        // of prop declaration order (e.g. $platform-tv always overrides
                        // $platform-native for the same property, even if tv is listed first).
                        importanceBump_1 = (0, isActivePlatform_1.getPlatformSpecificityBump)(mediaKeyShort_1);
                    }
                    var mediaOriginalValues = exports.styleOriginalValues.get(mediaStyle_1);
                    // extract transition from group pseudo styles (e.g., $group-scenario4-hover.transition)
                    if (isGroupMedia && mediaStyle_1.transition) {
                        styleState.pseudoTransitions || (styleState.pseudoTransitions = {});
                        styleState.pseudoTransitions["$".concat(mediaKeyShort_1)] = mediaStyle_1.transition;
                    }
                    function mergeMediaStyle(key, val, originalVal) {
                        // on native, non-style keys from media queries (like numberOfLines)
                        // need to go to viewProps, not style
                        if (process.env.TAMAGUI_TARGET === 'native') {
                            if (!isValidStyleKey(key, validStyles, accept)) {
                                viewProps[key] = val;
                                return;
                            }
                        }
                        styleState.style || (styleState.style = {});
                        var didMerge = mergeMediaByImportance(styleState, mediaKeyShort_1, key, val, mediaState[mediaKeyShort_1], importanceBump_1, debug, originalVal);
                        if (didMerge && key === 'fontFamily') {
                            styleState.fontFamily = mediaStyle_1.fontFamily;
                        }
                    }
                    for (var subKey in mediaStyle_1) {
                        if (subKey === 'space') {
                            continue;
                        }
                        if (subKey[0] === '$') {
                            var subMediaType = (0, useMedia_1.getMediaKey)(subKey);
                            if (subMediaType === 'platform') {
                                if (!(0, isActivePlatform_1.isActivePlatform)(subKey))
                                    continue;
                            }
                            else if (subMediaType === 'theme') {
                                if (!(0, isActiveTheme_1.isActiveTheme)(subKey, themeName))
                                    continue;
                            }
                            else if (subMediaType === true) {
                                // regular media query nested inside platform/theme/media
                                var subKeyShort = subKey.slice(1);
                                if (!mediaState[subKeyShort])
                                    continue;
                            }
                            var nestedVal = mediaStyle_1[subKey];
                            var subOriginalValues = exports.styleOriginalValues.get(nestedVal);
                            // Nested styles are more specific than their outer context because
                            // they require both conditions to be true. Calculate an importance
                            // that is the sum of both the outer and inner importances so that:
                            //   1) nested always beats non-nested
                            //   2) $xs={{ $platform-android: ... }} and
                            //      $platform-android={{ $xs: ... }} produce identical importance
                            //      (last-declared wins for the same property)
                            var isSizeMediaKey = !!mediaState[mediaKeyShort_1];
                            var outerBase = isSizeMediaKey
                                ? (0, useMedia_1.getMediaKeyImportance)(mediaKeyShort_1)
                                : pseudoDescriptors_1.defaultMediaImportance;
                            var innerBase = void 0;
                            if (subMediaType === 'platform') {
                                innerBase =
                                    pseudoDescriptors_1.defaultMediaImportance + (0, isActivePlatform_1.getPlatformSpecificityBump)(subKey.slice(1));
                            }
                            else if (subMediaType === true) {
                                innerBase = (0, useMedia_1.getMediaKeyImportance)(subKey.slice(1));
                            }
                            else {
                                innerBase = pseudoDescriptors_1.defaultMediaImportance;
                            }
                            var nestedImportance = outerBase + importanceBump_1 + innerBase + 1;
                            for (var subSubKey in nestedVal) {
                                // expand shorthands — getSubStyle doesn't expand keys
                                // inside nested $ objects (they pass through propMapper as-is)
                                var expandedKey = shorthands[subSubKey] || subSubKey;
                                var usedKeys = styleState.usedKeys;
                                if (usedKeys[expandedKey] && usedKeys[expandedKey] > nestedImportance) {
                                    continue;
                                }
                                styleState.style || (styleState.style = {});
                                mergeStyle(styleState, expandedKey, nestedVal[subSubKey], nestedImportance, false, subOriginalValues === null || subOriginalValues === void 0 ? void 0 : subOriginalValues[subSubKey]);
                                if (expandedKey === 'fontFamily') {
                                    styleState.fontFamily = nestedVal[subSubKey];
                                }
                            }
                        }
                        else {
                            mergeMediaStyle(subKey, mediaStyle_1[subKey], mediaOriginalValues === null || mediaOriginalValues === void 0 ? void 0 : mediaOriginalValues[subKey]);
                        }
                    }
                }
                return; // end media
            }
            // pass to view props
            if (!isVariant) {
                if (isStyledContextProp) {
                    return;
                }
                viewProps[key] = val;
            }
        });
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            try {
                (0, log_1.log)(" \u2714\uFE0F expand complete", keyInit);
                (0, log_1.log)('style', __assign({}, styleState.style));
                (0, log_1.log)('viewProps', __assign({}, viewProps));
                (0, log_1.log)('transforms', __assign({}, styleState.flatTransforms));
            }
            catch (_q) {
                // RN can run into PayloadTooLargeError: request entity too large
            }
            console.groupEnd();
        }
    };
    for (var keyOg in props) {
        _loop_1(keyOg);
    } // end prop loop
    if (process.env.NODE_ENV === 'development' &&
        (debug === 'profile' || globalThis.time)) {
        // @ts-expect-error
        time(templateObject_4 || (templateObject_4 = __makeTemplateObject(["split-styles-propsend"], ["split-styles-propsend"])));
    }
    // style prop after:
    var avoidNormalize = styleProps.noNormalize === false;
    if (!avoidNormalize) {
        if (styleState.style) {
            (0, expandStyles_1.fixStyles)(styleState.style);
            if (!styleProps.noExpand && !styleProps.noMergeStyle) {
                // shouldn't this be better? but breaks some tests weirdly, need to check
                if (constants_1.isWeb && (isReactNative ? (driver === null || driver === void 0 ? void 0 : driver.inputStyle) !== 'css' : true)) {
                    (0, getCSSStylesAtomic_1.styleToCSS)(styleState.style);
                }
            }
        }
        // these are only the flat transforms
        // always do this at the very end to preserve the order strictly (animations, origin)
        // and allow proper merging of all pseudos before applying
        if (styleState.flatTransforms) {
            // we need to match the order for animations to work because it needs consistent order
            // was thinking of having something like `state.prevTransformsOrder = ['y', 'x', ...]
            // but if we just handle it here its not a big cost and avoids having stateful things
            // so the strategy is: always sort by a consistent order, until you run into a "duplicate"
            // because you can have something like:
            //   [{ translateX: 0 }, { scale: 1 }, { translateX: 10 }]
            // so basically we sort until we get to a duplicate... we could sort even smarter but
            // this should work for most (all?) of our cases since the order preservation really only needs to apply
            // to the "flat" transform props
            styleState.style || (styleState.style = {});
            mergeFlatTransforms(styleState.style, styleState.flatTransforms);
        }
        // add in defaults if not set:
        if (parentSplitStyles) {
            if (process.env.TAMAGUI_TARGET === 'web') {
                if (shouldDoClasses) {
                    for (var key in parentSplitStyles.classNames) {
                        var val = parentSplitStyles.classNames[key];
                        if ((styleState.style && key in styleState.style) || key in classNames)
                            continue;
                        classNames[key] = val;
                    }
                }
            }
            if (!shouldDoClasses) {
                for (var key in parentSplitStyles.style) {
                    if (key in classNames || (styleState.style && key in styleState.style))
                        continue;
                    styleState.style || (styleState.style = {});
                    styleState.style[key] = parentSplitStyles.style[key];
                }
            }
        }
    }
    // Button for example uses disableClassName: true but renders to a 'button' element, so needs this
    if (process.env.TAMAGUI_TARGET === 'web') {
        var shouldStringifyTransforms = !styleProps.noNormalize &&
            !staticConfig.isReactNative &&
            !staticConfig.isHOC &&
            (!styleProps.isAnimated || (driver === null || driver === void 0 ? void 0 : driver.inputStyle) === 'css');
        if (shouldStringifyTransforms && Array.isArray((_d = styleState.style) === null || _d === void 0 ? void 0 : _d.transform)) {
            styleState.style.transform = (0, transformsToString_1.transformsToString)(styleState.style.transform);
        }
    }
    if (process.env.TAMAGUI_TARGET === 'web') {
        if (!styleProps.noMergeStyle && styleState.style && shouldDoClasses) {
            var retainedStyles = void 0;
            var shouldRetain = false;
            if (styleState.style['$$css']) {
                // avoid re-processing for rnw
            }
            else {
                var atomic = (0, getCSSStylesAtomic_1.getCSSStylesAtomic)(styleState.style);
                for (var _i = 0, atomic_1 = atomic; _i < atomic_1.length; _i++) {
                    var atomicStyle = atomic_1[_i];
                    var key = atomicStyle[0], value = atomicStyle[1], identifier = atomicStyle[2];
                    var isAnimatedAndTransitionOnly = styleProps.isAnimated &&
                        styleProps.noClass &&
                        ((_e = props.animateOnly) === null || _e === void 0 ? void 0 : _e.includes(key));
                    // animateOnly properties should always use className on server and initial
                    // client render to avoid hydration mismatch (server has isAnimated=false but
                    // client has isAnimated=true for CSS driver, causing different style output)
                    var nonAnimatedTransitionOnly = !isAnimatedAndTransitionOnly &&
                        !styleProps.isAnimated &&
                        constants_1.isClient &&
                        (driver === null || driver === void 0 ? void 0 : driver.outputStyle) === 'css' &&
                        ((_f = props.animateOnly) === null || _f === void 0 ? void 0 : _f.includes(key));
                    if (isAnimatedAndTransitionOnly) {
                        retainedStyles || (retainedStyles = {});
                        retainedStyles[key] = styleState.style[key];
                    }
                    else if (nonAnimatedTransitionOnly) {
                        retainedStyles || (retainedStyles = {});
                        retainedStyles[key] = value;
                        shouldRetain = true;
                    }
                    else {
                        addStyleToInsertRules(rulesToInsert, atomicStyle);
                        classNames[key] = identifier;
                    }
                }
                if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
                    // console.groupEnd() // ensure group ended from loop above
                    console.groupCollapsed("\uD83D\uDD39 getSplitStyles final style object");
                    console.info(styleState.style);
                    console.info("retainedStyles", retainedStyles);
                    console.groupEnd();
                }
                if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {
                    styleState.style = retainedStyles || {};
                }
            }
        }
        // when noClass is true (inline animation driver) extract non-animatable
        // base styles to atomic CSS classNames so the driver doesn't manage them
        // skip for RNW animation drivers since their AnimatedView doesn't forward classNames
        if (!styleProps.noMergeStyle &&
            styleState.style &&
            !shouldDoClasses &&
            styleProps.isAnimated &&
            !(driver === null || driver === void 0 ? void 0 : driver.isReactNative)) {
            if (!styleState.style['$$css']) {
                var toConvert = {};
                var hasProps = false;
                var animateOnly = props.animateOnly;
                for (var key in styleState.style) {
                    if (key in helpers_1.nonAnimatableStyleProps) {
                        toConvert[key] = styleState.style[key];
                        delete styleState.style[key];
                        hasProps = true;
                    }
                }
                if (hasProps) {
                    var atomic = (0, getCSSStylesAtomic_1.getCSSStylesAtomic)(toConvert);
                    for (var _l = 0, atomic_2 = atomic; _l < atomic_2.length; _l++) {
                        var atomicStyle = atomic_2[_l];
                        addStyleToInsertRules(rulesToInsert, atomicStyle);
                        classNames[atomicStyle[helpers_1.StyleObjectProperty]] =
                            atomicStyle[helpers_1.StyleObjectIdentifier];
                    }
                }
            }
        }
    }
    // merge after the prop loop - and always keep it on style dont turn into className except if RN gives us
    var styleProp = props.style;
    if (!styleProps.noMergeStyle && styleProp) {
        if (isHOC) {
            viewProps.style = normalizeStyle(styleProp);
        }
        else {
            var isArray = Array.isArray(styleProp);
            var len = isArray ? styleProp.length : 1;
            for (var i = 0; i < len; i++) {
                var style = isArray ? styleProp[i] : styleProp;
                if (style) {
                    if (style['$$css']) {
                        Object.assign(styleState.classNames, style);
                    }
                    else {
                        styleState.style || (styleState.style = {});
                        Object.assign(styleState.style, normalizeStyle(style));
                    }
                }
            }
        }
    }
    // native: swap out the right family based on weight/style
    if (process.env.TAMAGUI_TARGET === 'native') {
        // set accessible when tabIndex is 0 (issue #3350)
        if (viewProps.tabIndex === 0) {
            (_g = viewProps.accessible) !== null && _g !== void 0 ? _g : (viewProps.accessible = true);
        }
        var style = styleState.style;
        if (style === null || style === void 0 ? void 0 : style.fontFamily) {
            var faceInfo = (_h = (0, config_1.getFont)(style.fontFamily)) === null || _h === void 0 ? void 0 : _h.face;
            if (faceInfo) {
                var overrideFace = (_k = (_j = faceInfo[style.fontWeight]) === null || _j === void 0 ? void 0 : _j[style.fontStyle || 'normal']) === null || _k === void 0 ? void 0 : _k.val;
                if (overrideFace) {
                    style.fontFamily = overrideFace;
                    styleState.fontFamily = overrideFace;
                    // If we pass both font family (e.g. InterBold) and a font weight (e.g. 900), android gets confused and just shows the default font, so we remove these:
                    delete style.fontWeight;
                    delete style.fontStyle;
                }
            }
            if (process.env.NODE_ENV === 'development' && debug && debug !== 'profile') {
                (0, log_1.log)("Found fontFamily native: ".concat(style.fontFamily), faceInfo);
            }
        }
    }
    if (process.env.NODE_ENV === 'development' &&
        (debug === 'profile' || globalThis.time)) {
        // @ts-expect-error
        time(templateObject_5 || (templateObject_5 = __makeTemplateObject(["split-styles-pre-result"], ["split-styles-pre-result"])));
    }
    var result = {
        hasMedia: hasMedia,
        fontFamily: styleState.fontFamily,
        viewProps: viewProps,
        style: styleState.style,
        pseudos: pseudos,
        classNames: classNames,
        rulesToInsert: rulesToInsert,
        dynamicThemeAccess: dynamicThemeAccess,
        pseudoGroups: pseudoGroups,
        mediaGroups: mediaGroups,
        overriddenContextProps: styleState.overriddenContextProps,
        pseudoTransitions: styleState.pseudoTransitions,
    };
    var asChildExceptStyleLike = asChild === 'except-style' || asChild === 'except-style-web';
    if (!styleProps.noMergeStyle) {
        if (!asChildExceptStyleLike) {
            var style = styleState.style;
            if (process.env.TAMAGUI_TARGET === 'web') {
                // merge className and style back into viewProps:
                // only emit font class if fontFamily was explicitly in props (not from defaults)
                var fontFamily = isText || isInput ? styleState.fontFamily : null;
                if (fontFamily && fontFamily[0] === '$') {
                    fontFamily = fontFamily.slice(1);
                }
                var fontFamilyClassName = fontFamily ? "font_".concat(fontFamily) : '';
                var groupClassName = props.group ? "t_group_".concat(props.group) : '';
                var componentNameFinal = props.componentName || staticConfig.componentName;
                var componentNameClassName = props.asChild || !componentNameFinal || componentNameFinal === 'Text'
                    ? ''
                    : "is_".concat(componentNameFinal);
                var classList = [];
                if (componentNameClassName)
                    classList.push(componentNameClassName);
                // is_View gets base flex styles + font reset, is_Text gets base text styles
                if (!isText)
                    classList.push('is_View');
                else
                    classList.push('is_Text');
                if (fontFamilyClassName)
                    classList.push(fontFamilyClassName);
                if (classNames)
                    classList.push(Object.values(classNames).join(' '));
                if (groupClassName)
                    classList.push(groupClassName);
                if (props.className)
                    classList.push(props.className);
                var finalClassName = classList.join(' ');
                // use $$css for RNW components OR when animated with RNW driver
                // (driver's AnimatedView doesn't forward className)
                var needsCssStyles = isReactNative || (styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.isReactNative));
                if (styleProps.isAnimated && (driver === null || driver === void 0 ? void 0 : driver.inputStyle) === 'css') {
                    // CSS animation driver uses className directly
                    viewProps.className = finalClassName;
                    if (style) {
                        viewProps.style = style;
                    }
                }
                else if (needsCssStyles) {
                    // RNW or RNW-animated: apply classNames via $$css
                    var cnStyles = void 0;
                    for (var _m = 0, _o = finalClassName.split(' '); _m < _o.length; _m++) {
                        var name_2 = _o[_m];
                        cnStyles || (cnStyles = { $$css: true });
                        cnStyles[name_2] = name_2;
                    }
                    viewProps.style = cnStyles
                        ? __spreadArray(__spreadArray([], (Array.isArray(style) ? style : [style]), true), [cnStyles], false) : [style];
                }
                else {
                    // regular web: use className directly
                    if (finalClassName) {
                        viewProps.className = finalClassName;
                    }
                    if (style) {
                        viewProps.style = style;
                    }
                }
            }
            else {
                if (style) {
                    // native assign styles
                    viewProps.style = style;
                }
            }
        }
    }
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        if (constants_1.isClient && isDevTools_1.isDevTools) {
            // end collapsed log above
            console.groupEnd();
            console.groupCollapsed('🔹 getSplitStyles ===>');
            try {
                // prettier-ignore
                var logs = __assign(__assign({}, result), { className: className, componentState: componentState, viewProps: viewProps, rulesToInsert: rulesToInsert, parentSplitStyles: parentSplitStyles });
                for (var key in logs) {
                    (0, log_1.log)(key, logs[key]);
                }
            }
            catch (_p) {
                // RN can run into PayloadTooLargeError: request entity too large
            }
            console.groupEnd();
        }
    }
    if (process.env.NODE_ENV === 'development' &&
        (debug === 'profile' || globalThis.time)) {
        // @ts-expect-error
        time(templateObject_6 || (templateObject_6 = __makeTemplateObject(["split-styles-done"], ["split-styles-done"])));
    }
    return result;
};
exports.getSplitStyles = getSplitStyles;
function mergeFlatTransforms(target, flatTransforms) {
    Object.entries(flatTransforms)
        .sort(function (_a, _b) {
        var a = _a[0];
        var b = _b[0];
        return (0, sortString_1.sortString)(a, b);
    })
        .forEach(function (_a) {
        var key = _a[0], val = _a[1];
        mergeTransform(target, key, val, true);
    });
}
function mergeStyle(styleState, key, val, importance, disableNormalize, originalVal) {
    var _a, _b, _c, _d, _e;
    if (disableNormalize === void 0) { disableNormalize = false; }
    var viewProps = styleState.viewProps, styleProps = styleState.styleProps, staticConfig = styleState.staticConfig, usedKeys = styleState.usedKeys;
    var existingImportance = usedKeys[key] || 0;
    if (existingImportance > importance) {
        return;
    }
    // Track context overrides for pseudo/media styles (issues #3670, #3676)
    // When a style sets a key that's in context props, update overriddenContextProps
    // so it propagates to children. Use the original token value (like '$8')
    // instead of the resolved CSS variable (like 'var(--t-space-8)')
    // so children's functional variants can look up token values.
    var contextProps = ((_a = staticConfig.context) === null || _a === void 0 ? void 0 : _a.props) || ((_c = (_b = staticConfig.parentStaticConfig) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.props);
    if (contextProps && key in contextProps) {
        styleState.overriddenContextProps || (styleState.overriddenContextProps = {});
        // Priority: 1) originalVal from propMapper, 2) tracked original from variant resolution, 3) val
        var originalFromState = (_d = styleState.originalContextPropValues) === null || _d === void 0 ? void 0 : _d[key];
        styleState.overriddenContextProps[key] = (_e = originalVal !== null && originalVal !== void 0 ? originalVal : originalFromState) !== null && _e !== void 0 ? _e : val;
    }
    if (key in helpers_1.stylePropsTransform) {
        styleState.flatTransforms || (styleState.flatTransforms = {});
        usedKeys[key] = importance;
        styleState.flatTransforms[key] = val;
    }
    else {
        var shouldNormalize = constants_1.isWeb && !disableNormalize && !styleProps.noNormalize;
        var out = shouldNormalize ? (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(val, key) : val;
        if (
        // accept is for props not styles
        staticConfig.accept &&
            key in staticConfig.accept) {
            viewProps[key] = out;
        }
        else {
            styleState.style || (styleState.style = {});
            usedKeys[key] = importance;
            styleState.style[key] =
                // if you dont do this you'll be passing props.transform arrays directly here and then mutating them
                // if theres any flatTransforms later, causing issues (mutating props is bad, in strict mode styles get borked)
                key === 'transform' && Array.isArray(out) ? __spreadArray([], out, true) : out;
        }
    }
}
var getSubStyle = function (styleState, subKey, styleIn, avoidMergeTransform) {
    var _a, _b, _c;
    var staticConfig = styleState.staticConfig, conf = styleState.conf, styleProps = styleState.styleProps;
    var styleOut = {};
    var originalValues;
    var _loop_2 = function (key) {
        var val = styleIn[key];
        key = conf.shorthands[key] || key;
        // extract transition from pseudo-style props (e.g., hoverStyle.transition)
        // store it separately for animation drivers to use for enter/exit timing
        if (key === 'transition') {
            styleState.pseudoTransitions || (styleState.pseudoTransitions = {});
            styleState.pseudoTransitions[subKey] =
                val;
            // for CSS driver, also add transition to CSS output so native CSS transitions work
            // group styles ($group-*) need !important to override inline base transition
            var driver = styleState.animationDriver;
            if ((driver === null || driver === void 0 ? void 0 : driver.outputStyle) === 'css') {
                var animationConfig = (_a = driver.animations) === null || _a === void 0 ? void 0 : _a[val];
                if (animationConfig) {
                    var important = subKey[0] === '$' ? ' !important' : '';
                    styleOut['transition'] = "all ".concat(animationConfig).concat(important);
                }
            }
            // not a known animation name, pass through as raw CSS
            if (!styleOut['transition'] &&
                typeof val === 'string' &&
                !((_b = driver === null || driver === void 0 ? void 0 : driver.animations) === null || _b === void 0 ? void 0 : _b[val])) {
                styleOut['transition'] = val;
            }
            return "continue";
        }
        var shouldSkip = !staticConfig.isHOC && key in skipProps_1.skipProps && !styleProps.noSkip;
        if (shouldSkip) {
            return "continue";
        }
        (0, propMapper_1.propMapper)(key, val, styleState, false, function (skey, sval, originalVal) {
            // Track original values for context prop propagation
            if (originalVal !== undefined) {
                originalValues || (originalValues = {});
                originalValues[skey] = originalVal;
            }
            // pseudo inside media
            if (skey in helpers_1.validPseudoKeys) {
                sval = (0, exports.getSubStyle)(styleState, skey, sval, avoidMergeTransform);
            }
            if (!avoidMergeTransform && skey in helpers_1.stylePropsTransform) {
                mergeTransform(styleOut, skey, sval);
            }
            else {
                styleOut[skey] = styleProps.noNormalize
                    ? sval
                    : (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(sval, key);
            }
        });
    };
    for (var key in styleIn) {
        _loop_2(key);
    }
    if (!avoidMergeTransform) {
        var parentTransform = (_c = styleState.style) === null || _c === void 0 ? void 0 : _c.transform;
        var flatTransforms = styleState.flatTransforms;
        var styleOutTransform = styleOut.transform;
        if (Array.isArray(styleOutTransform) && styleOutTransform.length) {
            // Inline conflict check - faster than building lookup object for small arrays
            var len = styleOutTransform.length;
            if (Array.isArray(parentTransform)) {
                var merged = [];
                outer: for (var i = 0; i < parentTransform.length; i++) {
                    var pt = parentTransform[i];
                    for (var pk in pt) {
                        for (var j = 0; j < len; j++) {
                            for (var sk in styleOutTransform[j]) {
                                if (pk === sk)
                                    continue outer;
                                break;
                            }
                        }
                        merged.push(pt);
                        break;
                    }
                }
                for (var i = 0; i < len; i++)
                    merged.push(styleOutTransform[i]);
                styleOut.transform = merged;
            }
            if (flatTransforms) {
                outer: for (var fk in flatTransforms) {
                    var ck = fk === 'x' ? 'translateX' : fk === 'y' ? 'translateY' : fk;
                    for (var j = 0; j < len; j++) {
                        for (var sk in styleOutTransform[j]) {
                            if (ck === sk)
                                continue outer;
                            break;
                        }
                    }
                    mergeTransform(styleOut, fk, flatTransforms[fk]);
                }
            }
        }
        else if (flatTransforms) {
            mergeFlatTransforms(styleOut, flatTransforms);
        }
    }
    if (!styleProps.noNormalize) {
        (0, expandStyles_1.fixStyles)(styleOut);
    }
    // Store original values in WeakMap instead of on the object itself
    if (originalValues) {
        exports.styleOriginalValues.set(styleOut, originalValues);
    }
    return styleOut;
};
exports.getSubStyle = getSubStyle;
// on native no need to insert any css
var useInsertEffectCompat = constants_1.isWeb
    ? react_1.default.useInsertionEffect || constants_1.useIsomorphicLayoutEffect
    : function () { };
// perf: ...args a bit expensive on native
var useSplitStyles = function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
    'use no memo';
    var res = (0, exports.getSplitStyles)(a, b, c, d, e, f, g, h, i, j, k, l, m);
    if (process.env.TAMAGUI_TARGET !== 'native') {
        useInsertEffectCompat(function () {
            if (res) {
                (0, insertStyleRule_1.insertStyleRules)(res.rulesToInsert);
            }
        }, [res === null || res === void 0 ? void 0 : res.rulesToInsert]);
    }
    return res;
};
exports.useSplitStyles = useSplitStyles;
function addStyleToInsertRules(rulesToInsert, styleObject) {
    if (process.env.TAMAGUI_TARGET === 'web') {
        var identifier = styleObject[helpers_1.StyleObjectIdentifier];
        if ((0, insertStyleRule_1.shouldInsertStyleRules)(identifier)) {
            (0, insertStyleRule_1.updateRules)(identifier, styleObject[helpers_1.StyleObjectRules]);
            rulesToInsert[identifier] = styleObject;
        }
    }
}
var defaultColor = process.env.TAMAGUI_DEFAULT_COLOR || 'rgba(0,0,0,0)';
var animatableDefaults = __assign(__assign({}, Object.fromEntries(Object.entries(helpers_1.tokenCategories.color).map(function (_a) {
    var k = _a[0], v = _a[1];
    return [k, defaultColor];
}))), { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, rotate: '0deg', rotateX: '0deg', rotateY: '0deg', rotateZ: '0deg', skewX: '0deg', skewY: '0deg', x: 0, y: 0, borderRadius: 0 });
var mergeTransform = function (obj, key, val, backwards) {
    var _a;
    if (backwards === void 0) { backwards = false; }
    if (typeof obj.transform === 'string') {
        return;
    }
    obj.transform || (obj.transform = []);
    obj.transform[backwards ? 'unshift' : 'push']((_a = {},
        _a[mapTransformKeys[key] || key] = val,
        _a));
};
var mapTransformKeys = {
    x: 'translateX',
    y: 'translateY',
};
function passDownProp(viewProps, key, val, shouldMergeObject) {
    if (shouldMergeObject === void 0) { shouldMergeObject = false; }
    if (shouldMergeObject) {
        var next = __assign(__assign({}, viewProps[key]), val);
        // need to re-insert it at current position
        delete viewProps[key];
        viewProps[key] = next;
    }
    else {
        viewProps[key] = val;
    }
}
function mergeMediaByImportance(styleState, mediaKey, key, value, isSizeMedia, importanceBump, debugProp, originalVal) {
    var usedKeys = styleState.usedKeys;
    var importance = (0, useMedia_1.getMediaImportanceIfMoreImportant)(mediaKey, key, styleState, isSizeMedia);
    if (importanceBump) {
        // With a specificity bump, the effective importance is always
        // defaultMediaImportance + bump. This lets higher-specificity styles
        // (e.g. $platform-tv > $platform-native) override lower-specificity ones
        // regardless of prop declaration order, even when getMediaImportanceIfMoreImportant
        // returns null (meaning the same base importance was already applied).
        //
        // We must re-check `usedKeys[key]` here (rather than relying on the null
        // returned by getMediaImportanceIfMoreImportant) because that function only
        // compares against `defaultMediaImportance`, which equals our base before
        // the bump. We need to compare against the *bumped* value to correctly
        // allow a more-specific style to win.
        var bumpedImportance = pseudoDescriptors_1.defaultMediaImportance + importanceBump;
        importance =
            !usedKeys[key] || bumpedImportance > usedKeys[key] ? bumpedImportance : null;
    }
    if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
        (0, log_1.log)("mergeMediaByImportance ".concat(key, " importance usedKey ").concat(usedKeys[key], " next ").concat(importance));
    }
    if (importance === null) {
        return false;
    }
    if (key in pseudoDescriptors_1.pseudoDescriptors) {
        var descriptor = pseudoDescriptors_1.pseudoDescriptors[key];
        var descriptorKey = descriptor.stateKey || descriptor.name;
        var isDisabled = styleState.componentState[descriptorKey] === false;
        if (isDisabled) {
            return false;
        }
        // For pseudo inside media, value is an object with subkeys
        var pseudoOriginalValues = exports.styleOriginalValues.get(value);
        for (var subKey in value) {
            mergeStyle(styleState, subKey, value[subKey], importance, false, pseudoOriginalValues === null || pseudoOriginalValues === void 0 ? void 0 : pseudoOriginalValues[subKey]);
        }
    }
    else {
        mergeStyle(styleState, key, value, importance, false, originalVal);
    }
    return true;
}
function normalizeStyle(style) {
    var out = {};
    for (var key in style) {
        var val = style[key];
        if (key in helpers_1.stylePropsTransform) {
            mergeTransform(out, key, val);
        }
        else {
            out[key] = (0, normalizeValueWithProperty_1.normalizeValueWithProperty)(val, key);
        }
    }
    if (constants_1.isWeb && Array.isArray(out.transform)) {
        out.transform = (0, transformsToString_1.transformsToString)(out.transform);
    }
    (0, expandStyles_1.fixStyles)(out);
    return out;
}
function applyDefaultStyle(pkey, styleState) {
    var defaultValues = animatableDefaults[pkey];
    if (defaultValues != null &&
        !(pkey in styleState.usedKeys) &&
        (!styleState.style || !(pkey in styleState.style))) {
        mergeStyle(styleState, pkey, defaultValues, 1);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
