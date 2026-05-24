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
exports.getThemeProxied = getThemeProxied;
var constants_1 = require("@hanzogui/constants");
var config_1 = require("../config");
var createVariable_1 = require("../createVariable");
var getDynamicVal_1 = require("../helpers/getDynamicVal");
var doesRootSchemeMatchSystem_1 = require("./doesRootSchemeMatchSystem");
// only proxy each theme one time, after that we know that renders are sync,
// so we can just change the focus of the proxied theme and it can be re-used
var cache = new Map();
var curKeys;
var curSchemeKeys;
var curProps;
var curState;
var emptyObject = {};
function getThemeProxied(
// underscore to prevent accidental usage below
_props, _state, _keys, _schemeKeys) {
    if (!(_state === null || _state === void 0 ? void 0 : _state.theme)) {
        return emptyObject;
    }
    curKeys = _keys;
    curSchemeKeys = _schemeKeys;
    curProps = _props;
    curState = _state;
    if (cache.has(curState.theme)) {
        var proxied_1 = cache.get(curState.theme);
        return proxied_1;
    }
    // first time running on this theme, create:
    // from here on only use current*
    var config = (0, config_1.getConfig)();
    function track(key, schemeOptimized) {
        if (schemeOptimized === void 0) { schemeOptimized = false; }
        if (!curKeys)
            return;
        if (!curKeys.current) {
            curKeys.current = new Set();
        }
        curKeys.current.add(key);
        // track scheme-optimized keys separately so we know if a scheme-only
        // change can skip re-render (when all accessed keys use DynamicColorIOS)
        if (schemeOptimized && curSchemeKeys) {
            if (!curSchemeKeys.current) {
                curSchemeKeys.current = new Set();
            }
            curSchemeKeys.current.add(key);
        }
        if (process.env.NODE_ENV === 'development' && curProps.debug) {
            console.info(" \uD83C\uDFA8 useTheme() tracking key: ".concat(key, " schemeOptimized=").concat(schemeOptimized));
        }
    }
    var proxied = Object.fromEntries(Object.entries(_state.theme).flatMap(function (_a) {
        var key = _a[0], value = _a[1];
        var proxied = __assign(__assign({}, value), { get val() {
                // when they touch the actual value we only track it if its a variable (web), its ignored!
                if (!globalThis.hanzoguiAvoidTracking) {
                    // always track .val - not scheme optimized since they're getting raw value
                    track(key, false);
                }
                return value.val;
            }, get: function (platform) {
                var _a, _b;
                if (!curState)
                    return;
                var outVal = (0, createVariable_1.getVariable)(value);
                var name = curState.name, scheme = curState.scheme;
                if (process.env.TAMAGUI_TARGET === 'native') {
                    // ios can avoid re-rendering for scheme changes (light↔dark) when using DynamicColorIOS
                    // this does NOT work for sub-theme changes (red→blue) or when scheme inverses from parent
                    var fastSchemeChange = (0, config_1.getSetting)('fastSchemeChange');
                    var rootMatchesSystem = (0, doesRootSchemeMatchSystem_1.doesRootSchemeMatchSystem)();
                    var shouldOptimize = scheme &&
                        platform !== 'web' &&
                        constants_1.isIos &&
                        !curProps.deopt &&
                        !curState.isInverse &&
                        fastSchemeChange &&
                        rootMatchesSystem;
                    if (process.env.NODE_ENV === 'development' && curProps.debug === 'verbose') {
                        console.info(" \uD83C\uDFA8 useTheme().get(".concat(key, ") theme=").concat(name, " scheme=").concat(scheme), "\n   shouldOptimize=".concat(shouldOptimize, " (iOS=").concat(constants_1.isIos, " deopt=").concat(curProps.deopt, " isInverse=").concat(curState.isInverse, " fastScheme=").concat(fastSchemeChange, " rootMatch=").concat(rootMatchesSystem, ")"));
                    }
                    if (shouldOptimize) {
                        var oppositeScheme = scheme === 'dark' ? 'light' : 'dark';
                        var oppositeName = name.replace(scheme, oppositeScheme);
                        var color = (0, createVariable_1.getVariable)((_a = config.themes[name]) === null || _a === void 0 ? void 0 : _a[key]);
                        var oppositeColor = (0, createVariable_1.getVariable)((_b = config.themes[oppositeName]) === null || _b === void 0 ? void 0 : _b[key]);
                        if (process.env.NODE_ENV === 'development' &&
                            curProps.debug === 'verbose') {
                            console.info(" \uD83C\uDFA8 useTheme().get(".concat(key, ") using DynamicColorIOS"), "\n   color=".concat(color, " oppositeColor=").concat(oppositeColor));
                        }
                        var dynamicVal = (0, getDynamicVal_1.getDynamicVal)({
                            scheme: scheme,
                            val: color,
                            oppositeVal: oppositeColor,
                        });
                        // track as scheme-optimized - can skip re-render for scheme-only changes
                        track(key, true);
                        return dynamicVal;
                    }
                    if (process.env.NODE_ENV === 'development' && curProps.debug) {
                        console.info(" \uD83C\uDFA8 useTheme().get(".concat(key, ") tracking key (not optimizing)"), "\n   platform=".concat(platform, " isIOS=").concat(constants_1.isIos, " deopt=").concat(curProps.deopt, " fastScheme=").concat(fastSchemeChange));
                    }
                    // not scheme-optimized
                    track(key, false);
                }
                return outVal;
            } });
        return [
            [key, proxied],
            ["$".concat(key), proxied],
        ];
    }));
    cache.set(_state.theme, proxied);
    return proxied;
}
