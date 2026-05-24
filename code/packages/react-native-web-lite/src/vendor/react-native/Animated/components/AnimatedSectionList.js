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
exports.SectionList = void 0;
var React = require("react");
var SectionList_1 = require("../../../../SectionList");
var createAnimatedComponent_1 = require("../createAnimatedComponent");
/**
 * @see https://github.com/facebook/react-native/commit/b8c8562
 */
var SectionListWithEventThrottle = React.forwardRef(function (props, ref) { return (<SectionList_1.SectionList scrollEventThrottle={0.0001} {...props} ref={ref}/>); });
var SectionList = (0, createAnimatedComponent_1.createAnimatedComponent)(SectionListWithEventThrottle);
exports.SectionList = SectionList;
exports.default = SectionList;
