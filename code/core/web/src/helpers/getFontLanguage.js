"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontLanguage = void 0;
var getFontLanguage = function (fontFamily) {
    return fontFamily.includes('_') ? fontFamily.split('_')[1] : null;
};
exports.getFontLanguage = getFontLanguage;
