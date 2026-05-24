"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrefixLogs = getPrefixLogs;
var cli_color_1 = require("@hanzogui/cli-color");
function getPrefixLogs(options) {
    var _a;
    return ((_a = options === null || options === void 0 ? void 0 : options.prefixLogs) !== null && _a !== void 0 ? _a : " \uD83D\uDC25 [hanzogui]  ".concat((0, cli_color_1.colorString)(cli_color_1.Color.FgYellow, (options === null || options === void 0 ? void 0 : options.platform) || 'web')));
}
