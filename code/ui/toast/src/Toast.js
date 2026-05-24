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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToastState = exports.useToastController = exports.useToast = exports.ToastViewport = exports.ToastProvider = exports.Toast = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var animate_presence_1 = require("@hanzogui/animate-presence");
var core_1 = require("@hanzogui/core");
var helpers_1 = require("@hanzogui/helpers");
var stacks_1 = require("@hanzogui/stacks");
var text_1 = require("@hanzogui/text");
var use_controllable_state_1 = require("@hanzogui/use-controllable-state");
var React = require("react");
var ToastAnnounce_1 = require("./ToastAnnounce");
var ToastImperative_1 = require("./ToastImperative");
Object.defineProperty(exports, "useToast", { enumerable: true, get: function () { return ToastImperative_1.useToast; } });
Object.defineProperty(exports, "useToastController", { enumerable: true, get: function () { return ToastImperative_1.useToastController; } });
Object.defineProperty(exports, "useToastState", { enumerable: true, get: function () { return ToastImperative_1.useToastState; } });
var ToastImpl_1 = require("./ToastImpl");
var ToastProvider_1 = require("./ToastProvider");
Object.defineProperty(exports, "ToastProvider", { enumerable: true, get: function () { return ToastProvider_1.ToastProvider; } });
var ToastViewport_1 = require("./ToastViewport");
Object.defineProperty(exports, "ToastViewport", { enumerable: true, get: function () { return ToastViewport_1.ToastViewport; } });
/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/
var TITLE_NAME = 'ToastTitle';
var ToastTitle = (0, core_1.styled)(text_1.SizableText, {
    name: TITLE_NAME,
    variants: {
        unstyled: {
            false: {
                color: '$color',
                size: '$4',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/
var DESCRIPTION_NAME = 'ToastDescription';
var ToastDescription = (0, core_1.styled)(text_1.SizableText, {
    name: DESCRIPTION_NAME,
    variants: {
        unstyled: {
            false: {
                color: '$color11',
                size: '$1',
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/
var ACTION_NAME = 'ToastAction';
var ToastAction = React.forwardRef(function ToastAction(props, forwardedRef) {
    var altText = props.altText, actionProps = __rest(props, ["altText"]);
    if (!altText)
        return null;
    return ((0, jsx_runtime_1.jsx)(ToastAnnounce_1.ToastAnnounceExclude, { altText: altText, asChild: true, children: (0, jsx_runtime_1.jsx)(ToastClose, __assign({}, actionProps, { ref: forwardedRef })) }));
});
ToastAction.propTypes = {
    altText: function (props) {
        if (!props.altText) {
            return new Error("Missing prop `altText` expected on `".concat(ACTION_NAME, "`"));
        }
        return null;
    },
};
/* -------------------------------------------------------------------------------------------------
 * ToastClose
 * -----------------------------------------------------------------------------------------------*/
var CLOSE_NAME = 'ToastClose';
var ToastCloseFrame = (0, core_1.styled)(stacks_1.YStack, {
    name: CLOSE_NAME,
    render: 'button',
});
var ToastClose = React.forwardRef(function ToastClose(props, forwardedRef) {
    var scope = props.scope, closeProps = __rest(props, ["scope"]);
    var interactiveContext = (0, ToastImpl_1.useToastInteractiveContext)(scope);
    return ((0, jsx_runtime_1.jsx)(ToastAnnounce_1.ToastAnnounceExclude, { asChild: true, children: (0, jsx_runtime_1.jsx)(ToastCloseFrame, __assign({ "aria-label": "Close" }, closeProps, { ref: forwardedRef, onPress: (0, helpers_1.composeEventHandlers)(props.onPress, interactiveContext.onClose) })) }));
});
/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/
var ToastComponent = ToastImpl_1.ToastImplFrame.styleable(function Toast(props, forwardedRef) {
    var forceMount = props.forceMount, openProp = props.open, defaultOpen = props.defaultOpen, onOpenChange = props.onOpenChange, toastProps = __rest(props, ["forceMount", "open", "defaultOpen", "onOpenChange"]);
    var _a = (0, use_controllable_state_1.useControllableState)({
        prop: openProp,
        defaultProp: defaultOpen !== null && defaultOpen !== void 0 ? defaultOpen : true,
        onChange: onOpenChange,
        strategy: 'most-recent-wins',
    }), open = _a[0], setOpen = _a[1];
    var currentToast = (0, ToastImperative_1.useToastState)();
    var hide = (0, ToastImperative_1.useToastController)().hide;
    var id = React.useId();
    var onPause = (0, core_1.useEvent)(props.onPause);
    var onResume = (0, core_1.useEvent)(props.onResume);
    var isHide = (currentToast === null || currentToast === void 0 ? void 0 : currentToast.hide) === true;
    var shouldShow = (forceMount || open) && !isHide;
    return ((0, jsx_runtime_1.jsx)(animate_presence_1.AnimatePresence, { children: shouldShow ? ((0, jsx_runtime_1.jsx)(ToastImpl_1.ToastImpl, __assign({ id: id, open: open }, toastProps, { ref: forwardedRef, onClose: function () {
                setOpen(false);
                hide();
            }, onPause: onPause, onResume: onResume, onSwipeEnd: (0, helpers_1.composeEventHandlers)(props.onSwipeEnd, function (event) {
                setOpen(false);
            }) }))) : null }, id));
});
var Toast = (0, helpers_1.withStaticProperties)(ToastComponent, {
    Title: ToastTitle,
    Description: ToastDescription,
    Action: ToastAction,
    Close: ToastClose,
});
exports.Toast = Toast;
