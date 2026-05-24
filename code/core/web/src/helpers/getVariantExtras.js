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
exports.getVariantExtras = void 0;
exports.getFontsForLanguage = getFontsForLanguage;
var config_1 = require("../config");
var createVariable_1 = require("../createVariable");
var cache = new WeakMap();
var getVariantExtras = function (styleState) {
    if (cache.has(styleState)) {
        return cache.get(styleState);
    }
    var props = styleState.props, conf = styleState.conf, context = styleState.context, theme = styleState.theme, styleProps = styleState.styleProps;
    var styledContext = styleProps.styledContext;
    var fonts = conf.fontsParsed;
    if (context === null || context === void 0 ? void 0 : context.language) {
        fonts = getFontsForLanguage(conf.fontsParsed, context.language);
    }
    var next = {
        fonts: fonts,
        tokens: conf.tokensParsed,
        theme: theme,
        context: styledContext,
        get fontFamily() {
            return ((0, createVariable_1.getVariableValue)(styleState.fontFamily || styleState.props.fontFamily) ||
                props.fontFamily ||
                (0, createVariable_1.getVariableValue)((0, config_1.getSetting)('defaultFont')));
        },
        get font() {
            return (fonts[this.fontFamily] ||
                (!props.fontFamily || props.fontFamily[0] === '$'
                    ? fonts[(0, config_1.getSetting)('defaultFont') || '']
                    : undefined));
        },
        props: props,
    };
    cache.set(styleState, next);
    return next;
};
exports.getVariantExtras = getVariantExtras;
var fontLanguageCache = new WeakMap();
function getFontsForLanguage(fonts, language) {
    if (fontLanguageCache.has(language)) {
        return fontLanguageCache.get(language);
    }
    var next = __assign(__assign({}, fonts), Object.fromEntries(Object.entries(language).flatMap(function (_a) {
        var name = _a[0], lang = _a[1];
        if (lang === 'default') {
            return [];
        }
        var langKey = "$".concat(name, "_").concat(lang);
        return [["$".concat(name), fonts[langKey]]];
    })));
    fontLanguageCache.set(language, next);
    return next;
}
