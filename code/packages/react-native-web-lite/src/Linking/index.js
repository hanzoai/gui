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
exports.Linking = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var initialURL = react_native_web_internals_1.canUseDOM ? window.location.href : '';
var Linking = /** @class */ (function () {
    function Linking() {
        var _this = this;
        /**
         * An object mapping of event name
         * and all the callbacks subscribing to it
         */
        this._eventCallbacks = {};
        /**
         * Adds a event listener for the specified event. The callback will be called when the
         * said event is dispatched.
         */
        this.addEventListener = function (event, callback) {
            if (!_this._eventCallbacks[event]) {
                _this._eventCallbacks[event] = [callback];
                return;
            }
            _this._eventCallbacks[event].push(callback);
        };
        /**
         * Removes a previously added event listener for the specified event. The callback must
         * be the same object as the one passed to `addEventListener`.
         */
        this.removeEventListener = function (event, callback) {
            var callbacks = _this._eventCallbacks[event];
            var filteredCallbacks = callbacks.filter(function (c) { return c.toString() !== callback.toString(); });
            _this._eventCallbacks[event] = filteredCallbacks;
        };
    }
    Linking.prototype._dispatchEvent = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var listeners = this._eventCallbacks[event];
        if (listeners != null && Array.isArray(listeners)) {
            listeners.map(function (listener) {
                listener.apply(void 0, data);
            });
        }
    };
    Linking.prototype.canOpenURL = function () {
        return Promise.resolve(true);
    };
    Linking.prototype.getInitialURL = function () {
        return Promise.resolve(initialURL);
    };
    /**
     * Try to open the given url in a secure fashion. The method returns a Promise object.
     * If a target is passed (including undefined) that target will be used, otherwise '_blank'.
     * If the url opens, the promise is resolved. If not, the promise is rejected.
     * Dispatches the `onOpen` event if `url` is opened successfully.
     */
    Linking.prototype.openURL = function (url, target) {
        if (arguments.length === 1) {
            target = '_blank';
        }
        try {
            open(url, target);
            this._dispatchEvent('onOpen', url);
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    Linking.prototype._validateURL = function (url) {
        (0, react_native_web_internals_1.invariant)(typeof url === 'string', 'Invalid URL: should be a string. Was: ' + url);
        (0, react_native_web_internals_1.invariant)(url, 'Invalid URL: cannot be empty');
    };
    return Linking;
}());
var open = function (url, target) {
    if (react_native_web_internals_1.canUseDOM) {
        // @ts-ignore
        var urlToOpen = new URL(url, window.location).toString();
        if (urlToOpen.indexOf('tel:') === 0) {
            // @ts-ignore
            window.location = urlToOpen;
        }
        else {
            window.open(urlToOpen, target, 'noopener');
        }
    }
};
var LinkingInstance = new Linking();
exports.Linking = LinkingInstance;
