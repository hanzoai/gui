"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var _EventEmitter_1 = require("../vendor/react-native/emitter/_EventEmitter");
var TaskQueue_1 = require("./TaskQueue");
var requestIdleCallback_1 = require("../modules/requestIdleCallback");
var _emitter = new _EventEmitter_1.default();
var InteractionManager = {
    Events: {
        interactionStart: 'interactionStart',
        interactionComplete: 'interactionComplete',
    },
    /**
     * Schedule a function to run after all interactions have completed.
     */
    runAfterInteractions: function (task) {
        var tasks = [];
        var promise = new Promise(function (resolve) {
            _scheduleUpdate();
            if (task) {
                tasks.push(task);
            }
            tasks.push({
                run: resolve,
                name: 'resolve ' + ((task && task.name) || '?'),
            });
            _taskQueue.enqueueTasks(tasks);
        });
        return {
            then: promise.then.bind(promise),
            done: promise.then.bind(promise),
            cancel: function () {
                _taskQueue.cancelTasks(tasks);
            },
        };
    },
    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle: function () {
        _scheduleUpdate();
        var handle = ++_inc;
        _addInteractionSet.add(handle);
        return handle;
    },
    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle: function (handle) {
        (0, react_native_web_internals_1.invariant)(!!handle, 'Must provide a handle to clear.');
        _scheduleUpdate();
        _addInteractionSet.delete(handle);
        _deleteInteractionSet.add(handle);
    },
    addListener: _emitter.addListener.bind(_emitter),
    /**
     *
     * @param deadline
     */
    setDeadline: function (deadline) {
        _deadline = deadline;
    },
};
exports.InteractionManager = InteractionManager;
var _interactionSet = new Set();
var _addInteractionSet = new Set();
var _deleteInteractionSet = new Set();
var _taskQueue = new TaskQueue_1.TaskQueue({ onMoreTasks: _scheduleUpdate });
var _nextUpdateHandle = null;
var _inc = 0;
var _deadline = -1;
/**
 * Schedule an asynchronous update to the interaction state.
 */
function _scheduleUpdate() {
    if (!_nextUpdateHandle) {
        if (_deadline > 0) {
            _nextUpdateHandle = setTimeout(_processUpdate);
        }
        else {
            _nextUpdateHandle = (0, requestIdleCallback_1.requestIdleCallback)(_processUpdate);
        }
    }
}
/**
 * Notify listeners, process queue, etc.
 */
function _processUpdate() {
    _nextUpdateHandle = null;
    var interactionCount = _interactionSet.size;
    _addInteractionSet.forEach(function (handle) { return _interactionSet.add(handle); });
    _deleteInteractionSet.forEach(function (handle) { return _interactionSet.delete(handle); });
    var nextInteractionCount = _interactionSet.size;
    if (interactionCount !== 0 && nextInteractionCount === 0) {
        _emitter.emit(InteractionManager.Events.interactionComplete);
    }
    else if (interactionCount === 0 && nextInteractionCount !== 0) {
        _emitter.emit(InteractionManager.Events.interactionStart);
    }
    if (nextInteractionCount === 0) {
        // It seems that we can't know the running time of the current event loop,
        // we can only calculate the running time of the current task queue.
        var begin = Date.now();
        while (_taskQueue.hasTasksToProcess()) {
            _taskQueue.processNext();
            if (_deadline > 0 && Date.now() - begin >= _deadline) {
                _scheduleUpdate();
                break;
            }
        }
    }
    _addInteractionSet.clear();
    _deleteInteractionSet.clear();
}
