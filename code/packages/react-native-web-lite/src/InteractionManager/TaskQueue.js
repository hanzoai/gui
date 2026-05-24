"use strict";
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
exports.TaskQueue = void 0;
var react_native_web_internals_1 = require("@hanzogui/react-native-web-internals");
var TaskQueue = /** @class */ (function () {
    function TaskQueue(_a) {
        var onMoreTasks = _a.onMoreTasks;
        this._onMoreTasks = onMoreTasks;
        this._queueStack = [{ tasks: [], popable: true }];
    }
    TaskQueue.prototype.enqueue = function (task) {
        this._getCurrentQueue().push(task);
    };
    TaskQueue.prototype.enqueueTasks = function (tasks) {
        var _this = this;
        tasks.forEach(function (task) { return _this.enqueue(task); });
    };
    TaskQueue.prototype.cancelTasks = function (tasksToCancel) {
        this._queueStack = this._queueStack
            .map(function (queue) { return (__assign(__assign({}, queue), { tasks: queue.tasks.filter(function (task) { return !tasksToCancel.includes(task); }) })); })
            .filter(function (queue, idx) { return queue.tasks.length > 0 || idx === 0; });
    };
    TaskQueue.prototype.hasTasksToProcess = function () {
        return this._getCurrentQueue().length > 0;
    };
    /**
     * Executes the next task in the queue.
     */
    TaskQueue.prototype.processNext = function () {
        var queue = this._getCurrentQueue();
        if (queue.length) {
            var task = queue.shift();
            try {
                if (typeof task === 'object' && 'gen' in task) {
                    this._genPromise(task);
                }
                else if (typeof task === 'object' && 'run' in task) {
                    task.run();
                }
                else {
                    (0, react_native_web_internals_1.invariant)(typeof task === 'function', 'Expected Function, SimpleTask, or PromiseTask, but got:\n' +
                        JSON.stringify(task, null, 2));
                    task();
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    e.message =
                        'TaskQueue: Error with task ' + ((task === null || task === void 0 ? void 0 : task.name) || '') + ': ' + e.message;
                }
                throw e;
            }
        }
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
exports.TaskQueue = TaskQueue;
