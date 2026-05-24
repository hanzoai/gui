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
exports.useToastProviderContext = exports.useCollection = exports.ToastProvider = exports.Collection = void 0;
exports.ReprogapateToastProvider = ReprogapateToastProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var collection_1 = require("@hanzogui/collection");
var core_1 = require("@hanzogui/core");
var start_transition_1 = require("@hanzogui/start-transition");
var React = require("react");
var constants_1 = require("./constants");
var ToastImperative_1 = require("./ToastImperative");
/* -------------------------------------------------------------------------------------------------
 * ToastProvider
 * -----------------------------------------------------------------------------------------------*/
var PROVIDER_NAME = 'ToastProvider';
var _a = (0, collection_1.createCollection)('Toast'), Collection = _a[0], useCollection = _a[1];
exports.Collection = Collection;
exports.useCollection = useCollection;
var _b = (0, core_1.createStyledContext)(
// since we always provide this we can avoid setting here
{}, 'Toast__'), ToastProviderProvider = _b.Provider, useToastProviderContext = _b.useStyledContext;
exports.useToastProviderContext = useToastProviderContext;
var ToastProvider = function (props) {
    var _a = props.scope, scope = _a === void 0 ? constants_1.TOAST_CONTEXT : _a, providedId = props.id, burntOptions = props.burntOptions, native = props.native, notificationOptions = props.notificationOptions, _b = props.label, label = _b === void 0 ? 'Notification' : _b, _c = props.duration, duration = _c === void 0 ? 5000 : _c, _d = props.swipeDirection, swipeDirection = _d === void 0 ? 'right' : _d, _e = props.swipeThreshold, swipeThreshold = _e === void 0 ? 50 : _e, children = props.children;
    var backupId = React.useId();
    var id = providedId !== null && providedId !== void 0 ? providedId : backupId;
    var _f = React.useState({}), viewports = _f[0], setViewports = _f[1];
    var _g = React.useState(0), toastCount = _g[0], setToastCount = _g[1];
    var isFocusedToastEscapeKeyDownRef = React.useRef(false);
    var isClosePausedRef = React.useRef(false);
    var handleViewportChange = React.useCallback(function (name, viewport) {
        (0, start_transition_1.startTransition)(function () {
            setViewports(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = viewport, _a)));
            });
        });
    }, []);
    // memo context to avoid expensive re-renders
    var options = React.useMemo(function () {
        return {
            duration: duration,
            burntOptions: burntOptions,
            native: native,
            notificationOptions: notificationOptions,
        };
        // nested simple object so JSON.stringify
    }, [JSON.stringify([duration, burntOptions, native, notificationOptions])]);
    return ((0, jsx_runtime_1.jsx)(Collection.Provider, { scope: scope, children: (0, jsx_runtime_1.jsx)(ToastProviderProvider, { scope: scope, id: id, label: label, duration: duration, swipeDirection: swipeDirection, swipeThreshold: swipeThreshold, toastCount: toastCount, viewports: viewports, onViewportChange: handleViewportChange, onToastAdd: React.useCallback(function () {
                (0, start_transition_1.startTransition)(function () {
                    setToastCount(function (prevCount) { return prevCount + 1; });
                });
            }, []), onToastRemove: React.useCallback(function () {
                (0, start_transition_1.startTransition)(function () {
                    setToastCount(function (prevCount) { return prevCount - 1; });
                });
            }, []), isFocusedToastEscapeKeyDownRef: isFocusedToastEscapeKeyDownRef, isClosePausedRef: isClosePausedRef, options: options, children: (0, jsx_runtime_1.jsx)(ToastImperative_1.ToastImperativeProvider, { options: options, children: children }) }) }));
};
exports.ToastProvider = ToastProvider;
function ReprogapateToastProvider(props) {
    var children = props.children, context = props.context;
    return ((0, jsx_runtime_1.jsx)(Collection.Provider, { scope: context.toastScope, children: (0, jsx_runtime_1.jsx)(ToastProviderProvider, __assign({}, context, { children: (0, jsx_runtime_1.jsx)(ToastImperative_1.ToastImperativeProvider, { options: context.options, children: children }) })) }));
}
ToastProvider.propTypes = {
    label: function (props) {
        if (props.label && typeof props.label === 'string' && !props.label.trim()) {
            var error = "Invalid prop `label` supplied to `".concat(PROVIDER_NAME, "`. Expected non-empty `string`.");
            return new Error(error);
        }
        return null;
    },
};
ToastProvider.displayName = PROVIDER_NAME;
