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
exports.setThemeInfo = exports.getThemeInfo = void 0;
var THEME_INFO = new Map();
var getThemeInfo = function (theme, name) {
    return THEME_INFO.get(name || JSON.stringify(theme));
};
exports.getThemeInfo = getThemeInfo;
var setThemeInfo = function (theme, info) {
    var next = __assign(__assign({}, info), { cache: new Map() });
    THEME_INFO.set(info.name || JSON.stringify(theme), next);
    THEME_INFO.set(JSON.stringify(info.definition), next);
};
exports.setThemeInfo = setThemeInfo;
