"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var core_1 = require("@hanzogui/core");
var native_1 = require("@hanzogui/native");
var z_index_stack_1 = require("@hanzogui/z-index-stack");
var GorhomPortalItem_1 = require("./GorhomPortalItem");
var helpers_1 = require("./helpers");
var Portal = function (propsIn) {
    var zIndex = (0, z_index_stack_1.useStackedZIndex)((0, helpers_1.getStackedZIndexProps)(propsIn));
    var children = propsIn.children, passThrough = propsIn.passThrough;
    var contents = ((0, jsx_runtime_1.jsx)(core_1.View, { pointerEvents: "box-none", position: "absolute", inset: 0, maxWidth: "100%", zIndex: zIndex, passThrough: passThrough, children: children }));
    var portalState = (0, native_1.getPortal)().state;
    // use teleport if available (best option - preserves context)
    if (portalState.type === 'teleport') {
        return (0, jsx_runtime_1.jsx)(native_1.NativePortal, { hostName: "root", children: contents });
    }
    // fall back to Gorhom portal system (JS-based, needs context re-propagation)
    return ((0, jsx_runtime_1.jsx)(GorhomPortalItem_1.GorhomPortalItem, { passThrough: passThrough, hostName: "root", children: contents }));
};
exports.Portal = Portal;
