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
exports.useProps = useProps;
exports.useStyle = useStyle;
exports.usePropsAndStyle = usePropsAndStyle;
var constants_1 = require("@hanzogui/constants");
var react_1 = require("react");
var config_1 = require("../config");
var ComponentContext_1 = require("../contexts/ComponentContext");
var GroupContext_1 = require("../contexts/GroupContext");
var getSplitStyles_1 = require("../helpers/getSplitStyles");
var subscribeToContextGroup_1 = require("../helpers/subscribeToContextGroup");
var View_1 = require("../views/View");
var useComponentState_1 = require("./useComponentState");
var mediaState_1 = require("../helpers/mediaState");
var useMedia_1 = require("./useMedia");
var useTheme_1 = require("./useTheme");
/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
function useProps(props, opts) {
    var _a = usePropsAndStyle(props, __assign(__assign({}, opts), { noExpand: true, noNormalize: true, resolveValues: 'none' })), propsOut = _a[0], styleOut = _a[1];
    return __assign(__assign({}, propsOut), styleOut);
}
/**
 * Returns only style values fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
function useStyle(props, opts) {
    return usePropsAndStyle(props, opts)[1] || {};
}
/**
 * Returns [props, styles, theme, media] fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
function usePropsAndStyle(props, opts) {
    var _a, _b;
    var staticConfig = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.forComponent) === null || _a === void 0 ? void 0 : _a.staticConfig) !== null && _b !== void 0 ? _b : View_1.View.staticConfig;
    var _c = (0, useTheme_1.useThemeWithState)({
        componentName: staticConfig.componentName,
        name: 'theme' in props ? props.theme : undefined,
        needsUpdate: function () {
            return true;
        },
    }), theme = _c[0], themeState = _c[1];
    var componentContext = react_1.default.useContext(ComponentContext_1.ComponentContext);
    var groupContext = react_1.default.useContext(GroupContext_1.GroupContext);
    var _d = (0, useComponentState_1.useComponentState)(props, componentContext.animationDriver, staticConfig, (0, config_1.getConfig)()), state = _d.state, disabled = _d.disabled, setStateShallow = _d.setStateShallow;
    var mediaStateNow = (opts === null || opts === void 0 ? void 0 : opts.noMedia)
        ? // not safe to use mediaState but really marginal to hit this
            mediaState_1.mediaState
        : (0, useMedia_1.useMedia)();
    var splitStyles = (0, getSplitStyles_1.useSplitStyles)(props, staticConfig, theme, (themeState === null || themeState === void 0 ? void 0 : themeState.name) || '', state, __assign({ isAnimated: false, mediaState: mediaStateNow, noSkip: true, noMergeStyle: true, noClass: true, resolveValues: 'auto' }, opts), null, componentContext, groupContext);
    var _e = splitStyles || {}, mediaGroups = _e.mediaGroups, pseudoGroups = _e.pseudoGroups;
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        if (disabled) {
            return;
        }
        if (state.unmounted) {
            setStateShallow({ unmounted: false });
            return;
        }
        if (groupContext) {
            return (0, subscribeToContextGroup_1.subscribeToContextGroup)({
                groupContext: groupContext,
                setStateShallow: setStateShallow,
                mediaGroups: mediaGroups,
                pseudoGroups: pseudoGroups,
            });
        }
    }, [
        disabled,
        groupContext,
        pseudoGroups ? Object.keys(__spreadArray([], pseudoGroups, true)).join('') : 0,
        mediaGroups ? Object.keys(__spreadArray([], mediaGroups, true)).join('') : 0,
    ]);
    return [
        (splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.viewProps) || {},
        (splitStyles === null || splitStyles === void 0 ? void 0 : splitStyles.style) || {},
        theme,
        mediaState_1.mediaState,
    ];
}
