"use strict";
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
exports.FontLanguage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var FontLanguage = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            display: 'contents',
        }, className: Object.entries(props)
            .map(function (_a) {
            var name = _a[0], language = _a[1];
            return "t_lang-".concat(name, "-").concat(language);
        })
            .join(' '), children: children }));
};
exports.FontLanguage = FontLanguage;
exports.FontLanguage['displayName'] = 'FontLanguage';
