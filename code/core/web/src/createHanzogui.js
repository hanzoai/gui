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
exports.createHanzogui = createHanzogui;
var config_1 = require("./config");
var createVariables_1 = require("./createVariables");
var defaultAnimationDriver_1 = require("./helpers/defaultAnimationDriver");
var resolveAnimationDriver_1 = require("./helpers/resolveAnimationDriver");
var createDesignSystem_1 = require("./helpers/createDesignSystem");
var insertStyleRule_1 = require("./helpers/insertStyleRule");
var proxyThemeToParents_1 = require("./helpers/proxyThemeToParents");
var themes_1 = require("./helpers/themes");
var useMedia_1 = require("./hooks/useMedia");
var insertFont_1 = require("./insertFont");
var Hanzogui_1 = require("./Hanzogui");
/**
 * Determines if a token category should have px units added.
 * Following the principle: only add px to predefined categories that need them.
 * Custom categories default to unitless.
 */
function shouldTokenCategoryHaveUnits(category) {
    // From TokenCategories type: 'color' | 'space' | 'size' | 'radius' | 'zIndex'
    // These are the only predefined categories that should get px units
    var UNIT_CATEGORIES = new Set(['size', 'space', 'radius']);
    // Only add px to predefined dimensional categories
    // Custom categories (like 'opacity', 'customWidth') default to unitless
    return UNIT_CATEGORIES.has(category);
}
// code optimizers were causing issues by not calling both of these as esbuild had compiled them
// pulling them into a single initializeHanzoguiConfig to prevent that
function initializeHanzoguiConfig(config) {
    (0, config_1.setConfig)(config);
    (0, useMedia_1.configureMedia)(config);
}
function createHanzogui(configIn) {
    var _a, _b, _c;
    // if config already exists (e.g., from another copy of hanzogui in vite ssr), reuse it
    var existingConfig = (0, config_1.getConfigMaybe)();
    if (existingConfig) {
        // merge it and re-run since this new instance may add config
        // or maybe a test case
        configIn = __assign(__assign({}, existingConfig), configIn);
    }
    // ensure variables
    var tokensParsed = {};
    var tokens = (0, createVariables_1.createVariables)(configIn.tokens || {});
    if (configIn.tokens) {
        // faster lookups
        var tokensMerged = {};
        for (var cat in tokens) {
            tokensParsed[cat] = {};
            tokensMerged[cat] = {};
            var tokenCat = tokens[cat];
            for (var key in tokenCat) {
                var val = tokenCat[key];
                var prefixedKey = "$".concat(key);
                tokensParsed[cat][prefixedKey] = val;
                tokensMerged[cat][prefixedKey] = val;
                tokensMerged[cat][key] = val;
            }
        }
        (0, config_1.setTokens)(tokensMerged);
    }
    var foundThemes;
    if (configIn.themes) {
        var noThemes = Object.keys(configIn.themes).length === 0;
        if (noThemes && !process.env.TAMAGUI_DID_OUTPUT_CSS) {
            foundThemes = (0, insertStyleRule_1.scanAllSheets)(noThemes, tokensParsed);
        }
    }
    var fontSizeTokens = null;
    var fontsParsed;
    if (configIn.fonts) {
        var fontTokens_1 = Object.fromEntries(Object.entries(configIn.fonts).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, (0, createVariables_1.createVariables)(v, 'f', true)];
        }));
        fontsParsed = (function () {
            var res = {};
            for (var familyName in fontTokens_1) {
                var font = fontTokens_1[familyName];
                var fontParsed = (0, insertFont_1.parseFont)(font);
                res["$".concat(familyName)] = fontParsed;
                if (!fontSizeTokens && fontParsed.size) {
                    fontSizeTokens = new Set(Object.keys(fontParsed.size));
                }
            }
            return res;
        })();
    }
    var specificTokens = {};
    var themeConfig = (function () {
        // populate specificTokens (needed for runtime)
        var sortedTokenKeys = Object.keys(tokens).sort();
        for (var _i = 0, sortedTokenKeys_1 = sortedTokenKeys; _i < sortedTokenKeys_1.length; _i++) {
            var key = sortedTokenKeys_1[_i];
            var sortedSubKeys = Object.keys(tokens[key]).sort();
            for (var _a = 0, sortedSubKeys_1 = sortedSubKeys; _a < sortedSubKeys_1.length; _a++) {
                var skey = sortedSubKeys_1[_a];
                var variable = tokens[key][skey];
                specificTokens["$".concat(key, ".").concat(skey)] = variable;
                if (process.env.NODE_ENV === 'development') {
                    if (typeof variable === 'undefined') {
                        throw new Error("No value for tokens.".concat(key, ".").concat(skey, ":\n").concat(JSON.stringify(variable, null, 2)));
                    }
                }
            }
        }
        // CSS generation (tree-shaken when TAMAGUI_DID_OUTPUT_CSS is set)
        var declarations = (0, createDesignSystem_1.createTokenCSS)(tokens, shouldTokenCategoryHaveUnits);
        var fontDeclarations = (0, createDesignSystem_1.createFontCSS)(fontsParsed, insertFont_1.registerFontVariables);
        var cssRuleSets = (0, createDesignSystem_1.buildCSSRuleSets)(declarations, fontDeclarations);
        var themesIn = configIn.themes;
        var dedupedThemes = foundThemes !== null && foundThemes !== void 0 ? foundThemes : getThemesDeduped(themesIn, tokens.color);
        var themes = (0, proxyThemeToParents_1.proxyThemesToParents)(dedupedThemes);
        return {
            themes: themes,
            cssRuleSets: cssRuleSets,
            getThemeRulesSets: function () {
                return (0, createDesignSystem_1.createThemeCSS)(dedupedThemes, configIn);
            },
        };
    })();
    // Keep track of user-provided shorthands separately
    var userShorthands = configIn.shorthands || {};
    // Merge built-in shorthands with user shorthands (user takes precedence)
    var shorthands = __assign(__assign({}, builtinShorthands), userShorthands);
    var lastCSSIndex = { value: -1 };
    var getCSS = function (opts) {
        if (opts === void 0) { opts = {}; }
        return (0, createDesignSystem_1.getCSS)(themeConfig, opts, lastCSSIndex);
    };
    var getNewCSS = function (opts) { return getCSS(__assign(__assign({}, opts), { sinceLastCall: true })); };
    var defaultFontSetting = (_a = configIn.settings) === null || _a === void 0 ? void 0 : _a.defaultFont;
    var defaultFont = (function () {
        var val = defaultFontSetting;
        if ((val === null || val === void 0 ? void 0 : val[0]) === '$') {
            val = val.slice(1);
        }
        return val;
    })();
    var defaultPositionSetting = ((_b = configIn.settings) === null || _b === void 0 ? void 0 : _b.defaultPosition) || 'static';
    var defaultProps = configIn.defaultProps || {};
    // apply defaultPosition via defaultProps when not static
    if (process.env.TAMAGUI_TARGET === 'web' && defaultPositionSetting !== 'static') {
        defaultProps.View = __assign(__assign({}, defaultProps.View), { position: defaultPositionSetting });
    }
    // ensure prefixed with $
    var defaultFontToken = defaultFont ? "$".concat(defaultFont) : '';
    // Text inherits font from root via CSS, no need for default fontFamily
    // only explicit fontFamily prop should add font_* class
    // normalize multi-driver animation config to default driver
    // supports format: { default: motionDriver, css: cssDriver }
    // stores full config in animationDrivers for component-level selection via animatedBy
    var inputAnimations = configIn.animations;
    var resolvedDriver = (0, resolveAnimationDriver_1.resolveAnimationDriver)(inputAnimations);
    // multi-driver when resolveAnimationDriver extracted .default (returned different ref)
    var isMultiDriver = resolvedDriver !== null && resolvedDriver !== inputAnimations;
    var resolvedAnimations = resolvedDriver !== null && resolvedDriver !== void 0 ? resolvedDriver : inputAnimations;
    var animationDrivers = isMultiDriver
        ? inputAnimations
        : undefined;
    var config = __assign(__assign({ fonts: {}, onlyAllowShorthands: false, fontLanguages: [], media: {} }, configIn), { 
        // normalized animations (resolved from multi-driver format if needed)
        animations: resolvedAnimations !== null && resolvedAnimations !== void 0 ? resolvedAnimations : defaultAnimationDriver_1.defaultAnimationDriver, animationDrivers: animationDrivers, defaultProps: defaultProps, settings: __assign({ webContainerType: 'inline-size' }, configIn.settings), tokens: tokens, 
        // vite made this into a function if it wasn't set
        shorthands: shorthands, userShorthands: userShorthands, inverseShorthands: shorthands
            ? Object.fromEntries(Object.entries(shorthands).map(function (_a) {
                var k = _a[0], v = _a[1];
                return [v, k];
            }))
            : {}, themes: themeConfig.themes, fontsParsed: fontsParsed || {}, themeConfig: themeConfig, tokensParsed: tokensParsed, parsed: true, getNewCSS: getNewCSS, getCSS: getCSS, defaultFont: defaultFont, fontSizeTokens: fontSizeTokens || new Set(), specificTokens: specificTokens, defaultFontToken: defaultFontToken });
    initializeHanzoguiConfig(config);
    if (process.env.NODE_ENV !== 'development') {
        return config;
    }
    if ((_c = process.env.DEBUG) === null || _c === void 0 ? void 0 : _c.startsWith('hanzogui')) {
        console.info('Hanzogui config:', config);
    }
    if (!globalThis['Hanzogui']) {
        globalThis['Hanzogui'] = Hanzogui_1.Hanzogui;
    }
    return config;
}
// dedupes the themes if given them via JS config
function getThemesDeduped(themes, colorTokens) {
    var dedupedThemes = [];
    var existing = new Map();
    // Sort theme names for deterministic CSS output order
    var sortedThemeNames = Object.keys(themes).sort();
    // first, de-dupe and parse them
    for (var _i = 0, sortedThemeNames_1 = sortedThemeNames; _i < sortedThemeNames_1.length; _i++) {
        var themeName = sortedThemeNames_1[_i];
        // forces us to separate the dark/light themes (otherwise we generate bad t_light prefix selectors)
        var darkOrLightSpecificPrefix = themeName.startsWith('dark')
            ? 'dark'
            : themeName.startsWith('light')
                ? 'light'
                : '';
        var rawTheme = themes[themeName];
        // dont force referential equality but may need something more consistent than JSON.stringify
        // separate between dark/light
        var key = darkOrLightSpecificPrefix + JSON.stringify(rawTheme);
        // if existing, avoid
        if (existing.has(key)) {
            var e = existing.get(key);
            e.names.push(themeName);
            continue;
        }
        // ensure each theme object unique for dedupe
        // is ThemeParsed because we call ensureThemeVariable
        // color tokens are spread first as fallbacks, theme values take precedence
        var theme = __assign(__assign({}, colorTokens), rawTheme);
        // parse into variables
        for (var key_1 in theme) {
            // make sure properly names theme variables
            (0, themes_1.ensureThemeVariable)(theme, key_1);
        }
        // set deduped
        var deduped = {
            names: [themeName],
            theme: theme,
        };
        dedupedThemes.push(deduped);
        existing.set(key, deduped);
    }
    return dedupedThemes;
}
// Built-in shorthands used internally for short classname generation
var builtinShorthands = {
    bblr: 'borderBottomLeftRadius',
    bbrr: 'borderBottomRightRadius',
    bbs: 'borderBottomStyle',
    bls: 'borderLeftStyle',
    brc: 'borderRightColor',
    brs: 'borderRightStyle',
    brw: 'borderRightWidth',
    bs: 'borderStyle',
    btc: 'borderTopColor',
    btlr: 'borderTopLeftRadius',
    btrr: 'borderTopRightRadius',
    bts: 'borderTopStyle',
    btw: 'borderTopWidth',
    bw: 'borderWidth',
    bxs: 'boxSizing',
    bxsh: 'boxShadow',
    col: 'color',
    cur: 'cursor',
    dsp: 'display',
    fb: 'flexBasis',
    fd: 'flexDirection',
    ff: 'fontFamily',
    fs: 'fontSize',
    fst: 'fontStyle',
    fw: 'fontWeight',
    fwr: 'flexWrap',
    // height: 'h',
    lh: 'lineHeight',
    ls: 'letterSpacing',
    o: 'opacity',
    ov: 'overflow',
    ox: 'overflowX',
    oy: 'overflowY',
    pe: 'pointerEvents',
    pos: 'position',
    td: 'textDecorationLine',
    tr: 'transform',
    tt: 'textTransform',
    va: 'verticalAlign',
    wb: 'wordBreak',
    // width: 'w',
    ws: 'whiteSpace',
    ww: 'wordWrap',
};
