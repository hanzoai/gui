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
exports.defaultTemplates = void 0;
var helpers_1 = require("./helpers");
var getTemplates = function () {
    var lightTemplates = getBaseTemplates('light');
    var darkTemplates = getBaseTemplates('dark');
    var templates = __assign(__assign({}, (0, helpers_1.objectFromEntries)((0, helpers_1.objectKeys)(lightTemplates).map(function (name) { return ["light_".concat(name), lightTemplates[name]]; }))), (0, helpers_1.objectFromEntries)((0, helpers_1.objectKeys)(darkTemplates).map(function (name) { return ["dark_".concat(name), darkTemplates[name]]; })));
    return templates;
};
var getBaseTemplates = function (scheme) {
    var isLight = scheme === 'light';
    // our palettes have 4 things padding each end until you get to bg/color:
    // [accentBg, transparent1, transparent2, transparent3, transparent4, background, ...]
    var bgIndex = 6;
    var lighten = isLight ? -1 : 1;
    var darken = -lighten;
    // always +1 because palette is structured with higher indices = more contrast from background
    var increaseContrast = 1;
    var borderColor = bgIndex + 3;
    var baseColors = {
        color: -bgIndex,
        colorHover: -bgIndex - 1,
        colorPress: -bgIndex,
        colorFocus: -bgIndex - 1,
        placeholderColor: -bgIndex - 3,
        outlineColor: -2,
    };
    // templates use the palette and specify index
    // negative goes backwards from end so -1 is the last item
    var base = __assign(__assign({ accentBackground: 0, accentColor: -0, background0: 1, background02: 2, background04: 3, background06: 4, background08: 5, color1: bgIndex, color2: bgIndex + 1, color3: bgIndex + 2, color4: bgIndex + 3, color5: bgIndex + 4, color6: bgIndex + 5, color7: bgIndex + 6, color8: bgIndex + 7, color9: bgIndex + 8, color10: bgIndex + 9, color11: bgIndex + 10, color12: bgIndex + 11, color0: -1, color02: -2, color04: -3, color06: -4, color08: -5, 
        // the background, color, etc keys here work like generics - they make it so you
        // can publish components for others to use without mandating a specific color scale
        // the @hanzogui/button Button component looks for `$background`, so you set the
        // dark_red_Button theme to have a stronger background than the dark_red theme.
        background: bgIndex, backgroundHover: bgIndex + increaseContrast * 2, backgroundPress: bgIndex + increaseContrast * 3, backgroundFocus: bgIndex + increaseContrast * 2, borderColor: borderColor, borderColorHover: borderColor + lighten, borderColorPress: borderColor + darken, borderColorFocus: borderColor }, baseColors), { colorTransparent: -1 });
    var surface1 = __assign(__assign({}, baseColors), { background: base.background + 1, backgroundHover: base.backgroundHover + 1, backgroundPress: base.backgroundPress + 1, backgroundFocus: base.backgroundFocus + 1, backgroundActive: base.background + 1, borderColor: base.borderColor + 1, borderColorHover: base.borderColorHover + 1, borderColorFocus: base.borderColorFocus + 1, borderColorPress: base.borderColorPress + 1 });
    var surface2 = __assign(__assign({}, baseColors), { background: base.background + 2, backgroundHover: base.backgroundHover + 2, backgroundPress: base.backgroundPress + 2, backgroundFocus: base.backgroundFocus + 2, backgroundActive: base.background + 2, borderColor: base.borderColor + 2, borderColorHover: base.borderColorHover + 2, borderColorFocus: base.borderColorFocus + 2, borderColorPress: base.borderColorPress + 2 });
    var surface3 = __assign(__assign({}, baseColors), { background: base.background + 3, backgroundHover: base.backgroundHover + 3, backgroundPress: base.backgroundPress + 3, backgroundFocus: base.backgroundFocus + 3, backgroundActive: base.background + 3, borderColor: base.borderColor + 3, borderColorHover: base.borderColorHover + 3, borderColorFocus: base.borderColorFocus + 3, borderColorPress: base.borderColorPress + 3 });
    var alt1 = {
        color: base.color - 1,
        colorHover: base.colorHover - 1,
        colorPress: base.colorPress - 1,
        colorFocus: base.colorFocus - 1,
    };
    var alt2 = {
        color: base.color - 2,
        colorHover: base.colorHover - 2,
        colorPress: base.colorPress - 2,
        colorFocus: base.colorFocus - 2,
    };
    var inverse = Object.fromEntries(Object.entries(base).map(function (_a) {
        var key = _a[0], index = _a[1];
        return [key, -index];
    }));
    return {
        base: base,
        surface1: surface1,
        surface2: surface2,
        surface3: surface3,
        alt1: alt1,
        alt2: alt2,
        inverse: inverse,
    };
};
exports.defaultTemplates = getTemplates();
