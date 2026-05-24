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
exports.useGetThemedIcon = void 0;
var react_1 = require("react");
var useCurrentColor_1 = require("./useCurrentColor");
var useGetThemedIcon = function (props) {
    var color = (0, useCurrentColor_1.useCurrentColor)(props.color);
    return function (el) {
        if (!el)
            return el;
        if (react_1.default.isValidElement(el)) {
            return react_1.default.cloneElement(el, __assign(__assign(__assign({}, props), { color: color }), el.props));
        }
        return react_1.default.createElement(el, props);
    };
};
exports.useGetThemedIcon = useGetThemedIcon;
