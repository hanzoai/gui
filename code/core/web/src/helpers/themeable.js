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
exports.themeable = themeable;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Theme_1 = require("../views/Theme");
var getDefaultProps_1 = require("./getDefaultProps");
function themeable(Component, staticConfig, optimize) {
    if (optimize === void 0) { optimize = false; }
    var withThemeComponent = react_1.default.forwardRef(function WithTheme(props, ref) {
        'use no memo';
        var userDefaults = (0, getDefaultProps_1.getDefaultProps)(staticConfig, props.componentName);
        var defaultTheme = userDefaults === null || userDefaults === void 0 ? void 0 : userDefaults.theme;
        var defaultResetTheme = userDefaults === null || userDefaults === void 0 ? void 0 : userDefaults.themeReset;
        var theme = props.theme, componentName = props.componentName, themeReset = props.themeReset, rest = __rest(props, ["theme", "componentName", "themeReset"]);
        var overriddenContextProps;
        var context = staticConfig === null || staticConfig === void 0 ? void 0 : staticConfig.context;
        if (context) {
            for (var key in context.props) {
                var val = props[key];
                if (val !== undefined) {
                    overriddenContextProps = overriddenContextProps || {};
                    overriddenContextProps[key] = val;
                }
            }
        }
        var element = (
        // @ts-expect-error its ok
        (0, jsx_runtime_1.jsx)(Component, __assign({ ref: ref }, rest, { "data-disable-theme": true })));
        // we filter out the props here, why?
        // Theme internally avoids wrapping <span /> unless 'theme' in props
        // reason for this is to avoid wrapping every single component with span
        // *if* ever it themes once, it leaves the span, to avoid reparenting
        // its expected if users want to avoid re-parenting, they keep the theme prop
        // and just set it to null. but we need to "respect" that here by filtering
        // one example of a bug caused by not doing this is in <Select native> on web
        // where it renders to an <option />, and then Theme would wrap a <span /> in that
        // which is not allowed in HTML and causes hydration errors / logs
        var filteredProps = null;
        var compName = componentName || (staticConfig === null || staticConfig === void 0 ? void 0 : staticConfig.componentName);
        if (compName) {
            filteredProps = filteredProps || {};
            filteredProps.componentName = compName;
        }
        if ('debug' in props) {
            filteredProps = filteredProps || {};
            filteredProps.debug = props.debug;
        }
        if ('theme' in props || defaultTheme) {
            filteredProps = filteredProps || {};
            filteredProps.name = 'theme' in props ? props.theme : defaultTheme;
        }
        if ('themeReset' in props || defaultResetTheme) {
            filteredProps = filteredProps || {};
            filteredProps.reset = 'themeReset' in props ? themeReset : defaultResetTheme;
        }
        if (optimize && !filteredProps) {
            // optimize by avoiding theme! this can re-parent but we should just document that to avoid performance
            // in cases where you remove/add themes, just keep a theme={x ? '' : null} pattern
            return element;
        }
        var contents = ((0, jsx_runtime_1.jsx)(Theme_1.Theme, __assign({ "disable-child-theme": true }, filteredProps, { children: element })));
        if (context) {
            var Provider = context.Provider;
            var contextValue = react_1.default.useContext(context);
            contents = ((0, jsx_runtime_1.jsx)(Provider, __assign({}, contextValue, overriddenContextProps, { children: contents })));
        }
        return contents;
    });
    var withTheme = withThemeComponent;
    withTheme.displayName = "Themed(".concat((Component === null || Component === void 0 ? void 0 : Component.displayName) || (Component === null || Component === void 0 ? void 0 : Component.name) || 'Anonymous', ")");
    return withTheme;
}
