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
exports.getIcon = void 0;
var react_1 = require("react");
var getIcon = function (el, props) {
    if (!el)
        return el;
    if (react_1.default.isValidElement(el)) {
        return react_1.default.cloneElement(el, __assign(__assign({}, props), el.props));
    }
    return react_1.default.createElement(el, props);
};
exports.getIcon = getIcon;
