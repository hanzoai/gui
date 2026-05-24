"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyThemesToParents = proxyThemesToParents;
exports.proxyThemeToParents = proxyThemeToParents;
var themesRaw = {};
// this seems expensive but its necessary to do two loops unless we want to refactor a variety of things again
// not *too* much work but not a big cost doing the two loops
function proxyThemesToParents(dedupedThemes) {
    // fill it in so we can look it up next
    for (var _i = 0, dedupedThemes_1 = dedupedThemes; _i < dedupedThemes_1.length; _i++) {
        var _a = dedupedThemes_1[_i], names = _a.names, theme = _a.theme;
        for (var _b = 0, names_1 = names; _b < names_1.length; _b++) {
            var name_1 = names_1[_b];
            themesRaw[name_1] = theme;
        }
    }
    var themes = {};
    // now go back and re-fill it in
    // we do have to call this once per non-duplicated theme!
    // because they could have different parent chains
    // despite being the same theme
    for (var _c = 0, dedupedThemes_2 = dedupedThemes; _c < dedupedThemes_2.length; _c++) {
        var _d = dedupedThemes_2[_c], names = _d.names, theme = _d.theme;
        for (var _e = 0, names_2 = names; _e < names_2.length; _e++) {
            var themeName = names_2[_e];
            var proxiedTheme = proxyThemeToParents(themeName, theme);
            themes[themeName] = proxiedTheme;
        }
    }
    return themes;
}
function proxyThemeToParents(themeName, theme) {
    var out = {};
    var cur = [];
    // if theme is dark_blue_alt1_Button
    // this will be the parent names in order: ['dark', 'dark_blue', 'dark_blue_alt1"]
    var parents = themeName
        .split('_')
        .slice(0, -1)
        .map(function (part) {
        cur.push(part);
        return cur.join('_');
    });
    for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
        var parent_1 = parents_1[_i];
        Object.assign(out, themesRaw[parent_1]);
    }
    Object.assign(out, theme);
    return out;
}
