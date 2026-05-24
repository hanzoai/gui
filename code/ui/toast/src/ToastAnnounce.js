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
exports.ToastAnnounceExclude = exports.ToastAnnounce = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var portal_1 = require("@hanzogui/portal");
var start_transition_1 = require("@hanzogui/start-transition");
var visually_hidden_1 = require("@hanzogui/visually-hidden");
var React = require("react");
var ToastProvider_1 = require("./ToastProvider");
var ToastAnnounceExcludeFrame = (0, core_1.styled)(core_1.View, {
    name: 'ToastAnnounceExclude',
});
var ToastAnnounceExclude = React.forwardRef(function (props, forwardedRef) {
    var altText = props.altText, announceExcludeProps = __rest(props, ["altText"]);
    return ((0, jsx_runtime_1.jsx)(ToastAnnounceExcludeFrame, __assign({ "data-toast-announce-exclude": "", "data-toast-announce-alt": altText || undefined }, announceExcludeProps, { ref: forwardedRef })));
});
exports.ToastAnnounceExclude = ToastAnnounceExclude;
var ToastAnnounce = function (props) {
    var scope = props.scope, children = props.children, announceProps = __rest(props, ["scope", "children"]);
    var context = (0, ToastProvider_1.useToastProviderContext)(scope);
    var _a = React.useState(false), renderAnnounceText = _a[0], setRenderAnnounceText = _a[1];
    var _b = React.useState(false), isAnnounced = _b[0], setIsAnnounced = _b[1];
    // render text content in the next frame to ensure toast is announced in NVDA
    useNextFrame(function () {
        (0, start_transition_1.startTransition)(function () {
            setRenderAnnounceText(true);
        });
    });
    // cleanup after announcing
    React.useEffect(function () {
        var timer = setTimeout(function () { return setIsAnnounced(true); }, 1000);
        return function () { return clearTimeout(timer); };
    }, []);
    return isAnnounced ? null : ((0, jsx_runtime_1.jsx)(portal_1.Portal, { children: (0, jsx_runtime_1.jsx)(visually_hidden_1.VisuallyHidden, __assign({}, announceProps, { children: renderAnnounceText && ((0, jsx_runtime_1.jsxs)(core_1.Text, { children: [context.label, " ", children] })) })) }));
};
exports.ToastAnnounce = ToastAnnounce;
/* -----------------------------------------------------------------------------------------------*/
function useNextFrame(callback) {
    if (callback === void 0) { callback = function () { }; }
    var fn = (0, core_1.useEvent)(callback);
    (0, constants_1.useIsomorphicLayoutEffect)(function () {
        var raf1 = 0;
        var raf2 = 0;
        raf1 = requestAnimationFrame(function () {
            raf2 = requestAnimationFrame(fn);
        });
        return function () {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, [fn]);
}
