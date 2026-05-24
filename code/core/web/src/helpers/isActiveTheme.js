"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActiveTheme = isActiveTheme;
function isActiveTheme(key, activeThemeName) {
    if (!key.startsWith('$theme-'))
        return;
    return key.slice(7).startsWith(activeThemeName);
}
