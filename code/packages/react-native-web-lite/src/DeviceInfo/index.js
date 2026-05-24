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
exports.DeviceInfo = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var index_1 = require("../Dimensions/index");
exports.DeviceInfo = {
    Dimensions: {
        get windowPhysicalPixels() {
            var _a = index_1.Dimensions.get('window'), width = _a.width, height = _a.height, fontScale = _a.fontScale, scale = _a.scale;
            return {
                width: width * scale,
                height: height * scale,
                scale: scale,
                fontScale: fontScale,
            };
        },
        get screenPhysicalPixels() {
            var _a = index_1.Dimensions.get('screen'), width = _a.width, height = _a.height, fontScale = _a.fontScale, scale = _a.scale;
            return {
                width: width * scale,
                height: height * scale,
                scale: scale,
                fontScale: fontScale,
            };
        },
    },
    get locale() {
        if (react_native_web_internals_1.canUseDOM) {
            if (navigator.languages) {
                return navigator.languages[0];
            }
            else {
                return navigator.language;
            }
        }
    },
    get totalMemory() {
        // @ts-ignore
        return react_native_web_internals_1.canUseDOM ? navigator.deviceMemory : undefined;
    },
    get userAgent() {
        return react_native_web_internals_1.canUseDOM ? navigator.userAgent : '';
    },
};
