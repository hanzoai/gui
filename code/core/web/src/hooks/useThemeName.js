"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeName = useThemeName;
var useThemeState_1 = require("./useThemeState");
// can probably simplify this way down
var forceUpdateState = { forceClassName: true, deopt: true, needsUpdate: function () { return true; } };
var forceKeys = { current: new Set(['']) };
function useThemeName() {
    var _a;
    return ((_a = (0, useThemeState_1.useThemeState)(forceUpdateState, false, forceKeys)) === null || _a === void 0 ? void 0 : _a.name) || '';
}
