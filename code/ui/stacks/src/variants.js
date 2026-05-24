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
exports.circular = exports.bordered = exports.elevate = void 0;
var getElevation_1 = require("./getElevation");
exports.elevate = {
    true: function (_, extras) {
        return (0, getElevation_1.getElevation)(extras.props['size'], extras);
    },
};
var bordered = function (val, _a) {
    var props = _a.props;
    return {
        // TODO size it with size in '...size'
        borderWidth: typeof val === 'number' ? val : 1,
        borderColor: '$borderColor',
    };
};
exports.bordered = bordered;
var circularStyle = {
    borderRadius: 100000,
    padding: 0,
};
exports.circular = {
    true: function (_, _a) {
        var props = _a.props, tokens = _a.tokens;
        if (!('size' in props)) {
            return circularStyle;
        }
        var size = typeof props.size === 'number' ? props.size : tokens.size[props.size];
        return __assign(__assign({}, circularStyle), { width: size, height: size, maxWidth: size, maxHeight: size, minWidth: size, minHeight: size });
    },
};
