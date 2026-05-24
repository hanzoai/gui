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
exports.SizableContext = void 0;
exports.themed = themed;
var jsx_runtime_1 = require("react/jsx-runtime");
var core_1 = require("@hanzogui/core");
var sizable_context_1 = require("@hanzogui/sizable-context");
Object.defineProperty(exports, "SizableContext", { enumerable: true, get: function () { return sizable_context_1.SizableContext; } });
// check if props contain media queries ($sm, $md, etc) or other complex hanzogui features
function needsFullStyleResolution(props) {
    for (var key in props) {
        if (key[0] === '$')
            return true;
    }
    return false;
}
function themed(Component, optsIn) {
    if (optsIn === void 0) { optsIn = {}; }
    var opts = __assign({ defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color', defaultStrokeWidth: 2, fallbackColor: '#000', resolveValues: process.env.TAMAGUI_ICON_COLOR_RESOLVE || 'auto' }, optsIn);
    var IconWrapper = function (propsIn) {
        var _a;
        var styledContext = sizable_context_1.SizableContext.useStyledContext();
        var needsMedia = needsFullStyleResolution(propsIn);
        var _b = (0, core_1.usePropsAndStyle)(propsIn, __assign(__assign({}, opts), { forComponent: core_1.Text, resolveValues: opts.resolveValues, noMedia: !needsMedia })), props = _b[0], style = _b[1], theme = _b[2];
        var defaultColor = opts.defaultThemeColor;
        var colorIn = style.color ||
            (defaultColor ? theme[defaultColor] : undefined) ||
            (!props.disableTheme ? theme.color : null) ||
            opts.fallbackColor;
        var color = (0, core_1.getVariable)(colorIn);
        var size = typeof props.size === 'string'
            ? (0, core_1.getTokenValue)(props.size, 'size')
            : props.size || (styledContext.size === '$true' ? undefined : styledContext.size);
        var strokeWidth = typeof props.strokeWidth === 'string'
            ? (0, core_1.getTokenValue)(props.strokeWidth, 'size')
            : ((_a = props.strokeWidth) !== null && _a !== void 0 ? _a : "".concat(opts.defaultStrokeWidth));
        var finalProps = __assign(__assign({}, props), { color: color, size: size, strokeWidth: strokeWidth, style: style });
        return (0, jsx_runtime_1.jsx)(Component, __assign({}, finalProps));
    };
    var wrapped = function (propsIn) {
        return (0, jsx_runtime_1.jsx)(IconWrapper, __assign({}, propsIn));
    };
    // add staticConfig so styled() works properly with themed icons
    wrapped['staticConfig'] = {
        isHOC: true,
        acceptsClassName: true,
    };
    return wrapped;
}
