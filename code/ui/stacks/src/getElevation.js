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
exports.getSizedElevation = exports.getElevation = void 0;
var core_1 = require("@hanzogui/core");
var getElevation = function (size, extras) {
    if (!size)
        return;
    var tokens = extras.tokens;
    var token = tokens.size[size];
    var sizeNum = ((0, core_1.isVariable)(token) ? +token.val : size);
    return (0, exports.getSizedElevation)(sizeNum, extras);
};
exports.getElevation = getElevation;
var getSizedElevation = function (val, _a) {
    var theme = _a.theme, tokens = _a.tokens;
    var num = 0;
    if (val === true) {
        var val_1 = (0, core_1.getVariableValue)(tokens.size['true']);
        if (typeof val_1 === 'number') {
            num = val_1;
        }
        else {
            num = 10;
        }
    }
    else {
        num = +val;
    }
    if (num === 0) {
        return;
    }
    var _b = [Math.round(num / 4 + 1), Math.round(num / 2 + 2)], height = _b[0], shadowRadius = _b[1];
    var shadow = __assign({ shadowColor: theme.shadowColor, shadowRadius: shadowRadius, shadowOffset: { height: height, width: 0 } }, (core_1.isAndroid
        ? {
            elevationAndroid: 2 * height,
        }
        : {}));
    return shadow;
};
exports.getSizedElevation = getSizedElevation;
