"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityInfo = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
function isScreenReaderEnabled() {
    return new Promise(function (resolve, reject) {
        resolve(true);
    });
}
var prefersReducedMotionMedia = react_native_web_internals_1.canUseDOM && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
function isReduceMotionEnabled() {
    return new Promise(function (resolve, reject) {
        resolve(prefersReducedMotionMedia ? prefersReducedMotionMedia.matches : true);
    });
}
function addChangeListener(fn) {
    if (prefersReducedMotionMedia != null) {
        prefersReducedMotionMedia.addEventListener != null
            ? prefersReducedMotionMedia.addEventListener('change', fn)
            : prefersReducedMotionMedia.addListener(fn);
    }
}
function removeChangeListener(fn) {
    if (prefersReducedMotionMedia != null) {
        prefersReducedMotionMedia.removeEventListener != null
            ? prefersReducedMotionMedia.removeEventListener('change', fn)
            : prefersReducedMotionMedia.removeListener(fn);
    }
}
var handlers = {};
exports.AccessibilityInfo = {
    /**
     * Query whether a screen reader is currently enabled.
     *
     * Returns a promise which resolves to a boolean.
     * The result is `true` when a screen reader is enabled and `false` otherwise.
     */
    isScreenReaderEnabled: isScreenReaderEnabled,
    /**
     * Query whether the user prefers reduced motion.
     *
     * Returns a promise which resolves to a boolean.
     * The result is `true` when a screen reader is enabled and `false` otherwise.
     */
    isReduceMotionEnabled: isReduceMotionEnabled,
    /**
     * Deprecated
     */
    fetch: isScreenReaderEnabled,
    /**
     * Add an event handler. Supported events: reduceMotionChanged
     */
    addEventListener: function (eventName, handler) {
        if (eventName === 'reduceMotionChanged') {
            if (!prefersReducedMotionMedia) {
                return;
            }
            var listener = function (event) {
                handler(event.matches);
            };
            addChangeListener(listener);
            // @ts-ignore
            handlers[handler] = listener;
        }
        return {
            remove: function () { return exports.AccessibilityInfo.removeEventListener(eventName, handler); },
        };
    },
    /**
     * Set accessibility focus to a react component.
     */
    setAccessibilityFocus: function (reactTag) { },
    /**
     * Post a string to be announced by the screen reader.
     */
    announceForAccessibility: function (announcement) { },
    /**
     * Remove an event handler.
     */
    removeEventListener: function (eventName, handler) {
        if (eventName === 'reduceMotionChanged') {
            // @ts-ignore
            var listener = handlers[handler];
            if (!listener || !prefersReducedMotionMedia) {
                return;
            }
            removeChangeListener(listener);
        }
        return;
    },
};
