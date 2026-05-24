"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContainer = exports.RootTagContext = void 0;
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
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../View/index");
exports.RootTagContext = React.createContext(null);
var AppContainer = React.forwardRef(function (props, forwardedRef) {
    var children = props.children, WrapperComponent = props.WrapperComponent;
    var innerView = ((0, jsx_runtime_1.jsx)(index_1.View, { pointerEvents: "box-none", style: styles.appContainer, children: children }, 1));
    if (WrapperComponent) {
        innerView = (0, jsx_runtime_1.jsx)(WrapperComponent, { children: innerView });
    }
    return ((0, jsx_runtime_1.jsx)(exports.RootTagContext.Provider, { value: props.rootTag, children: (0, jsx_runtime_1.jsx)(index_1.View, { pointerEvents: "box-none", ref: forwardedRef, style: styles.appContainer, children: innerView }) }));
});
exports.AppContainer = AppContainer;
AppContainer.displayName = 'AppContainer';
var styles = react_native_web_internals_1.StyleSheet.create({
    appContainer: {
        flex: 1,
    },
});
