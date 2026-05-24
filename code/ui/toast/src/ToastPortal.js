"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastPortal = ToastPortal;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var portal_1 = require("@hanzogui/portal");
var ToastProvider_1 = require("./ToastProvider");
function ToastPortal(props) {
    var context = props.context, children = props.children, zIndex = props.zIndex;
    var content = children;
    if (!constants_1.isWeb) {
        content = ((0, jsx_runtime_1.jsx)(ToastProvider_1.ReprogapateToastProvider, { context: context, children: children }));
    }
    return (0, jsx_runtime_1.jsx)(portal_1.Portal, { zIndex: zIndex || Number.MAX_SAFE_INTEGER, children: content });
}
