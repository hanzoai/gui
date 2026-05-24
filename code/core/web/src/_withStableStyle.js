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
Object.defineProperty(exports, "__esModule", { value: true });
exports._withStableStyle = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var config_1 = require("./config");
var useMedia_1 = require("./hooks/useMedia");
var useTheme_1 = require("./hooks/useTheme");
var useThemeState_1 = require("./hooks/useThemeState");
/** internal: this is for hanzogui babel plugin usage only */
var EMPTY_EXPRESSIONS = [];
var EMPTY_THEME = {};
var _withStableStyle = function (Component, createStyle, hasThemeKeys, hasMediaKeys) {
    return react_1.default.memo(react_1.default.forwardRef(function (props, ref) {
        var _a = props._expressions, _expressions = _a === void 0 ? EMPTY_EXPRESSIONS : _a, rest = __rest(props, ["_expressions"]);
        var parentId = (0, react_1.useContext)(useThemeState_1.ThemeStateContext);
        // compile-time constants per wrapper, so conditional hooks are stable
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var theme = hasThemeKeys && parentId ? (0, useTheme_1.useTheme)() : null;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var media = hasMediaKeys ? (0, useMedia_1.useMedia)() : null;
        var resolvedExpressions = media
            ? _expressions.map(function (expr) { return (typeof expr === 'string' ? media[expr] : expr); })
            : _expressions;
        var resolvedTheme = theme || EMPTY_THEME;
        if (hasThemeKeys && !parentId) {
            // monorepo edge case: ThemeStateContext is from a different instance
            var config = (0, config_1.getConfigMaybe)();
            var themes = config === null || config === void 0 ? void 0 : config.themes;
            if (themes) {
                for (var k in themes) {
                    resolvedTheme = themes.light || themes.dark || themes[k];
                    break;
                }
            }
            if (process.env.NODE_ENV === 'development') {
                console.warn('[@hanzogui] _withStableStyle: no ThemeStateContext found. ' +
                    'This usually means duplicate hanzogui instances in a monorepo. ' +
                    'Falling back to default theme from config.');
            }
        }
        return ((0, jsx_runtime_1.jsx)(Component, __assign({ ref: ref, style: createStyle(resolvedTheme, resolvedExpressions) }, rest)));
    }));
};
exports._withStableStyle = _withStableStyle;
