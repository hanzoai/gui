"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollView = void 0;
var React = require("react");
var ScrollView_1 = require("../../../../ScrollView");
var createAnimatedComponent_1 = require("../createAnimatedComponent");
/**
 * @see https://github.com/facebook/react-native/commit/b8c8562
 */
var ScrollViewWithEventThrottle = React.forwardRef(function (props, ref) { return (<ScrollView_1.ScrollView scrollEventThrottle={0.0001} {...props} ref={ref}/>); });
var ScrollView = (0, createAnimatedComponent_1.createAnimatedComponent)(ScrollViewWithEventThrottle);
exports.ScrollView = ScrollView;
exports.default = ScrollView;
