"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveViewZIndex = exports.getStackedZIndexProps = void 0;
var web_1 = require("@hanzogui/web");
var getStackedZIndexProps = function (propsIn) {
    return {
        stackZIndex: propsIn.stackZIndex,
        zIndex: (0, exports.resolveViewZIndex)(propsIn.zIndex),
    };
};
exports.getStackedZIndexProps = getStackedZIndexProps;
var resolveViewZIndex = function (zIndex) {
    return typeof zIndex === 'undefined'
        ? undefined
        : typeof zIndex === 'number'
            ? zIndex
            : (0, web_1.getTokenValue)(zIndex, 'zIndex');
};
exports.resolveViewZIndex = resolveViewZIndex;
