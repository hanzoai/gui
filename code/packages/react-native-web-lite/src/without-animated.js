"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchableHighlight = exports.FlatList = exports.VirtualizedList = exports.Switch = exports.DrawerLayoutAndroid = exports.Vibration = exports.Share = exports.PixelRatio = exports.PanResponder = exports.Linking = exports.Keyboard = exports.I18nManager = exports.Dimensions = exports.DeviceEventEmitter = exports.DeviceEmitter = exports.DeviceInfo = exports.Clipboard = exports.BackHandler = exports.AppState = exports.AppRegistry = exports.Appearance = exports.Alert = exports.AccessibilityInfo = exports.NativeEventEmitter = exports.NativeModules = exports.render = exports.usePlatformMethods = exports.useMergeRefs = exports.useLayoutEffect = exports.useHover = exports.useEvent = exports.UIManager = exports.TextAncestorContext = exports.StyleSheet = exports.processStyle = exports.processColor = exports.Platform = exports.normalizeColor = exports.mergeRefs = exports.LocaleProvider = exports.isWebColor = exports.InteractionManager = exports.ImageLoader = exports.flattenStyle = exports.dismissKeyboard = exports.createDOMProps = exports.clickProps = exports.canUseDOM = exports.AccessibilityUtil = exports.unstable_createElement = void 0;
exports.RootTagContext = exports.unstable_batchedUpdates = exports.findNodeHandle = exports.Easing = exports.Animated = exports.useWindowDimensions = exports.useLocaleContext = exports.useColorScheme = exports.LogBox = exports.View = exports.TextInput = exports.Text = exports.StatusBar = exports.ScrollView = exports.SafeAreaView = exports.RefreshControl = exports.Pressable = exports.Modal = exports.KeyboardAvoidingView = exports.ImageBackground = exports.Image = exports.ActivityIndicator = exports.TouchableWithoutFeedback = exports.TouchableOpacity = exports.Touchable = exports.SectionList = exports.TouchableNativeFeedback = void 0;
exports.requireNativeComponent = requireNativeComponent;
var react_1 = require("react");
var index_1 = require("./createElement/index");
Object.defineProperty(exports, "unstable_createElement", { enumerable: true, get: function () { return index_1.createElement; } });
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
Object.defineProperty(exports, "AccessibilityUtil", { enumerable: true, get: function () { return react_native_web_internals_1.AccessibilityUtil; } });
Object.defineProperty(exports, "canUseDOM", { enumerable: true, get: function () { return react_native_web_internals_1.canUseDOM; } });
Object.defineProperty(exports, "clickProps", { enumerable: true, get: function () { return react_native_web_internals_1.clickProps; } });
Object.defineProperty(exports, "createDOMProps", { enumerable: true, get: function () { return react_native_web_internals_1.createDOMProps; } });
Object.defineProperty(exports, "dismissKeyboard", { enumerable: true, get: function () { return react_native_web_internals_1.dismissKeyboard; } });
Object.defineProperty(exports, "flattenStyle", { enumerable: true, get: function () { return react_native_web_internals_1.flattenStyle; } });
Object.defineProperty(exports, "ImageLoader", { enumerable: true, get: function () { return react_native_web_internals_1.ImageLoader; } });
Object.defineProperty(exports, "InteractionManager", { enumerable: true, get: function () { return react_native_web_internals_1.InteractionManager; } });
Object.defineProperty(exports, "isWebColor", { enumerable: true, get: function () { return react_native_web_internals_1.isWebColor; } });
Object.defineProperty(exports, "LocaleProvider", { enumerable: true, get: function () { return react_native_web_internals_1.LocaleProvider; } });
Object.defineProperty(exports, "mergeRefs", { enumerable: true, get: function () { return react_native_web_internals_1.mergeRefs; } });
Object.defineProperty(exports, "normalizeColor", { enumerable: true, get: function () { return react_native_web_internals_1.normalizeColor; } });
Object.defineProperty(exports, "Platform", { enumerable: true, get: function () { return react_native_web_internals_1.Platform; } });
Object.defineProperty(exports, "processColor", { enumerable: true, get: function () { return react_native_web_internals_1.processColor; } });
Object.defineProperty(exports, "processStyle", { enumerable: true, get: function () { return react_native_web_internals_1.processStyle; } });
Object.defineProperty(exports, "StyleSheet", { enumerable: true, get: function () { return react_native_web_internals_1.StyleSheet; } });
Object.defineProperty(exports, "TextAncestorContext", { enumerable: true, get: function () { return react_native_web_internals_1.TextAncestorContext; } });
Object.defineProperty(exports, "UIManager", { enumerable: true, get: function () { return react_native_web_internals_1.UIManager; } });
Object.defineProperty(exports, "useEvent", { enumerable: true, get: function () { return react_native_web_internals_1.useEvent; } });
Object.defineProperty(exports, "useHover", { enumerable: true, get: function () { return react_native_web_internals_1.useHover; } });
Object.defineProperty(exports, "useLayoutEffect", { enumerable: true, get: function () { return react_native_web_internals_1.useLayoutEffect; } });
Object.defineProperty(exports, "useMergeRefs", { enumerable: true, get: function () { return react_native_web_internals_1.useMergeRefs; } });
Object.defineProperty(exports, "usePlatformMethods", { enumerable: true, get: function () { return react_native_web_internals_1.usePlatformMethods; } });
var index_2 = require("./render/index");
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return index_2.render; } });
var index_3 = require("./NativeModules/index");
Object.defineProperty(exports, "NativeModules", { enumerable: true, get: function () { return index_3.NativeModules; } });
// react-native
var NativeEventEmitter_1 = require("./vendor/react-native/EventEmitter/NativeEventEmitter");
Object.defineProperty(exports, "NativeEventEmitter", { enumerable: true, get: function () { return NativeEventEmitter_1.default; } });
// APIs
var index_4 = require("./AccessibilityInfo/index");
Object.defineProperty(exports, "AccessibilityInfo", { enumerable: true, get: function () { return index_4.AccessibilityInfo; } });
var index_5 = require("./Alert/index");
Object.defineProperty(exports, "Alert", { enumerable: true, get: function () { return index_5.Alert; } });
var index_6 = require("./Appearance/index");
Object.defineProperty(exports, "Appearance", { enumerable: true, get: function () { return index_6.Appearance; } });
var index_7 = require("./AppRegistry/index");
Object.defineProperty(exports, "AppRegistry", { enumerable: true, get: function () { return index_7.AppRegistry; } });
var index_8 = require("./AppState/index");
Object.defineProperty(exports, "AppState", { enumerable: true, get: function () { return index_8.AppState; } });
var index_9 = require("./BackHandler/index");
Object.defineProperty(exports, "BackHandler", { enumerable: true, get: function () { return index_9.BackHandler; } });
var index_10 = require("./Clipboard/index");
Object.defineProperty(exports, "Clipboard", { enumerable: true, get: function () { return index_10.Clipboard; } });
var index_11 = require("./DeviceInfo/index");
Object.defineProperty(exports, "DeviceInfo", { enumerable: true, get: function () { return index_11.DeviceInfo; } });
var DeviceEmitter_1 = require("./DeviceEmitter");
Object.defineProperty(exports, "DeviceEmitter", { enumerable: true, get: function () { return DeviceEmitter_1.DeviceEmitter; } });
var DeviceEmitter_2 = require("./DeviceEmitter");
Object.defineProperty(exports, "DeviceEventEmitter", { enumerable: true, get: function () { return DeviceEmitter_2.DeviceEmitter; } });
var index_12 = require("./Dimensions/index");
Object.defineProperty(exports, "Dimensions", { enumerable: true, get: function () { return index_12.Dimensions; } });
var index_13 = require("./I18nManager/index");
Object.defineProperty(exports, "I18nManager", { enumerable: true, get: function () { return index_13.I18nManager; } });
var index_14 = require("./Keyboard/index");
Object.defineProperty(exports, "Keyboard", { enumerable: true, get: function () { return index_14.Keyboard; } });
var index_15 = require("./Linking/index");
Object.defineProperty(exports, "Linking", { enumerable: true, get: function () { return index_15.Linking; } });
var index_16 = require("./PanResponder/index");
Object.defineProperty(exports, "PanResponder", { enumerable: true, get: function () { return index_16.PanResponder; } });
var index_17 = require("./PixelRatio/index");
Object.defineProperty(exports, "PixelRatio", { enumerable: true, get: function () { return index_17.PixelRatio; } });
var index_18 = require("./Share/index");
Object.defineProperty(exports, "Share", { enumerable: true, get: function () { return index_18.Share; } });
var index_19 = require("./Vibration/index");
Object.defineProperty(exports, "Vibration", { enumerable: true, get: function () { return index_19.Vibration; } });
// unimplemented
var UnimplementedView_1 = require("./UnimplementedView");
Object.defineProperty(exports, "DrawerLayoutAndroid", { enumerable: true, get: function () { return UnimplementedView_1.UnimplementedView; } });
var UnimplementedView_2 = require("./UnimplementedView");
Object.defineProperty(exports, "Switch", { enumerable: true, get: function () { return UnimplementedView_2.UnimplementedView; } });
var UnimplementedView_3 = require("./UnimplementedView");
Object.defineProperty(exports, "VirtualizedList", { enumerable: true, get: function () { return UnimplementedView_3.UnimplementedView; } });
var UnimplementedView_4 = require("./UnimplementedView");
Object.defineProperty(exports, "FlatList", { enumerable: true, get: function () { return UnimplementedView_4.UnimplementedView; } });
var UnimplementedView_5 = require("./UnimplementedView");
Object.defineProperty(exports, "TouchableHighlight", { enumerable: true, get: function () { return UnimplementedView_5.UnimplementedView; } });
var UnimplementedView_6 = require("./UnimplementedView");
Object.defineProperty(exports, "TouchableNativeFeedback", { enumerable: true, get: function () { return UnimplementedView_6.UnimplementedView; } });
var UnimplementedView_7 = require("./UnimplementedView");
Object.defineProperty(exports, "SectionList", { enumerable: true, get: function () { return UnimplementedView_7.UnimplementedView; } });
var TouchableOpacity_1 = require("./TouchableOpacity");
Object.defineProperty(exports, "Touchable", { enumerable: true, get: function () { return TouchableOpacity_1.TouchableOpacity; } });
Object.defineProperty(exports, "TouchableOpacity", { enumerable: true, get: function () { return TouchableOpacity_1.TouchableOpacity; } });
var TouchableWithoutFeedback_1 = require("./TouchableWithoutFeedback");
Object.defineProperty(exports, "TouchableWithoutFeedback", { enumerable: true, get: function () { return TouchableWithoutFeedback_1.TouchableWithoutFeedback; } });
// components
var index_20 = require("./ActivityIndicator/index");
Object.defineProperty(exports, "ActivityIndicator", { enumerable: true, get: function () { return index_20.ActivityIndicator; } });
var index_21 = require("./Image/index");
Object.defineProperty(exports, "Image", { enumerable: true, get: function () { return index_21.Image; } });
var index_22 = require("./ImageBackground/index");
Object.defineProperty(exports, "ImageBackground", { enumerable: true, get: function () { return index_22.ImageBackground; } });
var index_23 = require("./KeyboardAvoidingView/index");
Object.defineProperty(exports, "KeyboardAvoidingView", { enumerable: true, get: function () { return index_23.KeyboardAvoidingView; } });
var index_24 = require("./Modal/index");
Object.defineProperty(exports, "Modal", { enumerable: true, get: function () { return index_24.Modal; } });
var index_25 = require("./Pressable/index");
Object.defineProperty(exports, "Pressable", { enumerable: true, get: function () { return index_25.Pressable; } });
var index_26 = require("./RefreshControl/index");
Object.defineProperty(exports, "RefreshControl", { enumerable: true, get: function () { return index_26.RefreshControl; } });
var index_27 = require("./SafeAreaView/index");
Object.defineProperty(exports, "SafeAreaView", { enumerable: true, get: function () { return index_27.SafeAreaView; } });
var index_28 = require("./ScrollView/index");
Object.defineProperty(exports, "ScrollView", { enumerable: true, get: function () { return index_28.ScrollView; } });
var index_29 = require("./StatusBar/index");
Object.defineProperty(exports, "StatusBar", { enumerable: true, get: function () { return index_29.StatusBar; } });
var index_30 = require("./Text/index");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return index_30.Text; } });
var index_31 = require("./TextInput/index");
Object.defineProperty(exports, "TextInput", { enumerable: true, get: function () { return index_31.TextInput; } });
var index_32 = require("./View/index");
Object.defineProperty(exports, "View", { enumerable: true, get: function () { return index_32.View; } });
var index_33 = require("./LogBox/index");
Object.defineProperty(exports, "LogBox", { enumerable: true, get: function () { return index_33.LogBox; } });
// hooks
var index_34 = require("./useColorScheme/index");
Object.defineProperty(exports, "useColorScheme", { enumerable: true, get: function () { return index_34.useColorScheme; } });
var index_35 = require("./useLocaleContext/index");
Object.defineProperty(exports, "useLocaleContext", { enumerable: true, get: function () { return index_35.useLocaleContext; } });
var index_36 = require("./useWindowDimensions/index");
Object.defineProperty(exports, "useWindowDimensions", { enumerable: true, get: function () { return index_36.useWindowDimensions; } });
// // useful internals
__exportStar(require("@hanzogui/react-native-web-internals"), exports);
function requireNativeComponent(name) {
    return function FakeComponent() {
        return null;
    };
}
var index_37 = require("./View/index");
var index_38 = require("./Text/index");
var index_39 = require("./Image/index");
var index_40 = require("./ScrollView/index");
// minimal stub for Animated.Value that holds a number and supports listeners
var AnimatedValue = /** @class */ (function () {
    function AnimatedValue(value) {
        if (value === void 0) { value = 0; }
        this._value = value;
        this._offset = 0;
        this._listeners = {};
        this._nextId = 0;
    }
    AnimatedValue.prototype.setValue = function (value) {
        this._value = value;
        this._notifyListeners();
    };
    AnimatedValue.prototype.setOffset = function (offset) {
        this._offset = offset;
    };
    AnimatedValue.prototype.flattenOffset = function () {
        this._value += this._offset;
        this._offset = 0;
    };
    AnimatedValue.prototype.extractOffset = function () {
        this._offset = this._value;
        this._value = 0;
    };
    AnimatedValue.prototype.addListener = function (callback) {
        var id = String(this._nextId++);
        this._listeners[id] = callback;
        return id;
    };
    AnimatedValue.prototype.removeListener = function (id) {
        delete this._listeners[id];
    };
    AnimatedValue.prototype.removeAllListeners = function () {
        this._listeners = {};
    };
    AnimatedValue.prototype.stopAnimation = function (callback) {
        callback === null || callback === void 0 ? void 0 : callback(this._value);
    };
    AnimatedValue.prototype.resetAnimation = function (callback) {
        callback === null || callback === void 0 ? void 0 : callback(this._value);
    };
    AnimatedValue.prototype.interpolate = function (config) {
        return new AnimatedValue(this._value);
    };
    AnimatedValue.prototype._notifyListeners = function () {
        for (var key in this._listeners) {
            this._listeners[key]({ value: this._value });
        }
    };
    AnimatedValue.prototype.__getValue = function () {
        return this._value + this._offset;
    };
    return AnimatedValue;
}());
var AnimatedValueXY = /** @class */ (function () {
    function AnimatedValueXY(value) {
        var _a, _b;
        this.x = new AnimatedValue((_a = value === null || value === void 0 ? void 0 : value.x) !== null && _a !== void 0 ? _a : 0);
        this.y = new AnimatedValue((_b = value === null || value === void 0 ? void 0 : value.y) !== null && _b !== void 0 ? _b : 0);
    }
    AnimatedValueXY.prototype.setValue = function (value) {
        this.x.setValue(value.x);
        this.y.setValue(value.y);
    };
    AnimatedValueXY.prototype.setOffset = function (offset) {
        this.x.setOffset(offset.x);
        this.y.setOffset(offset.y);
    };
    AnimatedValueXY.prototype.flattenOffset = function () {
        this.x.flattenOffset();
        this.y.flattenOffset();
    };
    AnimatedValueXY.prototype.stopAnimation = function (callback) {
        callback === null || callback === void 0 ? void 0 : callback({ x: this.x._value, y: this.y._value });
    };
    AnimatedValueXY.prototype.addListener = function (callback) {
        var _this = this;
        var xId = this.x.addListener(function () {
            callback({ x: _this.x._value, y: _this.y._value });
        });
        this.y.addListener(function () {
            callback({ x: _this.x._value, y: _this.y._value });
        });
        return xId;
    };
    AnimatedValueXY.prototype.removeAllListeners = function () {
        this.x.removeAllListeners();
        this.y.removeAllListeners();
    };
    AnimatedValueXY.prototype.getLayout = function () {
        return { left: this.x, top: this.y };
    };
    AnimatedValueXY.prototype.getTranslateTransform = function () {
        return [{ translateX: this.x }, { translateY: this.y }];
    };
    return AnimatedValueXY;
}());
var noopAnim = {
    start: function (cb) { return cb === null || cb === void 0 ? void 0 : cb({ finished: true }); },
    stop: function () { },
    reset: function () { },
};
// minimal stub for Animated - uses real components so props get filtered
exports.Animated = {
    View: index_37.View,
    Text: index_38.Text,
    Image: index_39.Image,
    ScrollView: index_40.ScrollView,
    FlatList: index_37.View,
    SectionList: index_37.View,
    Value: AnimatedValue,
    ValueXY: AnimatedValueXY,
    timing: function () { return noopAnim; },
    spring: function () { return noopAnim; },
    decay: function () { return noopAnim; },
    sequence: function () { return noopAnim; },
    parallel: function () { return noopAnim; },
    stagger: function () { return noopAnim; },
    loop: function () { return noopAnim; },
    event: function () { return function () { }; },
    add: function (a, b) { return new AnimatedValue(0); },
    subtract: function (a, b) { return new AnimatedValue(0); },
    multiply: function (a, b) { return new AnimatedValue(0); },
    divide: function (a, b) { return new AnimatedValue(0); },
    modulo: function (a, b) { return new AnimatedValue(0); },
    diffClamp: function (a, min, max) { return new AnimatedValue(0); },
    delay: function () { return noopAnim; },
    createAnimatedComponent: function (c) { return c; },
};
// minimal stub for Easing - satisfies imports but does nothing
exports.Easing = {
    step0: function () { return 0; },
    step1: function () { return 1; },
    linear: function (t) { return t; },
    ease: function (t) { return t; },
    quad: function (t) { return t * t; },
    cubic: function (t) { return t * t * t; },
    poly: function () { return function (t) { return t; }; },
    sin: function (t) { return t; },
    circle: function (t) { return t; },
    exp: function (t) { return t; },
    elastic: function () { return function (t) { return t; }; },
    back: function () { return function (t) { return t; }; },
    bounce: function (t) { return t; },
    bezier: function () { return function (t) { return t; }; },
    in: function (fn) { return fn; },
    out: function (fn) { return fn; },
    inOut: function (fn) { return fn; },
};
var findNodeHandle = function (component) {
    throw new Error('not supported - use ref instead');
};
exports.findNodeHandle = findNodeHandle;
// compat with rn:
var react_dom_1 = require("react-dom");
Object.defineProperty(exports, "unstable_batchedUpdates", { enumerable: true, get: function () { return react_dom_1.unstable_batchedUpdates; } });
exports.RootTagContext = (0, react_1.createContext)(null);
