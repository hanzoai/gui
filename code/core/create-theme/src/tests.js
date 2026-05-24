"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applyMask_1 = require("./applyMask");
var createTheme_1 = require("./createTheme");
var masks_1 = require("./masks");
// --- tests ---
if (process.env.NODE_ENV === 'development') {
    var palette = ['0', '1', '2', '3', '-3', '-2', '-1', '-0'];
    var template = { bg: 1, fg: -1 };
    var stongerMask = (0, masks_1.createStrengthenMask)();
    var weakerMask = (0, masks_1.createWeakenMask)();
    var theme = (0, createTheme_1.createTheme)(palette, template);
    if (theme.bg !== '1')
        throw "\u274C";
    if (theme.fg !== '-1')
        throw "\u274C";
    var str = (0, applyMask_1.applyMask)(theme, stongerMask);
    if (str.bg !== '0')
        throw "\u274C";
    if (str.fg !== '-0')
        throw "\u274C";
    var weak = (0, applyMask_1.applyMask)(theme, weakerMask);
    if (weak.bg !== '2')
        throw "\u274C";
    if (weak.fg !== '-2')
        throw "\u274C";
    var weak2 = (0, applyMask_1.applyMask)(theme, weakerMask, { strength: 2 });
    if (weak2.bg !== '3')
        throw "\u274C";
    if (weak2.fg !== '-3')
        throw "\u274C";
}
