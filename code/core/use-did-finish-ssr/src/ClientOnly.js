"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientOnly = exports.ClientOnlyContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
exports.ClientOnlyContext = (0, react_1.createContext)(false);
var ClientOnly = function (_a) {
    var children = _a.children, enabled = _a.enabled;
    var existingValue = (0, react_1.useContext)(exports.ClientOnlyContext);
    return ((0, jsx_runtime_1.jsx)(exports.ClientOnlyContext.Provider, { value: enabled !== null && enabled !== void 0 ? enabled : existingValue, children: children }));
};
exports.ClientOnly = ClientOnly;
