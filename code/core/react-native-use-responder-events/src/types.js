"use strict";
/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECTION_CHANGE = exports.SELECT = exports.SCROLL = exports.TOUCH_CANCEL = exports.TOUCH_END = exports.TOUCH_MOVE = exports.TOUCH_START = exports.MOUSE_CANCEL = exports.MOUSE_UP = exports.MOUSE_MOVE = exports.MOUSE_DOWN = exports.FOCUS_OUT = exports.CONTEXT_MENU = exports.BLUR = void 0;
exports.isStartish = isStartish;
exports.isMoveish = isMoveish;
exports.isEndish = isEndish;
exports.isCancelish = isCancelish;
exports.isScroll = isScroll;
exports.isSelectionChange = isSelectionChange;
exports.BLUR = 'blur';
exports.CONTEXT_MENU = 'contextmenu';
exports.FOCUS_OUT = 'focusout';
exports.MOUSE_DOWN = 'mousedown';
exports.MOUSE_MOVE = 'mousemove';
exports.MOUSE_UP = 'mouseup';
exports.MOUSE_CANCEL = 'dragstart';
exports.TOUCH_START = 'touchstart';
exports.TOUCH_MOVE = 'touchmove';
exports.TOUCH_END = 'touchend';
exports.TOUCH_CANCEL = 'touchcancel';
exports.SCROLL = 'scroll';
exports.SELECT = 'select';
exports.SELECTION_CHANGE = 'selectionchange';
function isStartish(eventType) {
    return eventType === exports.TOUCH_START || eventType === exports.MOUSE_DOWN;
}
function isMoveish(eventType) {
    return eventType === exports.TOUCH_MOVE || eventType === exports.MOUSE_MOVE;
}
function isEndish(eventType) {
    return eventType === exports.TOUCH_END || eventType === exports.MOUSE_UP || isCancelish(eventType);
}
function isCancelish(eventType) {
    return eventType === exports.TOUCH_CANCEL || eventType === exports.MOUSE_CANCEL;
}
function isScroll(eventType) {
    return eventType === exports.SCROLL;
}
function isSelectionChange(eventType) {
    return eventType === exports.SELECT || eventType === exports.SELECTION_CHANGE;
}
