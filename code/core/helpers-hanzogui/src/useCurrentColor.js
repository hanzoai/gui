"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentColor = void 0;
var web_1 = require("@hanzogui/web");
var useCurrentColor = function (colorProp) {
    var _a, _b;
    var theme = (0, web_1.useTheme)();
    var out = colorProp
        ? (0, web_1.getVariable)(colorProp)
        : ((_a = theme[colorProp]) === null || _a === void 0 ? void 0 : _a.get()) || ((_b = theme.color) === null || _b === void 0 ? void 0 : _b.get());
    return out;
};
exports.useCurrentColor = useCurrentColor;
