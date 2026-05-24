"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devConfig = exports.getFont = exports.updateConfig = exports.getThemes = exports.useTokens = exports.getTokenValue = exports.getToken = exports.getTokenObject = exports.getTokens = exports.getConfigMaybe = exports.getConfig = exports.setConfigFont = exports.setConfig = exports.getSetting = void 0;
exports.setTokens = setTokens;
exports.setupDev = setupDev;
exports.loadAnimationDriver = loadAnimationDriver;
var constants_1 = require("@hanzogui/constants");
var constants_2 = require("./constants/constants");
var conf;
var setConfigCalledByThisInstance = false;
var haventCalledErrorMessage = process.env.NODE_ENV === 'development'
    ? "\nHaven't called createHanzogui yet. ".concat(constants_2.MISSING_THEME_MESSAGE, "\n")
    : "\u274C Error 001";
// helper to get config from module-scoped variable or globalthis fallback
// this handles vite ssr bundling where multiple copies of hanzogui may exist
var getConfigFromGlobalOrLocal = function () {
    if (conf) {
        return conf;
    }
    // fall back to globalthis (for vite ssr bundling scenarios)
    if (globalThis.__hanzoguiConfig) {
        // defer warning - if createHanzogui runs in THIS instance, it's HMR (safe)
        // if it never runs, it's a true duplicate (warn)
        if (process.env.NODE_ENV === 'development' &&
            !globalThis.__hanzoguiHasWarnedGlobalFallback &&
            !globalThis.__hanzoguiPendingCheck) {
            globalThis.__hanzoguiPendingCheck = true;
            setTimeout(function () {
                if (!setConfigCalledByThisInstance &&
                    !globalThis.__hanzoguiHasWarnedGlobalFallback) {
                    globalThis.__hanzoguiHasWarnedGlobalFallback = true;
                    console.warn("\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F\n\nHanzogui: Using global config fallback. This may indicate duplicate hanzogui instances (e.g., from Vite SSR bundling). This is handled automatically, but likely causes issues!\n\n\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F\u26A0\uFE0F");
                }
                globalThis.__hanzoguiPendingCheck = false;
            }, 500);
        }
        return globalThis.__hanzoguiConfig;
    }
    return null;
};
var getSetting = function (key) {
    var _a;
    var config = getConfigFromGlobalOrLocal();
    if (process.env.NODE_ENV === 'development') {
        if (!config)
            throw new Error(haventCalledErrorMessage);
    }
    return ((_a = config.settings[key]) !== null && _a !== void 0 ? _a : 
    // @ts-expect-error
    config[key]);
};
exports.getSetting = getSetting;
var setConfig = function (next) {
    setConfigCalledByThisInstance = true;
    conf = next;
    globalThis.__hanzoguiConfig = next;
};
exports.setConfig = setConfig;
var setConfigFont = function (name, font, fontParsed) {
    var config = getConfigFromGlobalOrLocal();
    if (process.env.NODE_ENV === 'development') {
        if (!config)
            throw new Error(haventCalledErrorMessage);
    }
    config.fonts[name] = font;
    config.fontsParsed["$".concat(name)] = fontParsed;
};
exports.setConfigFont = setConfigFont;
var getConfig = function () {
    var config = getConfigFromGlobalOrLocal();
    if (!config) {
        throw new Error(process.env.NODE_ENV !== 'production'
            ? "Missing hanzogui config, you either have a duplicate config, or haven't set it up. Be sure createHanzogui is called before rendering. Also, make sure all of your hanzogui dependencies are on the same version (`hanzogui`, `@hanzogui/package-name`, etc.) not just in your package.json, but in your lockfile."
            : 'Err0');
    }
    return config;
};
exports.getConfig = getConfig;
var getConfigMaybe = function () {
    return getConfigFromGlobalOrLocal();
};
exports.getConfigMaybe = getConfigMaybe;
var tokensMerged;
function setTokens(_) {
    tokensMerged = _;
}
var getTokens = function (_a) {
    var _b = _a === void 0 ? {} : _a, prefixed = _b.prefixed;
    var config = getConfigFromGlobalOrLocal();
    if (process.env.NODE_ENV === 'development') {
        if (!config)
            throw new Error(haventCalledErrorMessage);
    }
    var _c = config, tokens = _c.tokens, tokensParsed = _c.tokensParsed;
    if (prefixed === false)
        return tokens;
    if (prefixed === true)
        return tokensParsed;
    return tokensMerged;
};
exports.getTokens = getTokens;
var getTokenObject = function (value, group) {
    var _a, _b, _c;
    var config = getConfigFromGlobalOrLocal();
    return ((_a = config.specificTokens[value]) !== null && _a !== void 0 ? _a : (group
        ? (_b = tokensMerged[group]) === null || _b === void 0 ? void 0 : _b[value]
        : (_c = tokensMerged[Object.keys(tokensMerged).find(function (cat) { return tokensMerged[cat][value]; }) || '']) === null || _c === void 0 ? void 0 : _c[value]));
};
exports.getTokenObject = getTokenObject;
var getToken = function (value, group, useVariable) {
    if (useVariable === void 0) { useVariable = constants_1.isWeb; }
    var token = (0, exports.getTokenObject)(value, group);
    return useVariable ? token === null || token === void 0 ? void 0 : token.variable : token === null || token === void 0 ? void 0 : token.val;
};
exports.getToken = getToken;
var getTokenValue = function (value, group) {
    if (value === 'unset' || value === 'auto')
        return;
    return (0, exports.getToken)(value, group, false);
};
exports.getTokenValue = getTokenValue;
/**
 * Note: this is the same as `getTokens`
 */
exports.useTokens = exports.getTokens;
var getThemes = function () { return getConfigFromGlobalOrLocal().themes; };
exports.getThemes = getThemes;
var updateConfig = function (key, value) {
    // for usage internally only
    var config = getConfigFromGlobalOrLocal();
    Object.assign(config[key], value);
};
exports.updateConfig = updateConfig;
// searches by value name or token name
var getFont = function (name) {
    var _a, _b;
    var conf = (0, exports.getConfig)();
    return ((_a = conf.fontsParsed[name]) !== null && _a !== void 0 ? _a : (_b = Object.entries(conf.fontsParsed).find(function (_a) {
        var _b, _c;
        var k = _a[0];
        return ((_c = (_b = conf.fontsParsed[k]) === null || _b === void 0 ? void 0 : _b.family) === null || _c === void 0 ? void 0 : _c['val']) === name;
    })) === null || _b === void 0 ? void 0 : _b[1]);
};
exports.getFont = getFont;
function setupDev(conf) {
    if (process.env.NODE_ENV === 'development') {
        exports.devConfig = conf;
    }
}
/**
 * Dynamically load an animation driver at runtime.
 * Useful for lazy loading heavier animation drivers after initial page load.
 *
 * @example
 * ```tsx
 * // import loadAnimationDriver from hanzogui
 * // import createAnimations from your preferred driver (e.g. animations-reanimated)
 *
 * const driver = createAnimations({ bouncy: { type: 'spring', damping: 10 } })
 * loadAnimationDriver('spring', driver)
 * ```
 */
function loadAnimationDriver(name, driver) {
    var _a;
    var config = getConfigFromGlobalOrLocal();
    if (!config) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('loadAnimationDriver called before createHanzogui');
        }
        return;
    }
    // Convert single driver to object format if needed
    if (config.animations && !('default' in config.animations)) {
        ;
        config.animations = {
            default: config.animations,
        };
    }
    // Add the new driver
    if (config.animations) {
        ;
        config.animations[name] = driver;
    }
    else {
        ;
        config.animations = (_a = {
                default: driver
            },
            _a[name] = driver,
            _a);
    }
}
