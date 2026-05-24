"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTransition = void 0;
var react_1 = require("react");
var startTransition = function (callback) {
    if (process.env.TAMAGUI_TARGET !== 'web') {
        // Pass-through function
        callback();
    }
    else {
        // Proxy to react.startTransition
        (0, react_1.startTransition)(callback);
    }
};
exports.startTransition = startTransition;
