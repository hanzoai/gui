"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dimensions = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var dimensions = {
    window: {
        fontScale: 1,
        height: 0,
        scale: 1,
        width: 0,
    },
    screen: {
        fontScale: 1,
        height: 0,
        scale: 1,
        width: 0,
    },
};
var listeners = {};
var shouldInit = react_native_web_internals_1.canUseDOM;
function update() {
    if (!react_native_web_internals_1.canUseDOM) {
        return;
    }
    var win = window;
    var docEl = win.document.documentElement;
    dimensions.window = {
        fontScale: 1,
        height: docEl.clientHeight,
        scale: win.devicePixelRatio || 1,
        width: docEl.clientWidth,
    };
    dimensions.screen = {
        fontScale: 1,
        height: win.screen.height,
        scale: win.devicePixelRatio || 1,
        width: win.screen.width,
    };
}
function handleResize() {
    update();
    if (Array.isArray(listeners['change'])) {
        listeners['change'].forEach(function (handler) { return handler(dimensions); });
    }
}
var Dimensions = /** @class */ (function () {
    function Dimensions() {
    }
    Dimensions.get = function (dimension) {
        if (shouldInit) {
            shouldInit = false;
            update();
        }
        (0, react_native_web_internals_1.invariant)(dimensions[dimension], "No dimension set for key ".concat(dimension));
        return dimensions[dimension];
    };
    Dimensions.set = function (initialDimensions) {
        if (initialDimensions) {
            if (react_native_web_internals_1.canUseDOM) {
                (0, react_native_web_internals_1.invariant)(false, 'Dimensions cannot be set in the browser');
            }
            else {
                if (initialDimensions.screen != null) {
                    dimensions.screen = initialDimensions.screen;
                }
                if (initialDimensions.window != null) {
                    dimensions.window = initialDimensions.window;
                }
            }
        }
    };
    Dimensions.addEventListener = function (type, handler) {
        var _this = this;
        listeners[type] = listeners[type] || [];
        listeners[type].push(handler);
        return {
            remove: function () {
                _this.removeEventListener(type, handler);
            },
        };
    };
    Dimensions.removeEventListener = function (type, handler) {
        if (Array.isArray(listeners[type])) {
            listeners[type] = listeners[type].filter(function (_handler) { return _handler !== handler; });
        }
    };
    return Dimensions;
}());
exports.Dimensions = Dimensions;
if (react_native_web_internals_1.canUseDOM) {
    window.addEventListener('resize', handleResize, false);
}
exports.default = Dimensions;
