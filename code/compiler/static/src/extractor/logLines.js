"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLines = void 0;
var prefix = '           ';
var logLines = function (str, singleLine) {
    if (singleLine === void 0) { singleLine = false; }
    if (singleLine) {
        return prefix + str.split(' ').join("\n".concat(prefix));
    }
    var lines = [''];
    var items = str.split(' ');
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (item.length + lines[lines.length - 1].length > 85) {
            lines.push('');
        }
        lines[lines.length - 1] += item + ' ';
    }
    return lines.map(function (line, i) { return prefix + (i == 0 ? '' : ' ') + line.trim(); }).join('\n');
};
exports.logLines = logLines;
