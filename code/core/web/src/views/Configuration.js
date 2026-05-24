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
exports.Configuration = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var use_did_finish_ssr_1 = require("@hanzogui/use-did-finish-ssr");
var react_1 = require("react");
var ComponentContext_1 = require("../contexts/ComponentContext");
var Configuration = function (props) {
    var _a;
    var current = react_1.default.useContext(ComponentContext_1.ComponentContext);
    return ((0, jsx_runtime_1.jsx)(use_did_finish_ssr_1.ClientOnly, { enabled: (_a = props.disableSSR) !== null && _a !== void 0 ? _a : current.disableSSR, children: (0, jsx_runtime_1.jsx)(ComponentContext_1.ComponentContext.Provider, __assign({}, current, props)) }));
};
exports.Configuration = Configuration;
