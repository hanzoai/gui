"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHover = useHover;
var index_1 = require("../modality/index");
var index_2 = require("../useEvent/index");
var index_3 = require("../useLayoutEffect/index");
/**
 * Implementation
 */
var emptyObject = {};
var opts = { passive: true };
var lockEventType = 'react-gui:hover:lock';
var unlockEventType = 'react-gui:hover:unlock';
var supportsPointerEvent = function () {
    return !!(typeof window !== 'undefined' && window.PointerEvent != null);
};
function dispatchCustomEvent(target, type, payload) {
    var event = document.createEvent('CustomEvent');
    var _a = payload || emptyObject, _b = _a.bubbles, bubbles = _b === void 0 ? true : _b, _c = _a.cancelable, cancelable = _c === void 0 ? true : _c, detail = _a.detail;
    event.initCustomEvent(type, bubbles, cancelable, detail);
    target.dispatchEvent(event);
}
// This accounts for the non-PointerEvent fallback events.
function getPointerType(event) {
    var pointerType = event.pointerType;
    return pointerType != null ? pointerType : (0, index_1.getModality)();
}
function useHover(targetRef, config) {
    var contain = config.contain, disabled = config.disabled, onHoverStart = config.onHoverStart, onHoverChange = config.onHoverChange, onHoverUpdate = config.onHoverUpdate, onHoverEnd = config.onHoverEnd;
    var canUsePE = supportsPointerEvent();
    var addMoveListener = (0, index_2.useEvent)(canUsePE ? 'pointermove' : 'mousemove', opts);
    var addEnterListener = (0, index_2.useEvent)(canUsePE ? 'pointerenter' : 'mouseenter', opts);
    var addLeaveListener = (0, index_2.useEvent)(canUsePE ? 'pointerleave' : 'mouseleave', opts);
    // These custom events are used to implement the "contain" prop.
    var addLockListener = (0, index_2.useEvent)(lockEventType, opts);
    var addUnlockListener = (0, index_2.useEvent)(unlockEventType, opts);
    (0, index_3.useLayoutEffectImpl)(function () {
        var target = targetRef.current;
        if (target !== null) {
            /**
             * End the hover gesture
             */
            var hoverEnd_1 = function (e) {
                if (onHoverEnd != null) {
                    onHoverEnd(e);
                }
                if (onHoverChange != null) {
                    onHoverChange(false);
                }
                // Remove the listeners once finished.
                addMoveListener(target, null);
                addLeaveListener(target, null);
            };
            /**
             * Leave element
             */
            var leaveListener_1 = function (e) {
                var target = targetRef.current;
                if (target != null && getPointerType(e) !== 'touch') {
                    if (contain) {
                        dispatchCustomEvent(target, unlockEventType);
                    }
                    hoverEnd_1(e);
                }
            };
            /**
             * Move within element
             */
            var moveListener_1 = function (e) {
                if (getPointerType(e) !== 'touch') {
                    if (onHoverUpdate != null) {
                        // Not all browsers have these properties
                        if (e.x == null) {
                            e.x = e.clientX;
                        }
                        if (e.y == null) {
                            e.y = e.clientY;
                        }
                        onHoverUpdate(e);
                    }
                }
            };
            /**
             * Start the hover gesture
             */
            var hoverStart_1 = function (e) {
                if (onHoverStart != null) {
                    onHoverStart(e);
                }
                if (onHoverChange != null) {
                    onHoverChange(true);
                }
                // Set the listeners needed for the rest of the hover gesture.
                if (onHoverUpdate != null) {
                    addMoveListener(target, !disabled ? moveListener_1 : null);
                }
                addLeaveListener(target, !disabled ? leaveListener_1 : null);
            };
            /**
             * Enter element
             */
            var enterListener = function (e) {
                var target = targetRef.current;
                if (target != null && getPointerType(e) !== 'touch') {
                    if (contain) {
                        dispatchCustomEvent(target, lockEventType);
                    }
                    hoverStart_1(e);
                    var lockListener = function (lockEvent) {
                        if (lockEvent.target !== target) {
                            hoverEnd_1(e);
                        }
                    };
                    var unlockListener = function (lockEvent) {
                        if (lockEvent.target !== target) {
                            hoverStart_1(e);
                        }
                    };
                    addLockListener(target, !disabled ? lockListener : null);
                    addUnlockListener(target, !disabled ? unlockListener : null);
                }
            };
            addEnterListener(target, !disabled ? enterListener : null);
        }
    }, [
        addEnterListener,
        addMoveListener,
        addLeaveListener,
        addLockListener,
        addUnlockListener,
        contain,
        disabled,
        onHoverStart,
        onHoverChange,
        onHoverUpdate,
        onHoverEnd,
        targetRef,
    ]);
}
