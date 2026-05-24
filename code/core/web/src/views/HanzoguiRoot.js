"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanzoguiRoot = HanzoguiRoot;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var config_1 = require("../config");
var Theme_1 = require("./Theme");
var defaultFontClass = '';
/**
 * Applies default font class and CSS variable inheritance via display:contents.
 * Used by HanzoguiProvider at the root and by portals to re-establish font scope.
 * Pass trackMount to also handle the t_unmounted class for CSS animation gating.
 */
function HanzoguiRoot(_a) {
    var children = _a.children, theme = _a.theme, isRootRoot = _a.isRootRoot, passThrough = _a.passThrough, style = _a.style;
    var _b = react_1.default.useState(!isRootRoot), mounted = _b[0], setMounted = _b[1];
    react_1.default.useEffect(function () {
        if (!mounted) {
            setMounted(true);
        }
    }, []);
    // cache the font class name
    if (!defaultFontClass) {
        var config = (0, config_1.getConfig)();
        var defaultFont = config.defaultFont;
        if (defaultFont) {
            defaultFontClass = "font_".concat(defaultFont);
        }
    }
    var contents = ((0, jsx_runtime_1.jsx)("span", { style: style, 
        // font_body (or default font) sets all font properties via shared CSS rule
        className: "_dsp_contents ".concat(mounted ? '' : 't_unmounted', " ").concat(defaultFontClass), children: children }));
    // at root, ThemeProvider already applied theme - skip re-wrapping
    // for portals/modals, we re-thread the theme so each root gets the right className setup
    if (isRootRoot) {
        return contents;
    }
    return ((0, jsx_runtime_1.jsx)(Theme_1.Theme, { passThrough: passThrough, contain: true, forceClassName: true, name: theme, children: contents }));
}
