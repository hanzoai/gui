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
exports.Theme = void 0;
exports.getThemedChildren = getThemedChildren;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var react_1 = require("react");
var createVariable_1 = require("../createVariable");
var useTheme_1 = require("../hooks/useTheme");
var useThemeState_1 = require("../hooks/useThemeState");
var ThemeDebug_1 = require("./ThemeDebug");
exports.Theme = (0, react_1.forwardRef)(function Theme(props, ref) {
    'use no memo';
    // @ts-expect-error only for internal views
    if (props.disable) {
        return props.children;
    }
    var passThrough = props.passThrough;
    var isRoot = !!props['_isRoot'];
    var _a = (0, useTheme_1.useThemeWithState)(props, isRoot), _ = _a[0], themeState = _a[1];
    var disableDirectChildTheme = props['disable-child-theme'];
    var finalChildren = disableDirectChildTheme
        ? react_1.Children.map(props.children, function (child) {
            var _a;
            return passThrough || !(0, react_1.isValidElement)(child)
                ? child
                : (0, react_1.cloneElement)(child, (_a = {}, _a['data-disable-theme'] = true, _a));
        })
        : props.children;
    if (ref) {
        try {
            react_1.default.Children.only(finalChildren);
            // TODO deprecate react 18 and then avoid clone here and just pass prop
            finalChildren = (0, react_1.cloneElement)(finalChildren, { ref: ref });
        }
        catch (_b) {
            //ok
        }
    }
    var stateRef = (0, react_1.useRef)({
        hasEverThemed: false,
    });
    return getThemedChildren(themeState, finalChildren, props, isRoot, stateRef, passThrough);
});
exports.Theme['avoidForwardRef'] = true;
function getThemedChildren(themeState, children, props, isRoot, stateRef, passThrough) {
    if (isRoot === void 0) { isRoot = false; }
    if (passThrough === void 0) { passThrough = false; }
    var shallow = props.shallow, forceClassName = props.forceClassName;
    // always be true if ever themed so we avoid re-parenting
    var state = stateRef.current;
    var hasEverThemed = state.hasEverThemed;
    var shouldRenderChildrenWithTheme = hasEverThemed || themeState.isNew || isRoot || (0, useThemeState_1.hasThemeUpdatingProps)(props);
    if (process.env.NODE_ENV === 'development' && props.debug === 'visualize') {
        children = ((0, jsx_runtime_1.jsx)(ThemeDebug_1.ThemeDebug, { themeState: themeState, themeProps: props, children: children }));
    }
    if (!shouldRenderChildrenWithTheme) {
        return children;
    }
    // from here on out we have to be careful not to re-parent
    children = ((0, jsx_runtime_1.jsx)(useThemeState_1.ThemeStateContext.Provider, { value: themeState.id, children: children }));
    var isInverse = themeState.isInverse, name = themeState.name;
    var requiresExtraWrapper = isInverse || forceClassName;
    // it only ever progresses from false => true => 'wrapped'
    if (!state.hasEverThemed) {
        state.hasEverThemed = true;
    }
    if (requiresExtraWrapper ||
        // if the theme is exactly dark or light, its likely to change between dark/light
        // and that would require wrapping which would re-parent, so to avoid re-parenting do this
        themeState.name === 'dark' ||
        themeState.name === 'light') {
        state.hasEverThemed = 'wrapped';
    }
    // each children of these children wont get the theme
    if (shallow) {
        if (!themeState.parentId) {
            // they are doing shallow but didnt change actually change a theme theme?
        }
        else {
            var parentState_1 = (0, useThemeState_1.getThemeState)(themeState.isNew ? themeState.id : themeState.parentId);
            if (!parentState_1)
                throw new Error("\u203C\uFE0F010");
            children = react_1.Children.toArray(children).map(function (child) {
                return (0, react_1.isValidElement)(child)
                    ? passThrough
                        ? child
                        : (0, react_1.cloneElement)(child, undefined, (0, jsx_runtime_1.jsx)(exports.Theme, { name: parentState_1.name, children: child.props.children }))
                    : child;
            });
        }
    }
    if (process.env.NODE_ENV === 'development') {
        if (!passThrough && props.debug) {
            console.warn(" getThemedChildren", {
                requiresExtraWrapper: requiresExtraWrapper,
                forceClassName: forceClassName,
                themeState: themeState,
                state: state,
                themeSpanProps: getThemeClassNameAndColor(themeState, props, isRoot),
            });
        }
    }
    // this has to be after a few of the above items so it properly sets context (even if shallow set)
    if (forceClassName === false) {
        return children;
    }
    if (constants_1.isWeb) {
        var baseStyle = props.contain ? inertContainedStyle : inertStyle;
        var _a = passThrough
            ? {}
            : getThemeClassNameAndColor(themeState, props, isRoot), _b = _a.className, className = _b === void 0 ? '' : _b, color = _a.color;
        children = ((0, jsx_runtime_1.jsx)("span", { className: "".concat(className, " is_Theme"), style: passThrough ? baseStyle : __assign({ color: color }, baseStyle), children: children }));
        // to prevent tree structure changes always render this if inverse is true or false
        if (state.hasEverThemed === 'wrapped') {
            // but still calculate if we need the classnames
            var className_1 = requiresExtraWrapper
                ? "".concat(name.startsWith('light') ? 't_light' : name.startsWith('dark') ? 't_dark' : '', " _dsp_contents")
                : "_dsp_contents";
            children = (0, jsx_runtime_1.jsx)("span", { className: className_1, children: children });
        }
        return children;
    }
    return children;
}
var inertStyle = {
    display: 'contents',
};
var inertContainedStyle = {
    display: 'contents',
    contain: 'strict',
};
var empty = { className: '', color: undefined };
function getThemeClassNameAndColor(themeState, props, isRoot) {
    if (isRoot === void 0) { isRoot = false; }
    if (!themeState.isNew && !props.forceClassName) {
        return empty;
    }
    // in order to provide currentColor, set color by default
    var themeColor = (themeState === null || themeState === void 0 ? void 0 : themeState.theme) && themeState.isNew ? (0, createVariable_1.variableToString)(themeState.theme.color) : '';
    var style = themeColor
        ? {
            color: themeColor,
        }
        : undefined;
    var themeClassName = themeState.name.replace(schemePrefix, '');
    // Build full hierarchy of theme classes for CSS variable inheritance
    // Examples:
    // - "red_surface1" → "t_red t_red_surface1"
    // - "green_active_Button" → "t_green t_green_active t_green_active_Button"
    var themeNameParts = themeClassName.split('_');
    var themeClasses = "t_".concat(themeClassName);
    if (themeNameParts.length > 1) {
        // Build full hierarchy for all multi-part themes (sub-themes, component themes, etc.)
        // This enables CSS variable inheritance through all levels
        var hierarchyClasses = [];
        for (var i = 1; i <= themeNameParts.length; i++) {
            hierarchyClasses.push("t_".concat(themeNameParts.slice(0, i).join('_')));
        }
        themeClasses = hierarchyClasses.join(' ');
    }
    var className = "".concat(isRoot ? '' : 't_sub_theme', " ").concat(themeClasses);
    return { color: themeColor, className: className };
}
var schemePrefix = /^(dark|light)_/;
