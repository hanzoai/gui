"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServerSide = void 0;
exports.useForceUpdate = useForceUpdate;
var react_1 = require("react");
exports.isServerSide = process.env.TAMAGUI_TARGET === 'web' && typeof window === 'undefined';
var idFn = function () { };
function useForceUpdate() {
    return exports.isServerSide
        ? idFn
        : react_1.default.useReducer(function (x) { return Math.random(); }, 0)[1];
}
