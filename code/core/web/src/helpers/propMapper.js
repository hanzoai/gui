"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propMapper = exports.getTokenForKey = void 0;
exports.getFontFamilyFromNameOrVariable = getFontFamilyFromNameOrVariable;
var constants_1 = require("@hanzogui/constants");
var createVariable_1 = require("../createVariable");
var expandStyle_1 = require("./expandStyle");
var getTokenForKey_1 = require("./getTokenForKey");
var getVariantExtras_1 = require("./getVariantExtras");
var isObj_1 = require("./isObj");
var normalizeStyle_1 = require("./normalizeStyle");
var parseNativeStyle_1 = require("./parseNativeStyle");
var pseudoDescriptors_1 = require("./pseudoDescriptors");
var resolveCompoundTokens_1 = require("./resolveCompoundTokens");
var resolveRem_1 = require("./resolveRem");
var skipProps_1 = require("./skipProps");
var getTokenForKey_2 = require("./getTokenForKey");
Object.defineProperty(exports, "getTokenForKey", { enumerable: true, get: function () { return getTokenForKey_2.getTokenForKey; } });
var propMapper = function (key, value, styleState, disabled, map) {
    if (disabled) {
        return map(key, value);
    }
    (0, getTokenForKey_1.setLastFontFamilyToken)(null);
    if (!(process.env.TAMAGUI_TARGET === 'native' && constants_1.isAndroid)) {
        // this shouldnt be necessary and handled in the outer loop
        if (key === 'elevationAndroid')
            return;
    }
    var conf = styleState.conf, styleProps = styleState.styleProps, staticConfig = styleState.staticConfig;
    var variants = staticConfig.variants;
    if (!styleProps.noExpand) {
        if (variants && key in variants) {
            var variantValue = resolveVariants(key, value, styleProps, styleState, '');
            if (variantValue) {
                variantValue.forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    return map(key, value);
                });
                return;
            }
        }
    }
    // handle shorthands
    if (!styleProps.disableExpandShorthands) {
        if (key in conf.shorthands) {
            key = conf.shorthands[key];
        }
    }
    // Capture original value before resolution (for context prop tracking)
    var originalValue = value;
    if (value != null) {
        if (typeof value === 'string') {
            if (value[0] === '$') {
                value = (0, getTokenForKey_1.getTokenForKey)(key, value, styleProps, styleState);
            }
            else {
                var resolved = (0, resolveCompoundTokens_1.resolveCompoundTokens)(key, value, styleProps, styleState);
                value =
                    resolved !== value ? resolved : (0, resolveRem_1.isRemValue)(value) ? (0, resolveRem_1.resolveRem)(value) : value;
            }
        }
        else if ((0, createVariable_1.isVariable)(value)) {
            value = (0, getTokenForKey_1.resolveVariableValue)(key, value, styleProps.resolveValues);
        }
        else if ((0, resolveRem_1.isRemValue)(value)) {
            value = (0, resolveRem_1.resolveRem)(value);
        }
    }
    // on native, parse string backgroundImage/boxShadow/textShadow to RN object format
    // this handles both token-resolved strings and plain strings without tokens
    if (process.env.TAMAGUI_TARGET === 'native' &&
        value != null &&
        typeof value === 'string' &&
        (key === 'backgroundImage' || key === 'boxShadow' || key === 'textShadow')) {
        var parsed = (0, parseNativeStyle_1.parseNativeStyle)(key, value);
        if (parsed) {
            // textShadow returns [key, value] pairs to expand into separate properties
            if (key === 'textShadow' && Array.isArray(parsed) && Array.isArray(parsed[0])) {
                for (var _i = 0, parsed_1 = parsed; _i < parsed_1.length; _i++) {
                    var _a = parsed_1[_i], nkey = _a[0], nvalue = _a[1];
                    map(nkey, nvalue, originalValue);
                }
                return;
            }
            value = parsed;
        }
    }
    if (value != null) {
        var fontToken = (0, getTokenForKey_1.getLastFontFamilyToken)();
        if (key === 'fontFamily' && fontToken) {
            styleState.fontFamily = fontToken;
        }
        var expanded = styleProps.noExpand ? null : (0, expandStyle_1.expandStyle)(key, value);
        if (expanded) {
            var max = expanded.length;
            for (var i = 0; i < max; i++) {
                var _b = expanded[i], nkey = _b[0], nvalue = _b[1];
                map(nkey, nvalue, originalValue);
            }
        }
        else {
            map(key, value, originalValue);
        }
    }
};
exports.propMapper = propMapper;
var resolveVariants = function (key, value, styleProps, styleState, parentVariantKey) {
    var staticConfig = styleState.staticConfig, conf = styleState.conf, debug = styleState.debug;
    var variants = staticConfig.variants;
    if (!variants)
        return;
    var variantValue = getVariantDefinition(variants[key], value, conf, styleState);
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupCollapsed("\u2666\uFE0F\u2666\uFE0F\u2666\uFE0F resolve variant ".concat(key));
        console.info({
            key: key,
            value: value,
            variantValue: variantValue,
            variants: variants,
        });
        console.groupEnd();
    }
    if (!variantValue) {
        // variant at key exists, but no matching variant
        // disabling warnings, its fine to pass through, could re-enable later somehoiw
        if (process.env.TAMAGUI_WARN_ON_MISSING_VARIANT === '1') {
            // don't warn on missing booleans
            if (typeof value !== 'boolean') {
                var name_1 = staticConfig.componentName || '[UnnamedComponent]';
                console.warn("No variant found: ".concat(name_1, " has variant \"").concat(key, "\", but no matching value \"").concat(value, "\""));
            }
        }
        return;
    }
    if (typeof variantValue === 'function') {
        var fn = variantValue;
        var extras = (0, getVariantExtras_1.getVariantExtras)(styleState);
        variantValue = fn(value, extras);
        if (process.env.NODE_ENV === 'development' &&
            debug === 'verbose' &&
            process.env.TAMAGUI_TARGET !== 'native') {
            console.groupCollapsed('   expanded functional variant', key);
            console.info({ fn: fn, variantValue: variantValue, extras: extras });
            console.groupEnd();
        }
    }
    var fontFamilyResult;
    if ((0, isObj_1.isObj)(variantValue)) {
        var fontFamilyUpdate = variantValue.fontFamily || variantValue[conf.inverseShorthands.fontFamily];
        if (fontFamilyUpdate) {
            fontFamilyResult = getFontFamilyFromNameOrVariable(fontFamilyUpdate, conf);
            styleState.fontFamily = fontFamilyResult;
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                console.info("   updating font family", fontFamilyResult);
            }
        }
        variantValue = resolveTokensAndVariants(key, variantValue, styleProps, styleState, parentVariantKey);
    }
    if (variantValue) {
        var expanded = (0, normalizeStyle_1.normalizeStyle)(variantValue, !!styleProps.noNormalize);
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            console.info("   expanding styles from ", variantValue, "to", expanded);
        }
        var next = Object.entries(expanded);
        // store any changed font family (only support variables for now)
        if (fontFamilyResult && fontFamilyResult[0] === '$') {
            (0, getTokenForKey_1.setLastFontFamilyToken)((0, createVariable_1.getVariableValue)(fontFamilyResult));
        }
        return next;
    }
};
// handles finding and resolving the fontFamily to the token name
// this is used as `font_[name]` in className for nice css variable support
function getFontFamilyFromNameOrVariable(input, conf) {
    if ((0, createVariable_1.isVariable)(input)) {
        var val = variableToFontNameCache.get(input);
        if (val)
            return val;
        for (var key in conf.fontsParsed) {
            var familyVariable = conf.fontsParsed[key].family;
            if ((0, createVariable_1.isVariable)(familyVariable)) {
                variableToFontNameCache.set(familyVariable, key);
                if (familyVariable === input) {
                    return key;
                }
            }
        }
    }
    else if (typeof input === 'string') {
        if (input[0] === '$') {
            return input;
        }
    }
}
var variableToFontNameCache = new WeakMap();
var resolveTokensAndVariants = function (key, // we dont use key assume value is object instead
value, styleProps, styleState, parentVariantKey) {
    var _a, _b, _c, _d, _e, _f;
    var conf = styleState.conf, staticConfig = styleState.staticConfig, debug = styleState.debug, theme = styleState.theme;
    var variants = staticConfig.variants;
    var res = {};
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info("   - resolveTokensAndVariants", key, value);
    }
    for (var _key in value) {
        var subKey = conf.shorthands[_key] || _key;
        var val = value[_key];
        if (!styleProps.noSkip && subKey in skipProps_1.skipProps) {
            continue;
        }
        // Track context overrides for any key that's in context props (issues #3670, #3676)
        // Store the ORIGINAL token value (like '$8') before resolution so that
        // children's functional variants can look up token values
        if (staticConfig) {
            var contextProps = ((_a = staticConfig.context) === null || _a === void 0 ? void 0 : _a.props) || ((_c = (_b = staticConfig.parentStaticConfig) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.props);
            if (contextProps && subKey in contextProps) {
                styleState.overriddenContextProps || (styleState.overriddenContextProps = {});
                styleState.overriddenContextProps[subKey] = val;
                // Also track the original token value separately
                styleState.originalContextPropValues || (styleState.originalContextPropValues = {});
                styleState.originalContextPropValues[subKey] = val;
            }
        }
        if (styleProps.noExpand) {
            res[subKey] = val;
        }
        else {
            if (variants && subKey in variants) {
                // avoids infinite loop if variant is matching a style prop
                // eg: { variants: { flex: { true: { flex: 2 } } } }
                if (parentVariantKey && parentVariantKey === key) {
                    res[subKey] =
                        val[0] === '$' ? (0, getTokenForKey_1.getTokenForKey)(subKey, val, styleProps, styleState) : val;
                }
                else {
                    var variantOut = resolveVariants(subKey, val, styleProps, styleState, key);
                    // apply, merging sub-styles
                    if (variantOut) {
                        for (var _i = 0, variantOut_1 = variantOut; _i < variantOut_1.length; _i++) {
                            var _g = variantOut_1[_i], key_1 = _g[0], val_1 = _g[1];
                            if (val_1 == null)
                                continue;
                            if (key_1 in pseudoDescriptors_1.pseudoDescriptors) {
                                (_d = res[key_1]) !== null && _d !== void 0 ? _d : (res[key_1] = {});
                                Object.assign(res[key_1], val_1);
                            }
                            else {
                                res[key_1] = val_1;
                            }
                        }
                    }
                }
                continue;
            }
        }
        if ((0, createVariable_1.isVariable)(val)) {
            res[subKey] = (0, getTokenForKey_1.resolveVariableValue)(subKey, val, styleProps.resolveValues);
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                console.info("variable", subKey, res[subKey]);
            }
            continue;
        }
        if (typeof val === 'string') {
            var fVal = val[0] === '$'
                ? (0, getTokenForKey_1.getTokenForKey)(subKey, val, styleProps, styleState)
                : (0, resolveCompoundTokens_1.resolveCompoundTokens)(subKey, val, styleProps, styleState);
            res[subKey] = fVal === val && (0, resolveRem_1.isRemValue)(val) ? (0, resolveRem_1.resolveRem)(val) : fVal;
            continue;
        }
        if ((0, isObj_1.isObj)(val)) {
            var subObject = resolveTokensAndVariants(subKey, val, styleProps, styleState, key);
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                console.info("object", subKey, subObject);
            }
            // sub-objects: media queries, pseudos, shadowOffset
            (_e = res[subKey]) !== null && _e !== void 0 ? _e : (res[subKey] = {});
            Object.assign(res[subKey], subObject);
        }
        else {
            // nullish values cant be tokens, need no extra parsing
            res[subKey] = val;
        }
        if (process.env.NODE_ENV === 'development') {
            if (debug) {
                if (((_f = res[subKey]) === null || _f === void 0 ? void 0 : _f[0]) === '$') {
                    console.warn("\u26A0\uFE0F Missing token in theme ".concat(theme.name, ":"), subKey, res[subKey], theme);
                }
            }
        }
    }
    return res;
};
var tokenCats = ['size', 'color', 'radius', 'space', 'zIndex'].map(function (name) { return ({
    name: name,
    spreadName: "...".concat(name),
}); });
// goes through specificity finding best matching variant function
function getVariantDefinition(variant, value, conf, _a) {
    var theme = _a.theme;
    if (!variant)
        return;
    if (typeof variant === 'function') {
        return variant;
    }
    var exact = variant[value];
    if (exact) {
        return exact;
    }
    if (value != null) {
        var tokensParsed = conf.tokensParsed;
        for (var _i = 0, tokenCats_1 = tokenCats; _i < tokenCats_1.length; _i++) {
            var _b = tokenCats_1[_i], name_2 = _b.name, spreadName = _b.spreadName;
            if (spreadName in variant) {
                // check tokens first
                if (name_2 in tokensParsed && value in tokensParsed[name_2]) {
                    return variant[spreadName];
                }
                // or check theme (only color lives in theme, others are in tokens)
                if (name_2 === 'color' && theme && typeof value === 'string' && value[0] === '$') {
                    var themeKey = value.slice(1);
                    if (themeKey in theme) {
                        return variant[spreadName];
                    }
                }
            }
        }
        var fontSizeVariant = variant['...fontSize'];
        if (fontSizeVariant && conf.fontSizeTokens.has(value)) {
            return fontSizeVariant;
        }
    }
    // fallback to catch all | size
    return variant[":".concat(typeof value)] || variant['...'];
}
