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
exports.Share = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var Share = /** @class */ (function () {
    function Share() {
    }
    Share.share = function (content, options) {
        if (options === void 0) { options = {}; }
        (0, react_native_web_internals_1.invariant)(typeof content === 'object' && content !== null, 'Content to share must be a valid object');
        (0, react_native_web_internals_1.invariant)(typeof content.url === 'string' || typeof content.message === 'string', 'At least one of URL and message is required');
        (0, react_native_web_internals_1.invariant)(typeof options === 'object' && options !== null, 'Options must be a valid object');
        (0, react_native_web_internals_1.invariant)(!content.title || typeof content.title === 'string', 'Invalid title: title should be a string.');
        if (window.navigator.share !== undefined) {
            return window.navigator.share({
                title: content.title,
                text: content.message,
                url: content.url,
            });
        }
        else {
            return Promise.reject(new Error('Share is not supported in this browser'));
        }
    };
    Object.defineProperty(Share, "sharedAction", {
        /**
         * The content was successfully shared.
         */
        get: function () {
            return 'sharedAction';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Share, "dismissedAction", {
        /**
         * The dialog has been dismissed.
         * @platform ios
         */
        get: function () {
            return 'dismissedAction';
        },
        enumerable: false,
        configurable: true
    });
    return Share;
}());
exports.Share = Share;
