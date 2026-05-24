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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastImperativeProvider = exports.useToast = exports.useToastState = exports.useToastController = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var core_1 = require("@hanzogui/core");
var react_1 = require("react");
var createNativeToast_1 = require("./createNativeToast");
var ToastContext = react_1.default.createContext({});
var ToastCurrentContext = react_1.default.createContext(null);
var useToastController = function () {
    return react_1.default.useContext(ToastContext);
};
exports.useToastController = useToastController;
var useToastState = function () {
    return react_1.default.useContext(ToastCurrentContext);
};
exports.useToastState = useToastState;
/** @deprecated use `useToastController` and `useToastState` instead to avoid performance pitfalls */
var useToast = function () {
    return __assign(__assign({}, (0, exports.useToastController)()), { currentToast: (0, exports.useToastState)() });
};
exports.useToast = useToast;
var ToastImperativeProvider = function (_a) {
    var children = _a.children, options = _a.options;
    var counterRef = react_1.default.useRef(0);
    var _b = react_1.default.useState(null), toast = _b[0], setToast = _b[1];
    var _c = react_1.default.useState(null), lastNativeToastRef = _c[0], setLastNativeToastRef = _c[1];
    var show = react_1.default.useCallback(function (title, showOptions) {
        var _a, _b;
        var native = (_a = showOptions === null || showOptions === void 0 ? void 0 : showOptions.native) !== null && _a !== void 0 ? _a : options.native;
        var isWebNative = Array.isArray(native)
            ? native.includes('web')
            : native === 'web';
        var isMobileNative = Array.isArray(native)
            ? native.includes('mobile')
            : native === 'mobile';
        var isAndroidNative = isMobileNative ||
            (Array.isArray(native) ? native.includes('android') : native === 'android');
        var isIosNative = isMobileNative ||
            (Array.isArray(native) ? native.includes('ios') : native === 'ios');
        var isHandledNatively = native === true ||
            (core_1.isWeb && isWebNative) ||
            (!core_1.isWeb && isMobileNative) ||
            (core_1.isAndroid && isAndroidNative) ||
            (core_1.isIos && isIosNative);
        if (isHandledNatively) {
            var nativeToastResult = (0, createNativeToast_1.createNativeToast)(title, showOptions !== null && showOptions !== void 0 ? showOptions : {});
            if (typeof nativeToastResult === 'object' && nativeToastResult.nativeToastRef) {
                setLastNativeToastRef(nativeToastResult.nativeToastRef);
            }
        }
        counterRef.current++;
        setToast(__assign(__assign(__assign({}, showOptions === null || showOptions === void 0 ? void 0 : showOptions.customData), showOptions), { viewportName: (_b = showOptions === null || showOptions === void 0 ? void 0 : showOptions.viewportName) !== null && _b !== void 0 ? _b : 'default', title: title, id: counterRef.current.toString(), isHandledNatively: isHandledNatively }));
        return true;
    }, [setToast, JSON.stringify(options.native || null)]);
    var hide = react_1.default.useCallback(function () {
        lastNativeToastRef === null || lastNativeToastRef === void 0 ? void 0 : lastNativeToastRef.close();
        setToast(function (prev) {
            if (!prev)
                return null;
            return __assign(__assign({}, prev), { hide: true });
        });
        setTimeout(function () {
            setToast(null);
        }, 100);
    }, [setToast, lastNativeToastRef]);
    var contextValue = react_1.default.useMemo(function () {
        return {
            show: show,
            hide: hide,
            nativeToast: lastNativeToastRef,
            options: options,
        };
    }, [show, hide, lastNativeToastRef, JSON.stringify(options || null)]);
    return ((0, jsx_runtime_1.jsx)(ToastContext.Provider, { value: contextValue, children: (0, jsx_runtime_1.jsx)(ToastCurrentContext.Provider, { value: toast, children: children }) }));
};
exports.ToastImperativeProvider = ToastImperativeProvider;
