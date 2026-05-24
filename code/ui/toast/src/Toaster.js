"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toaster = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ToastComposable_1 = require("./ToastComposable");
exports.Toaster = React.forwardRef(function Toaster(props, ref) {
    var _a;
    var _b = props.position, position = _b === void 0 ? 'bottom-right' : _b, _c = props.expand, expand = _c === void 0 ? false : _c, visibleToasts = props.visibleToasts, gap = props.gap, duration = props.duration, offset = props.offset, hotkey = props.hotkey, swipeDirection = props.swipeDirection, swipeThreshold = props.swipeThreshold, closeButton = props.closeButton, theme = props.theme, icons = props.icons, toastOptions = props.toastOptions, _d = props.containerAriaLabel, containerAriaLabel = _d === void 0 ? 'Notifications' : _d, native = props.native, burntOptions = props.burntOptions, notificationOptions = props.notificationOptions, reducedMotion = props.reducedMotion;
    return ((0, jsx_runtime_1.jsx)(ToastComposable_1.Toast, { position: position, expand: expand, visibleToasts: visibleToasts, gap: gap, duration: (_a = toastOptions === null || toastOptions === void 0 ? void 0 : toastOptions.duration) !== null && _a !== void 0 ? _a : duration, swipeDirection: swipeDirection, swipeThreshold: swipeThreshold, closeButton: closeButton, theme: theme, icons: icons, native: native, burntOptions: burntOptions, notificationOptions: notificationOptions, reducedMotion: reducedMotion, children: (0, jsx_runtime_1.jsx)(ToastComposable_1.Toast.Viewport, { ref: ref, offset: offset, hotkey: hotkey, label: containerAriaLabel, children: (0, jsx_runtime_1.jsx)(ToastComposable_1.Toast.List, {}) }) }));
});
exports.Toaster.displayName = 'Toaster';
