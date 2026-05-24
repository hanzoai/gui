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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = exports.ToastState = void 0;
// counter for generating unique toast ids
var toastsCounter = 1;
/**
 * Observer class that manages toast state globally.
 * Follows the pattern from Sonner for a clean, decoupled architecture.
 */
var Observer = /** @class */ (function () {
    function Observer() {
        var _this = this;
        this.subscribers = [];
        this.toasts = [];
        this.dismissedToasts = new Set();
        /**
         * Subscribe to toast state changes.
         * Returns an unsubscribe function.
         */
        this.subscribe = function (subscriber) {
            _this.subscribers.push(subscriber);
            return function () {
                var index = _this.subscribers.indexOf(subscriber);
                if (index > -1) {
                    _this.subscribers.splice(index, 1);
                }
            };
        };
        /**
         * Publish a toast to all subscribers
         */
        this.publish = function (data) {
            _this.subscribers.forEach(function (subscriber) { return subscriber(data); });
        };
        /**
         * Add a new toast to the internal array and publish to subscribers
         */
        this.addToast = function (data) {
            _this.publish(data);
            _this.toasts = __spreadArray(__spreadArray([], _this.toasts, true), [data], false);
        };
        /**
         * Create or update a toast
         */
        this.create = function (data) {
            var _a;
            var title = data.title, rest = __rest(data, ["title"]);
            var id = typeof (data === null || data === void 0 ? void 0 : data.id) === 'number' || (typeof (data === null || data === void 0 ? void 0 : data.id) === 'string' && data.id.length > 0)
                ? data.id
                : toastsCounter++;
            var alreadyExists = _this.toasts.find(function (toast) { return toast.id === id; });
            var dismissible = (_a = data.dismissible) !== null && _a !== void 0 ? _a : true;
            // if this toast was previously dismissed, clear that
            if (_this.dismissedToasts.has(id)) {
                _this.dismissedToasts.delete(id);
            }
            if (alreadyExists) {
                // update existing toast
                _this.toasts = _this.toasts.map(function (toast) {
                    if (toast.id === id) {
                        _this.publish(__assign(__assign(__assign({}, toast), data), { id: id, title: title, dismissible: dismissible }));
                        return __assign(__assign(__assign({}, toast), data), { id: id, title: title, dismissible: dismissible });
                    }
                    return toast;
                });
            }
            else {
                _this.addToast(__assign(__assign({ title: title }, rest), { dismissible: dismissible, id: id }));
            }
            return id;
        };
        /**
         * Dismiss a toast by id, or all toasts if no id provided
         */
        this.dismiss = function (id) {
            if (id !== undefined) {
                _this.dismissedToasts.add(id);
                // use requestAnimationFrame to batch updates
                requestAnimationFrame(function () {
                    _this.subscribers.forEach(function (subscriber) { return subscriber({ id: id, dismiss: true }); });
                });
            }
            else {
                // dismiss all
                _this.toasts.forEach(function (toast) {
                    _this.subscribers.forEach(function (subscriber) {
                        return subscriber({ id: toast.id, dismiss: true });
                    });
                });
            }
            return id;
        };
        /**
         * Show a basic toast message
         */
        this.message = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'default' }));
        };
        /**
         * Show a success toast
         */
        this.success = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'success' }));
        };
        /**
         * Show an error toast
         */
        this.error = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'error' }));
        };
        /**
         * Show a warning toast
         */
        this.warning = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'warning' }));
        };
        /**
         * Show an info toast
         */
        this.info = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'info' }));
        };
        /**
         * Show a loading toast
         */
        this.loading = function (title, data) {
            return _this.create(__assign(__assign({}, data), { title: title, type: 'loading' }));
        };
        /**
         * Show a toast for a promise, automatically transitioning through
         * loading -> success/error states
         */
        this.promise = function (promise, data) {
            if (!data) {
                return;
            }
            var id = undefined;
            // show loading state if provided
            if (data.loading !== undefined) {
                id = _this.create({
                    promise: promise,
                    type: 'loading',
                    title: data.loading,
                    description: typeof data.description !== 'function' ? data.description : undefined,
                    // loading toasts shouldn't auto-dismiss
                    duration: Number.POSITIVE_INFINITY,
                });
            }
            var p = Promise.resolve(promise instanceof Function ? promise() : promise);
            var shouldDismiss = id !== undefined;
            var result;
            var originalPromise = p
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var errorMsg, _a, description, _b, successMsg, _c, description, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            result = ['resolve', response];
                            if (!(isHttpResponse(response) && !response.ok)) return [3 /*break*/, 7];
                            shouldDismiss = false;
                            if (!(typeof data.error === 'function')) return [3 /*break*/, 2];
                            return [4 /*yield*/, data.error("HTTP error! status: ".concat(response.status))];
                        case 1:
                            _a = _e.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = data.error;
                            _e.label = 3;
                        case 3:
                            errorMsg = _a;
                            if (!(typeof data.description === 'function')) return [3 /*break*/, 5];
                            return [4 /*yield*/, data.description("HTTP error! status: ".concat(response.status))];
                        case 4:
                            _b = _e.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = data.description;
                            _e.label = 6;
                        case 6:
                            description = _b;
                            this.create({ id: id, type: 'error', title: errorMsg, description: description });
                            return [3 /*break*/, 14];
                        case 7:
                            if (!(data.success !== undefined)) return [3 /*break*/, 14];
                            shouldDismiss = false;
                            if (!(typeof data.success === 'function')) return [3 /*break*/, 9];
                            return [4 /*yield*/, data.success(response)];
                        case 8:
                            _c = _e.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _c = data.success;
                            _e.label = 10;
                        case 10:
                            successMsg = _c;
                            if (!(typeof data.description === 'function')) return [3 /*break*/, 12];
                            return [4 /*yield*/, data.description(response)];
                        case 11:
                            _d = _e.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            _d = data.description;
                            _e.label = 13;
                        case 13:
                            description = _d;
                            this.create({ id: id, type: 'success', title: successMsg, description: description });
                            _e.label = 14;
                        case 14: return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                var errorMsg, _a, description, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            result = ['reject', error];
                            if (!(data.error !== undefined)) return [3 /*break*/, 7];
                            shouldDismiss = false;
                            if (!(typeof data.error === 'function')) return [3 /*break*/, 2];
                            return [4 /*yield*/, data.error(error)];
                        case 1:
                            _a = _c.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = data.error;
                            _c.label = 3;
                        case 3:
                            errorMsg = _a;
                            if (!(typeof data.description === 'function')) return [3 /*break*/, 5];
                            return [4 /*yield*/, data.description(error)];
                        case 4:
                            _b = _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = data.description;
                            _c.label = 6;
                        case 6:
                            description = _b;
                            this.create({ id: id, type: 'error', title: errorMsg, description: description });
                            _c.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            }); })
                .finally(function () {
                var _a;
                if (shouldDismiss) {
                    // toast is still in load state, dismiss it
                    _this.dismiss(id);
                    id = undefined;
                }
                (_a = data.finally) === null || _a === void 0 ? void 0 : _a.call(data);
            });
            // return a promise that can be unwrapped
            var unwrap = function () {
                return new Promise(function (resolve, reject) {
                    return originalPromise
                        .then(function () { return (result[0] === 'reject' ? reject(result[1]) : resolve(result[1])); })
                        .catch(reject);
                });
            };
            if (typeof id !== 'string' && typeof id !== 'number') {
                return { unwrap: unwrap };
            }
            else {
                return Object.assign(id, { unwrap: unwrap });
            }
        };
        /**
         * Show a custom JSX toast
         */
        this.custom = function (jsx, data) {
            var _a;
            var id = (_a = data === null || data === void 0 ? void 0 : data.id) !== null && _a !== void 0 ? _a : toastsCounter++;
            _this.create(__assign(__assign({ jsx: jsx(id) }, data), { id: id }));
            return id;
        };
        /**
         * Get all active (non-dismissed) toasts
         */
        this.getActiveToasts = function () {
            return _this.toasts.filter(function (toast) { return !_this.dismissedToasts.has(toast.id); });
        };
        /**
         * Get full toast history
         */
        this.getHistory = function () {
            return _this.toasts;
        };
    }
    return Observer;
}());
function isHttpResponse(data) {
    return (data &&
        typeof data === 'object' &&
        'ok' in data &&
        typeof data.ok === 'boolean' &&
        'status' in data &&
        typeof data.status === 'number');
}
// singleton instance
exports.ToastState = new Observer();
// basic toast function
var toastFunction = function (title, data) {
    return exports.ToastState.create(__assign(__assign({}, data), { title: title }));
};
// getters
var getHistory = function () { return exports.ToastState.getHistory(); };
var getToasts = function () { return exports.ToastState.getActiveToasts(); };
/**
 * Main toast API - call directly or use methods like toast.success()
 *
 * @example
 * // basic usage
 * toast('Hello world')
 *
 * // with type
 * toast.success('Saved!')
 * toast.error('Something went wrong')
 *
 * // with options
 * toast('Hello', { duration: 5000 })
 *
 * // promise toast
 * toast.promise(fetch('/api'), {
 *   loading: 'Loading...',
 *   success: 'Done!',
 *   error: 'Failed'
 * })
 *
 * // custom JSX
 * toast.custom((id) => <MyToast id={id} />)
 *
 * // dismiss
 * const id = toast('Hello')
 * toast.dismiss(id)
 * toast.dismiss() // dismiss all
 */
exports.toast = Object.assign(toastFunction, {
    success: exports.ToastState.success,
    error: exports.ToastState.error,
    warning: exports.ToastState.warning,
    info: exports.ToastState.info,
    loading: exports.ToastState.loading,
    promise: exports.ToastState.promise,
    custom: exports.ToastState.custom,
    dismiss: exports.ToastState.dismiss,
    message: exports.ToastState.message,
    getHistory: getHistory,
    getToasts: getToasts,
});
