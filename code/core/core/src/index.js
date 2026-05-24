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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.Text = exports.View = exports.createHanzogui = exports.HanzoguiProvider = exports.setOnLayoutStrategy = exports.registerLayoutNode = exports.LayoutMeasurementController = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// re-exports all of @hanzogui/web just adds hooks
__exportStar(require("@hanzogui/web"), exports);
var react_native_media_driver_1 = require("@hanzogui/react-native-media-driver");
var constants_1 = require("@hanzogui/constants");
var use_element_layout_1 = require("@hanzogui/use-element-layout");
var web_1 = require("@hanzogui/web");
var createOptimizedView_1 = require("./createOptimizedView");
var getBaseViews_1 = require("./getBaseViews");
// helpful for usage outside of hanzogui
var use_element_layout_2 = require("@hanzogui/use-element-layout");
Object.defineProperty(exports, "LayoutMeasurementController", { enumerable: true, get: function () { return use_element_layout_2.LayoutMeasurementController; } });
Object.defineProperty(exports, "registerLayoutNode", { enumerable: true, get: function () { return use_element_layout_2.registerLayoutNode; } });
Object.defineProperty(exports, "setOnLayoutStrategy", { enumerable: true, get: function () { return use_element_layout_2.setOnLayoutStrategy; } });
// fixes issues with TS saying internal type usage is breaking
// see https://discord.com/channels/909986013848412191/1146150253490348112/1146150253490348112
__exportStar(require("./reactNativeTypes"), exports);
// adds useElementLayout enable
var HanzoguiProvider = function (props) {
    (0, web_1.useIsomorphicLayoutEffect)(function () {
        (0, use_element_layout_1.enable)();
    }, []);
    return (0, jsx_runtime_1.jsx)(web_1.HanzoguiProvider, __assign({}, props));
};
exports.HanzoguiProvider = HanzoguiProvider;
// automate using the react native media driver
var createHanzogui = function (conf) {
    if (!constants_1.isWeb) {
        if (conf.media) {
            conf.media = (0, react_native_media_driver_1.createMedia)(conf.media);
        }
    }
    return (0, web_1.createHanzogui)(conf);
};
exports.createHanzogui = createHanzogui;
var baseViews = (0, getBaseViews_1.getBaseViews)();
// setup internal hooks:
(0, web_1.setupHooks)(__assign({ getBaseViews: getBaseViews_1.getBaseViews, setElementProps: function (node) {
        if (process.env.TAMAGUI_TARGET === 'web') {
            // web only
            if (node && !node['measure']) {
                node.measure || (node.measure = (0, use_element_layout_1.createMeasure)(node));
                node.measureInWindow || (node.measureInWindow = (0, use_element_layout_1.createMeasureInWindow)(node));
                node.measureLayout || (node.measureLayout = (0, use_element_layout_1.createMeasureLayout)(node));
            }
        }
    }, usePropsTransform: function (elementType, propsIn, stateRef, willHydrate) {
        if (process.env.TAMAGUI_TARGET === 'web') {
            var isDOM = typeof elementType === 'string';
            // replicate react-native-web functionality
            var 
            // remove event props handles by useResponderEvents
            onMoveShouldSetResponder = propsIn.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = propsIn.onMoveShouldSetResponderCapture, onResponderEnd = propsIn.onResponderEnd, onResponderGrant = propsIn.onResponderGrant, onResponderMove = propsIn.onResponderMove, onResponderReject = propsIn.onResponderReject, onResponderRelease = propsIn.onResponderRelease, onResponderStart = propsIn.onResponderStart, onResponderTerminate = propsIn.onResponderTerminate, onResponderTerminationRequest = propsIn.onResponderTerminationRequest, onScrollShouldSetResponder = propsIn.onScrollShouldSetResponder, onScrollShouldSetResponderCapture = propsIn.onScrollShouldSetResponderCapture, onSelectionChangeShouldSetResponder = propsIn.onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture = propsIn.onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder = propsIn.onStartShouldSetResponder, onStartShouldSetResponderCapture = propsIn.onStartShouldSetResponderCapture, 
            // android
            collapsable = propsIn.collapsable, focusable = propsIn.focusable, 
            // deprecated,
            accessible = propsIn.accessible, accessibilityDisabled = propsIn.accessibilityDisabled, onLayout = propsIn.onLayout, hrefAttrs = propsIn.hrefAttrs, plainDOMProps = __rest(propsIn, ["onMoveShouldSetResponder", "onMoveShouldSetResponderCapture", "onResponderEnd", "onResponderGrant", "onResponderMove", "onResponderReject", "onResponderRelease", "onResponderStart", "onResponderTerminate", "onResponderTerminationRequest", "onScrollShouldSetResponder", "onScrollShouldSetResponderCapture", "onSelectionChangeShouldSetResponder", "onSelectionChangeShouldSetResponderCapture", "onStartShouldSetResponder", "onStartShouldSetResponderCapture", "collapsable", "focusable", "accessible", "accessibilityDisabled", "onLayout", "hrefAttrs"]);
            if (willHydrate || isDOM) {
                (0, use_element_layout_1.useElementLayout)(stateRef, !isDOM ? undefined : onLayout);
                // responder events removed for web - use native pointer/touch events instead
                // the onResponder* props are stripped above and not passed to DOM
            }
            if (isDOM) {
                // TODO move into getSplitStyles
                if (plainDOMProps.href && hrefAttrs) {
                    var download = hrefAttrs.download, rel = hrefAttrs.rel, target = hrefAttrs.target;
                    if (download != null) {
                        plainDOMProps.download = download;
                    }
                    if (rel) {
                        plainDOMProps.rel = rel;
                    }
                    if (typeof target === 'string') {
                        plainDOMProps.target = target.charAt(0) !== '_' ? "_".concat(target) : target;
                    }
                }
                return plainDOMProps;
            }
        }
    } }, (process.env.TAMAGUI_TARGET === 'native' && {
    useChildren: function (elementType, children, viewProps) {
        if (process.env.NODE_ENV === 'test') {
            // test mode - just use regular views since optimizations cause weirdness
            return;
        }
        if (elementType === baseViews.View && baseViews.TextAncestor) {
            // optimize view
            return (0, createOptimizedView_1.createOptimizedView)(children, viewProps, baseViews);
        }
    },
})));
// overwrite web versions:
// putting at the end ensures it overwrites in dist/cjs/index.js
exports.View = web_1.View;
exports.Text = web_1.Text;
