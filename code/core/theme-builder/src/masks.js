"use strict";
// copied from @hanzogui/themes
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
exports.masks = void 0;
var create_theme_1 = require("@hanzogui/create-theme");
exports.masks = {
    identity: (0, create_theme_1.createIdentityMask)(),
    soften: (0, create_theme_1.createSoftenMask)(),
    soften2: (0, create_theme_1.createSoftenMask)({ strength: 2 }),
    soften3: (0, create_theme_1.createSoftenMask)({ strength: 3 }),
    strengthen: (0, create_theme_1.createStrengthenMask)(),
    inverse: (0, create_theme_1.createInverseMask)(),
    inverseSoften: (0, create_theme_1.combineMasks)((0, create_theme_1.createInverseMask)(), (0, create_theme_1.createSoftenMask)({ strength: 2 })),
    inverseSoften2: (0, create_theme_1.combineMasks)((0, create_theme_1.createInverseMask)(), (0, create_theme_1.createSoftenMask)({ strength: 3 })),
    inverseSoften3: (0, create_theme_1.combineMasks)((0, create_theme_1.createInverseMask)(), (0, create_theme_1.createSoftenMask)({ strength: 4 })),
    inverseStrengthen2: (0, create_theme_1.combineMasks)((0, create_theme_1.createInverseMask)(), (0, create_theme_1.createStrengthenMask)({ strength: 2 })),
    strengthenButSoftenBorder: (0, create_theme_1.createMask)(function (template, options) {
        var stronger = (0, create_theme_1.createStrengthenMask)().mask(template, options);
        var softer = (0, create_theme_1.createSoftenMask)().mask(template, options);
        return __assign(__assign({}, stronger), { borderColor: softer.borderColor, borderColorHover: softer.borderColorHover, borderColorPress: softer.borderColorPress, borderColorFocus: softer.borderColorFocus });
    }),
    soften2Border1: (0, create_theme_1.createMask)(function (template, options) {
        var softer2 = (0, create_theme_1.createSoftenMask)({ strength: 2 }).mask(template, options);
        var softer1 = (0, create_theme_1.createSoftenMask)({ strength: 1 }).mask(template, options);
        return __assign(__assign({}, softer2), { borderColor: softer1.borderColor, borderColorHover: softer1.borderColorHover, borderColorPress: softer1.borderColorPress, borderColorFocus: softer1.borderColorFocus });
    }),
    soften3FlatBorder: (0, create_theme_1.createMask)(function (template, options) {
        var borderMask = (0, create_theme_1.createSoftenMask)({ strength: 2 }).mask(template, options);
        var softer3 = (0, create_theme_1.createSoftenMask)({ strength: 3 }).mask(template, options);
        return __assign(__assign({}, softer3), { borderColor: borderMask.borderColor, borderColorHover: borderMask.borderColorHover, borderColorPress: borderMask.borderColorPress, borderColorFocus: borderMask.borderColorFocus });
    }),
    softenBorder: (0, create_theme_1.createMask)(function (template, options) {
        var plain = create_theme_1.skipMask.mask(template, options);
        var softer = (0, create_theme_1.createSoftenMask)().mask(template, options);
        return __assign(__assign({}, plain), { borderColor: softer.borderColor, borderColorHover: softer.borderColorHover, borderColorPress: softer.borderColorPress, borderColorFocus: softer.borderColorFocus });
    }),
    softenBorder2: (0, create_theme_1.createMask)(function (template, options) {
        var plain = create_theme_1.skipMask.mask(template, options);
        var softer = (0, create_theme_1.createSoftenMask)({ strength: 2 }).mask(template, options);
        return __assign(__assign({}, plain), { borderColor: softer.borderColor, borderColorHover: softer.borderColorHover, borderColorPress: softer.borderColorPress, borderColorFocus: softer.borderColorFocus });
    }),
};
