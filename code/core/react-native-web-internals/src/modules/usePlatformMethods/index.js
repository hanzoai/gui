"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlatformMethods = usePlatformMethods;
var use_element_layout_1 = require("@hanzogui/use-element-layout");
var index_1 = require("../useStable/index");
/**
 * Adds non-standard methods to the hode element. This is temporarily until an
 * API like `ReactNative.measure(hostRef, callback)` is added to React Native.
 */
function usePlatformMethods(_a) {
    var pointerEvents = _a.pointerEvents, style = _a.style;
    // Avoid creating a new ref on every render. The props only need to be
    // available to 'setNativeProps' when it is called.
    var ref = (0, index_1.useStable)(function () { return function (hostNode) {
        if (hostNode != null) {
            hostNode.measure = (0, use_element_layout_1.createMeasure)(hostNode);
            hostNode.measureLayout = (0, use_element_layout_1.createMeasureLayout)(hostNode);
            hostNode.measureInWindow = (0, use_element_layout_1.createMeasureInWindow)(hostNode);
        }
    }; });
    return ref;
}
