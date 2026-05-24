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
exports.applyMask = applyMask;
exports.applyMaskStateless = applyMaskStateless;
var createTheme_1 = require("./createTheme");
var themeInfo_1 = require("./themeInfo");
function applyMask(theme, mask, options, parentName, nextName) {
    if (options === void 0) { options = {}; }
    var info = (0, themeInfo_1.getThemeInfo)(theme, parentName);
    if (!info) {
        throw new Error(process.env.NODE_ENV !== 'production'
            ? "No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme"
            : "\u274C Err2");
    }
    var next = applyMaskStateless(info, mask, options, parentName);
    (0, themeInfo_1.setThemeInfo)(next.theme, {
        definition: next.definition,
        palette: info.palette,
        name: nextName,
    });
    return next.theme;
}
function applyMaskStateless(info, mask, options, parentName) {
    var _a;
    if (options === void 0) { options = {}; }
    var skip = __assign({}, options.skip);
    // skip nonInheritedValues from parent theme
    if ((_a = info.options) === null || _a === void 0 ? void 0 : _a.nonInheritedValues) {
        for (var key in info.options.nonInheritedValues) {
            skip[key] = 1;
        }
    }
    // convert theme back to template first
    var maskOptions = __assign(__assign({ parentName: parentName, palette: info.palette }, options), { skip: skip });
    var template = mask.mask(info.definition, maskOptions);
    var theme = (0, createTheme_1.createTheme)(info.palette, template);
    return __assign(__assign({}, info), { cache: new Map(), definition: template, theme: theme });
}
