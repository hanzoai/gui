"use strict";
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
var invariant_1 = require("./invariant");
var index_1 = require("./requestIdleCallback/index");
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this._registry = {};
    }
    EventEmitter.prototype.addListener = function (eventType, listener, context) {
        var registrations = this._allocate(eventType);
        var registration = {
            context: context,
            listener: listener,
            remove: function () {
                registrations.delete(registration);
            },
        };
        registrations.add(registration);
        return registration;
    };
    EventEmitter.prototype.emit = function (eventType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var registrations = this._registry[eventType];
        if (registrations != null) {
            for (var _a = 0, _b = Array.from(registrations); _a < _b.length; _a++) {
                var registration = _b[_a];
                registration.listener.apply(registration.context, args);
            }
        }
    };
    EventEmitter.prototype._allocate = function (eventType) {
        var registrations = this._registry[eventType];
        if (registrations == null) {
            registrations = new Set();
            this._registry[eventType] = registrations;
        }
        return registrations;
    };
    return EventEmitter;
}());
var TaskQueue = /** @class */ (function () {
    function TaskQueue(_a) {
        var onMoreTasks = _a.onMoreTasks;
        this._onMoreTasks = onMoreTasks;
        this._queueStack = [{ tasks: [], popable: true }];
    }
    TaskQueue.prototype.enqueueTasks = function (tasks) {
        var _this = this;
        tasks.forEach(function (task) { return _this._enqueue(task); });
    };
    TaskQueue.prototype.cancelTasks = function (tasksToCancel) {
        this._queueStack = this._queueStack
            .map(function (queue) { return (__assign(__assign({}, queue), { tasks: queue.tasks.filter(function (task) { return !tasksToCancel.includes(task); }) })); })
            .filter(function (queue, idx) { return queue.tasks.length > 0 || idx === 0; });
    };
    TaskQueue.prototype.hasTasksToProcess = function () {
        return this._getCurrentQueue().length > 0;
    };
    TaskQueue.prototype.processNext = function () {
        var queue = this._getCurrentQueue();
        if (queue.length) {
            var task = queue.shift();
            try {
                if (typeof task === 'object' && task && 'gen' in task) {
                    this._genPromise(task);
                }
                else if (typeof task === 'object' && task && 'run' in task) {
                    ;
                    task.run();
                }
                else {
                    (0, invariant_1.invariant)(typeof task === 'function', 'Expected Function, SimpleTask, or PromiseTask, but got:\n' +
                        JSON.stringify(task, null, 2));
                    task();
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    var taskName = task && typeof task === 'object' && 'name' in task ? task.name : '';
                    e.message = 'TaskQueue: Error with task ' + taskName + ': ' + e.message;
                }
                throw e;
            }
        }
    };
    TaskQueue.prototype._enqueue = function (task) {
        this._getCurrentQueue().push(task);
    };
    TaskQueue.prototype._getCurrentQueue = function () {
        var stackIdx = this._queueStack.length - 1;
        var queue = this._queueStack[stackIdx];
        if (queue.popable && queue.tasks.length === 0 && stackIdx > 0) {
            this._queueStack.pop();
            return this._getCurrentQueue();
        }
        else {
            return queue.tasks;
        }
    };
    TaskQueue.prototype._genPromise = function (task) {
        var _this = this;
        var length = this._queueStack.push({ tasks: [], popable: false });
        var stackIdx = length - 1;
        var stackItem = this._queueStack[stackIdx];
        task
            .gen()
            .then(function () {
            stackItem.popable = true;
            if (_this.hasTasksToProcess()) {
                _this._onMoreTasks();
            }
        })
            .catch(function (ex) {
            setTimeout(function () {
                if (ex instanceof Error) {
                    ex.message = "TaskQueue: Error resolving Promise in task ".concat(task.name, ": ").concat(ex.message);
                }
                throw ex;
            }, 0);
        });
    };
    return TaskQueue;
}());
var _emitter = new EventEmitter();
exports.InteractionManager = {
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
                name: 'resolve ' +
                    ((task && typeof task === 'object' && 'name' in task && task.name) || '?'),
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
        (0, invariant_1.invariant)(!!handle, 'Must provide a handle to clear.');
        _scheduleUpdate();
        _addInteractionSet.delete(handle);
        _deleteInteractionSet.add(handle);
    },
    addListener: _emitter.addListener.bind(_emitter),
    /**
     * Set deadline for task processing
     */
    setDeadline: function (deadline) {
        _deadline = deadline;
    },
};
var _interactionSet = new Set();
var _addInteractionSet = new Set();
var _deleteInteractionSet = new Set();
var _taskQueue = new TaskQueue({ onMoreTasks: _scheduleUpdate });
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
            _nextUpdateHandle = (0, index_1.requestIdleCallback)(_processUpdate);
        }
    }
}
/**
 * Notify listeners, process queue, etc
 */
function _processUpdate() {
    _nextUpdateHandle = null;
    var interactionCount = _interactionSet.size;
    _addInteractionSet.forEach(function (handle) { return _interactionSet.add(handle); });
    _deleteInteractionSet.forEach(function (handle) { return _interactionSet.delete(handle); });
    var nextInteractionCount = _interactionSet.size;
    if (interactionCount !== 0 && nextInteractionCount === 0) {
        _emitter.emit('interactionComplete');
    }
    else if (interactionCount === 0 && nextInteractionCount !== 0) {
        _emitter.emit('interactionStart');
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
