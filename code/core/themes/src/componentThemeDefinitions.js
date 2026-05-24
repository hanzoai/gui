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
exports.componentThemeDefinitions = exports.overlayThemeDefinitions = void 0;
var templates_1 = require("./templates");
var overlayThemes = {
    light: {
        background: 'rgba(0,0,0,0.5)',
    },
    dark: {
        background: 'rgba(0,0,0,0.9)',
    },
};
exports.overlayThemeDefinitions = [
    {
        parent: 'light',
        theme: overlayThemes.light,
    },
    {
        parent: 'dark',
        theme: overlayThemes.dark,
    },
];
exports.componentThemeDefinitions = {
    ListItem: [
        __assign({ parent: 'light', mask: 'strengthen' }, templates_1.maskOptions.component),
        __assign({ parent: 'dark', mask: 'identity' }, templates_1.maskOptions.component),
    ],
    Card: __assign({ mask: 'soften' }, templates_1.maskOptions.component),
    Button: __assign({ mask: 'soften2' }, templates_1.maskOptions.button),
    Checkbox: __assign({ mask: 'softenBorder2' }, templates_1.maskOptions.component),
    Switch: __assign({ mask: 'soften2' }, templates_1.maskOptions.component),
    SwitchThumb: __assign({ mask: 'inverseStrengthen2' }, templates_1.maskOptions.component),
    TooltipContent: __assign({ mask: 'soften2' }, templates_1.maskOptions.component),
    DrawerFrame: __assign({ mask: 'soften' }, templates_1.maskOptions.component),
    Progress: __assign({ mask: 'soften' }, templates_1.maskOptions.component),
    RadioGroupItem: __assign({ mask: 'softenBorder2' }, templates_1.maskOptions.component),
    TooltipArrow: __assign({ mask: 'soften' }, templates_1.maskOptions.component),
    SliderTrackActive: __assign({ mask: 'inverseSoften' }, templates_1.maskOptions.component),
    SliderTrack: __assign({ mask: 'soften2' }, templates_1.maskOptions.component),
    SliderThumb: __assign({ mask: 'inverse' }, templates_1.maskOptions.component),
    Tooltip: __assign({ mask: 'inverse' }, templates_1.maskOptions.component),
    ProgressIndicator: __assign({ mask: 'inverse' }, templates_1.maskOptions.component),
    SheetOverlay: exports.overlayThemeDefinitions,
    DialogOverlay: exports.overlayThemeDefinitions,
    ModalOverlay: exports.overlayThemeDefinitions,
    Input: __assign({ mask: 'softenBorder2' }, templates_1.maskOptions.component),
    TextArea: __assign({ mask: 'softenBorder2' }, templates_1.maskOptions.component),
};
