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
exports.NativeMediaQueryList = void 0;
var react_native_1 = require("react-native");
var matchQuery_1 = require("./matchQuery");
var NativeMediaQueryList = /** @class */ (function () {
    function NativeMediaQueryList(query) {
        var _this = this;
        this.query = query;
        this.listeners = [];
        this.notify();
        react_native_1.Dimensions.addEventListener('change', function () {
            _this.notify();
        });
    }
    Object.defineProperty(NativeMediaQueryList.prototype, "orientation", {
        get: function () {
            var windowDimensions = react_native_1.Dimensions.get('window');
            return windowDimensions.height > windowDimensions.width ? 'portrait' : 'landscape';
        },
        enumerable: false,
        configurable: true
    });
    NativeMediaQueryList.prototype.notify = function () {
        var _this = this;
        this.listeners.forEach(function (listener) {
            listener(_this.orientation);
        });
    };
    NativeMediaQueryList.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    NativeMediaQueryList.prototype.removeListener = function (listener) {
        var index = this.listeners.indexOf(listener);
        if (index !== -1)
            this.listeners.splice(index, 1);
    };
    NativeMediaQueryList.prototype.match = function (query, _a) {
        var width = _a.width, height = _a.height;
        return (0, matchQuery_1.matchQuery)(query, {
            type: 'screen',
            orientation: height > width ? 'portrait' : 'landscape',
            'device-width': width,
            'device-height': height,
        });
    };
    Object.defineProperty(NativeMediaQueryList.prototype, "matches", {
        get: function () {
            var windowDimensions = react_native_1.Dimensions.get('window');
            var matches = (0, matchQuery_1.matchQuery)(this.query, __assign(__assign({ type: 'screen', orientation: this.orientation }, windowDimensions), { 'device-width': windowDimensions.width, 'device-height': windowDimensions.height }));
            return matches;
        },
        enumerable: false,
        configurable: true
    });
    return NativeMediaQueryList;
}());
exports.NativeMediaQueryList = NativeMediaQueryList;
