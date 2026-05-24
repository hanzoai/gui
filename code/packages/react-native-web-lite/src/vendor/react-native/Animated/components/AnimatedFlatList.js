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
exports.FlatList = void 0;
var React = require("react");
var FlatList_1 = require("../../../../FlatList");
var createAnimatedComponent_1 = require("../createAnimatedComponent");
/**
 * @see https://github.com/facebook/react-native/commit/b8c8562
 */
var FlatListWithEventThrottle = React.forwardRef(function (props, ref) { return (<FlatList_1.FlatList scrollEventThrottle={0.0001} {...props} ref={ref}/>); });
var FlatList = (0, createAnimatedComponent_1.createAnimatedComponent)(FlatListWithEventThrottle);
exports.FlatList = FlatList;
exports.default = FlatList;
