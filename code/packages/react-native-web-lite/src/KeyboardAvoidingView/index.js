"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.KeyboardAvoidingView = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var React = require("react");
var index_1 = require("../View/index");
var KeyboardAvoidingView = /** @class */ (function (_super) {
    __extends(KeyboardAvoidingView, _super);
    function KeyboardAvoidingView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.frame = null;
        _this.onLayout = function (event) {
            _this.frame = event.nativeEvent.layout;
        };
        return _this;
    }
    KeyboardAvoidingView.prototype.relativeKeyboardHeight = function (keyboardFrame) {
        var frame = this.frame;
        if (!frame || !keyboardFrame) {
            return 0;
        }
        var keyboardY = keyboardFrame.screenY - (this.props.keyboardVerticalOffset || 0);
        return Math.max(frame.y + frame.height - keyboardY, 0);
    };
    KeyboardAvoidingView.prototype.onKeyboardChange = function (event) { };
    KeyboardAvoidingView.prototype.render = function () {
        var _a = this.props, 
        /* eslint-disable */
        behavior = _a.behavior, contentContainerStyle = _a.contentContainerStyle, keyboardVerticalOffset = _a.keyboardVerticalOffset, 
        /* eslint-enable */
        rest = __rest(_a, ["behavior", "contentContainerStyle", "keyboardVerticalOffset"]);
        return (0, jsx_runtime_1.jsx)(index_1.View, __assign({ onLayout: this.onLayout }, rest));
    };
    return KeyboardAvoidingView;
}(React.Component));
exports.KeyboardAvoidingView = KeyboardAvoidingView;
exports.default = KeyboardAvoidingView;
