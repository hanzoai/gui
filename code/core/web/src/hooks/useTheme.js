"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeWithState = exports.useTheme = void 0;
var react_1 = require("react");
var getThemeProxied_1 = require("./getThemeProxied");
var useThemeState_1 = require("./useThemeState");
var EMPTY = {};
var useTheme = function () {
    'use no memo';
    var theme = (0, exports.useThemeWithState)(EMPTY)[0];
    var res = theme;
    return res;
};
exports.useTheme = useTheme;
/**
 * Adds a proxy around themeState that tracks update keys
 */
var useThemeWithState = function (props, isRoot) {
    'use no memo';
    if (isRoot === void 0) { isRoot = false; }
    var keys = (0, react_1.useRef)(null);
    var schemeKeys = (0, react_1.useRef)(null);
    var themeState = (0, useThemeState_1.useThemeState)(props, isRoot, keys, schemeKeys);
    if (process.env.NODE_ENV === 'development') {
        if (!props.passThrough && !(themeState === null || themeState === void 0 ? void 0 : themeState.theme)) {
            if (process.env.TAMAGUI_DISABLE_NO_THEME_WARNING !== '1') {
                console.error("[hanzogui] No theme found, this could be due to an invalid theme name (given theme props ".concat(JSON.stringify(props), ").\n\nIf this is intended and you are using Hanzogui without any themes, you can disable this warning by setting the environment variable TAMAGUI_DISABLE_NO_THEME_WARNING=1"));
            }
        }
    }
    var themeProxied = props.passThrough
        ? {}
        : (0, getThemeProxied_1.getThemeProxied)(props, themeState, keys, schemeKeys);
    return [themeProxied, themeState];
};
exports.useThemeWithState = useThemeWithState;
