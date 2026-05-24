"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElementProps = void 0;
var setupHooks_1 = require("../setupHooks");
var setElementProps = function (node) {
    var _a;
    (_a = setupHooks_1.hooks.setElementProps) === null || _a === void 0 ? void 0 : _a.call(setupHooks_1.hooks, node);
};
exports.setElementProps = setElementProps;
