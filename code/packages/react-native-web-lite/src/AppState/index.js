"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppState = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
// Android 4.4 browser
var isPrefixed = 
// eslint-disable-next-line no-prototype-builtins
react_native_web_internals_1.canUseDOM &&
    !document.hasOwnProperty('hidden') &&
    document.hasOwnProperty('webkitHidden');
var EVENT_TYPES = ['change', 'memoryWarning'];
var VISIBILITY_CHANGE_EVENT = isPrefixed ? 'webkitvisibilitychange' : 'visibilitychange';
var VISIBILITY_STATE_PROPERTY = isPrefixed ? 'webkitVisibilityState' : 'visibilityState';
var AppStates = {
    BACKGROUND: 'background',
    ACTIVE: 'active',
};
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.prototype.addListener = function (type, handler) {
        var _a;
        var _b;
        (_a = (_b = this.listeners)[type]) !== null && _a !== void 0 ? _a : (_b[type] = new Set());
        this.listeners[type].add(handler);
    };
    EventEmitter.prototype.emit = function (type, state) {
        var _a;
        (_a = this.listeners[type]) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(state); });
    };
    EventEmitter.prototype.removeListener = function (type, handler) {
        var _a;
        (_a = this.listeners[type]) === null || _a === void 0 ? void 0 : _a.delete(handler);
    };
    return EventEmitter;
}());
var hasBoundVisibilityChangeEvent = false;
var changeEmitter = new EventEmitter();
var AppState = /** @class */ (function () {
    function AppState() {
    }
    Object.defineProperty(AppState, "currentState", {
        get: function () {
            if (!AppState.isAvailable) {
                return AppStates.ACTIVE;
            }
            switch (document[VISIBILITY_STATE_PROPERTY]) {
                case 'hidden':
                case 'prerender':
                case 'unloaded':
                    return AppStates.BACKGROUND;
                default:
                    return AppStates.ACTIVE;
            }
        },
        enumerable: false,
        configurable: true
    });
    AppState.addEventListener = function (type, handler) {
        if (AppState.isAvailable) {
            (0, react_native_web_internals_1.invariant)(EVENT_TYPES.indexOf(type) !== -1, 'Trying to subscribe to unknown event: "%s"', type);
            if (type === 'change') {
                if (!hasBoundVisibilityChangeEvent) {
                    hasBoundVisibilityChangeEvent = true;
                    document.addEventListener(VISIBILITY_CHANGE_EVENT, function () {
                        if (changeEmitter) {
                            changeEmitter.emit('change', AppState.currentState);
                        }
                    }, false);
                }
                return changeEmitter.addListener(type, handler);
            }
        }
    };
    AppState.isAvailable = react_native_web_internals_1.canUseDOM && document[VISIBILITY_STATE_PROPERTY];
    return AppState;
}());
exports.AppState = AppState;
