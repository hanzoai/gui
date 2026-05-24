"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenForKey = void 0;
exports.getLastFontFamilyToken = getLastFontFamilyToken;
exports.setLastFontFamilyToken = setLastFontFamilyToken;
exports.resolveVariableValue = resolveVariableValue;
var helpers_1 = require("@hanzogui/helpers");
var config_1 = require("../config");
var createVariable_1 = require("../createVariable");
var getVariantExtras_1 = require("./getVariantExtras");
var normalizeColor_1 = require("./normalizeColor");
var fontShorthand = {
    fontSize: 'size',
    fontWeight: 'weight',
};
var didLogMissingToken = false;
var colorKeys = helpers_1.tokenCategories.color;
// flat reverse-lookup: tokenCategoryByKey[propName] → category name.
// replaces an O(categories) for-in scan at the hot path below that
// iterates every category on every `$token` prop resolve. a sootsim
// scroll profile of Uniswap spent material worker CPU walking five
// categories per prop per render — one `key in tokenCategoryByKey`
// lookup collapses that to O(1). tokenCategories is module-constant so
// it's safe to flatten once at module init.
var tokenCategoryByKey = {};
for (var _cat in helpers_1.tokenCategories) {
    for (var _k in helpers_1.tokenCategories[_cat]) {
        tokenCategoryByKey[_k] = _cat;
    }
}
// mutable state for font family tracking across propMapper
var _lastFontFamilyToken = null;
function getLastFontFamilyToken() {
    return _lastFontFamilyToken;
}
function setLastFontFamilyToken(value) {
    _lastFontFamilyToken = value;
}
var getTokenForKey = function (key, value, styleProps, styleState) {
    var _a, _b, _c, _d, _e, _f;
    var resolveAs = styleProps.resolveValues || 'none';
    if (resolveAs === 'none') {
        return value;
    }
    // parse opacity modifier: $token/50 → base token + 50% opacity
    // only for color-related style properties
    var opacityModifier;
    if (key in colorKeys) {
        var slashIdx = value.indexOf('/');
        if (slashIdx > 0) {
            var raw = value.slice(slashIdx + 1);
            // reject empty string after slash ($color/) to avoid Number("") === 0
            if (raw.length > 0) {
                var num = Number(raw);
                if (!Number.isNaN(num)) {
                    opacityModifier = Math.max(0, Math.min(1, num / 100));
                    value = value.slice(0, slashIdx);
                }
            }
        }
    }
    var theme = styleState.theme, _g = styleState.conf, conf = _g === void 0 ? (0, config_1.getConfig)() : _g, context = styleState.context, fontFamily = styleState.fontFamily, staticConfig = styleState.staticConfig;
    var themeValue = theme ? theme[value] || theme[value.slice(1)] : undefined;
    var tokensParsed = conf.tokensParsed;
    var valOrVar;
    var hasSet = false;
    var customTokenAccept = (_a = staticConfig === null || staticConfig === void 0 ? void 0 : staticConfig.accept) === null || _a === void 0 ? void 0 : _a[key];
    if (customTokenAccept) {
        var val = themeValue !== null && themeValue !== void 0 ? themeValue : (_b = tokensParsed[customTokenAccept]) === null || _b === void 0 ? void 0 : _b[value];
        if (val != null) {
            resolveAs = 'value'; // always resolve custom tokens as values
            valOrVar = val;
            hasSet = true;
        }
    }
    if (themeValue) {
        if (resolveAs === 'except-theme') {
            return value;
        }
        valOrVar = themeValue;
        if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
            globalThis.hanzoguiAvoidTracking = true;
            console.info(" - resolving ".concat(key, " to theme value ").concat(value, " resolveAs ").concat(resolveAs), valOrVar);
            globalThis.hanzoguiAvoidTracking = false;
        }
        hasSet = true;
    }
    else {
        if (value in conf.specificTokens) {
            hasSet = true;
            valOrVar = conf.specificTokens[value];
        }
        else {
            switch (key) {
                case 'fontFamily': {
                    var fontsParsed = (context === null || context === void 0 ? void 0 : context.language)
                        ? (0, getVariantExtras_1.getFontsForLanguage)(conf.fontsParsed, context.language)
                        : conf.fontsParsed;
                    valOrVar = ((_c = fontsParsed[value]) === null || _c === void 0 ? void 0 : _c.family) || value;
                    setLastFontFamilyToken(value);
                    hasSet = true;
                    break;
                }
                case 'fontSize':
                case 'lineHeight':
                case 'letterSpacing':
                case 'fontWeight': {
                    var fam = fontFamily || conf.defaultFontToken;
                    if (fam) {
                        var fontsParsed = (context === null || context === void 0 ? void 0 : context.language)
                            ? (0, getVariantExtras_1.getFontsForLanguage)(conf.fontsParsed, context.language)
                            : conf.fontsParsed;
                        var font = fontsParsed[fam] || fontsParsed[conf.defaultFontToken];
                        valOrVar = ((_d = font === null || font === void 0 ? void 0 : font[fontShorthand[key] || key]) === null || _d === void 0 ? void 0 : _d[value]) || value;
                        hasSet = true;
                    }
                    break;
                }
            }
            var cat = tokenCategoryByKey[key];
            if (cat !== undefined) {
                var res = (_e = tokensParsed[cat]) === null || _e === void 0 ? void 0 : _e[value];
                if (res != null) {
                    valOrVar = res;
                    hasSet = true;
                }
                else {
                    if (process.env.NODE_ENV === 'development') {
                        if (process.env.TAMAGUI_DISABLE_MISSING_TOKEN_LOG !== '1') {
                            if (!didLogMissingToken) {
                                didLogMissingToken = true;
                                console.groupCollapsed("[hanzogui] Warning: missing token ".concat(key, " in category ").concat(cat, " - ").concat(value, " (open for details)"));
                                console.info("Note: this could just be due to you not setting all the theme tokens Hanzogui expects, which is harmless, but\n                    it also often can be because you have a duplicated Hanzogui in your bundle, which can cause tricky bugs.");
                                console.info("To see if you have duplicated dependencies, in Chrome DevTools hit CMD+P and type HanzoguiProvider.\n                    If you see both a .cjs and a .mjs entry, it's duplicated.");
                                console.info("You can debug that issue by opening the .mjs and .cjs files and setting a breakpoint at the top of each.");
                                console.info("We only log this warning one time as it's sometimes harmless, to disable this log entirely set process.env.TAMAGUI_DISABLE_MISSING_TOKEN_LOG=1.");
                                console.groupEnd();
                            }
                        }
                    }
                }
            }
        }
        if (!hasSet) {
            var spaceVar = tokensParsed.space[value];
            if (spaceVar != null) {
                valOrVar = spaceVar;
                hasSet = true;
            }
        }
    }
    if (hasSet) {
        var out = resolveVariableValue(key, valOrVar, resolveAs);
        // apply opacity modifier via color-mix (web) or rgba (native)
        if (opacityModifier !== undefined && opacityModifier < 1) {
            out = (_f = (0, normalizeColor_1.normalizeColor)(String(out), opacityModifier)) !== null && _f !== void 0 ? _f : out;
        }
        if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
            globalThis.hanzoguiAvoidTracking = true;
            console.info("resolved", resolveAs, valOrVar, out);
            globalThis.hanzoguiAvoidTracking = false;
        }
        return out;
    }
    // they didn't define this token don't return anything, we could warn?
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
        console.warn("Warning: no token found for ".concat(key, ", omitting"));
    }
};
exports.getTokenForKey = getTokenForKey;
function resolveVariableValue(key, valOrVar, resolveValues) {
    if (resolveValues === 'none') {
        return valOrVar;
    }
    if ((0, createVariable_1.isVariable)(valOrVar)) {
        if (resolveValues === 'value') {
            return valOrVar.val;
        }
        // @ts-expect-error this is fine until we can type better
        var get = valOrVar === null || valOrVar === void 0 ? void 0 : valOrVar.get;
        // shadowColor doesn't support dynamic style
        if (process.env.TAMAGUI_TARGET !== 'native' || key !== 'shadowColor') {
            if (typeof get === 'function') {
                var resolveDynamicFor = resolveValues === 'web' ? 'web' : undefined;
                return get(resolveDynamicFor);
            }
        }
        return process.env.TAMAGUI_TARGET === 'native' ? valOrVar.val : valOrVar.variable;
    }
    return valOrVar;
}
