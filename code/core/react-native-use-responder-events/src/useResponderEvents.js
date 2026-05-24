"use strict";
/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponderEvents = useResponderEvents;
exports.getResponderConfigIfDefined = getResponderConfigIfDefined;
var React = require("react");
var ResponderSystem = require("./ResponderSystem");
__exportStar(require("./utils"), exports);
var emptyObject = {};
var Attached = new WeakMap();
var Ids = new WeakMap();
function useResponderEvents(hostRef, configIn) {
    var _a;
    if (configIn === void 0) { configIn = emptyObject; }
    var config = getResponderConfigIfDefined(configIn);
    // hanzogui + rnw compat
    var node = ((_a = hostRef === null || hostRef === void 0 ? void 0 : hostRef.current) === null || _a === void 0 ? void 0 : _a.host) || (hostRef === null || hostRef === void 0 ? void 0 : hostRef.current);
    // Register and unregister with the Responder System as necessary
    React.useEffect(function () {
        if (config === emptyObject)
            return;
        ResponderSystem.attachListeners();
        if (!Ids.has(hostRef)) {
            Ids.set(hostRef, "".concat(Math.random()));
        }
        var id = Ids.get(hostRef);
        ResponderSystem.addNode(id, node, config);
        Attached.set(hostRef, true);
        return function () {
            ResponderSystem.removeNode(node);
            Attached.set(hostRef, false);
        };
    }, [config, hostRef]);
    if (process.env.NODE_ENV === 'development') {
        React.useDebugValue({
            isResponder: node === ResponderSystem.getResponderNode(),
        });
        React.useDebugValue(config);
    }
}
function getResponderConfigIfDefined(_a) {
    var onMoveShouldSetResponder = _a.onMoveShouldSetResponder, onMoveShouldSetResponderCapture = _a.onMoveShouldSetResponderCapture, onResponderEnd = _a.onResponderEnd, onResponderGrant = _a.onResponderGrant, onResponderMove = _a.onResponderMove, onResponderReject = _a.onResponderReject, onResponderRelease = _a.onResponderRelease, onResponderStart = _a.onResponderStart, onResponderTerminate = _a.onResponderTerminate, onResponderTerminationRequest = _a.onResponderTerminationRequest, onScrollShouldSetResponder = _a.onScrollShouldSetResponder, onScrollShouldSetResponderCapture = _a.onScrollShouldSetResponderCapture, onSelectionChangeShouldSetResponder = _a.onSelectionChangeShouldSetResponder, onSelectionChangeShouldSetResponderCapture = _a.onSelectionChangeShouldSetResponderCapture, onStartShouldSetResponder = _a.onStartShouldSetResponder, onStartShouldSetResponderCapture = _a.onStartShouldSetResponderCapture;
    return onMoveShouldSetResponder ||
        onMoveShouldSetResponderCapture ||
        onResponderEnd ||
        onResponderGrant ||
        onResponderMove ||
        onResponderReject ||
        onResponderRelease ||
        onResponderStart ||
        onResponderTerminate ||
        onResponderTerminationRequest ||
        onScrollShouldSetResponder ||
        onScrollShouldSetResponderCapture ||
        onSelectionChangeShouldSetResponder ||
        onSelectionChangeShouldSetResponderCapture ||
        onStartShouldSetResponder ||
        onStartShouldSetResponderCapture
        ? {
            onMoveShouldSetResponder: onMoveShouldSetResponder,
            onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
            onResponderEnd: onResponderEnd,
            onResponderGrant: onResponderGrant,
            onResponderMove: onResponderMove,
            onResponderReject: onResponderReject,
            onResponderRelease: onResponderRelease,
            onResponderStart: onResponderStart,
            onResponderTerminate: onResponderTerminate,
            onResponderTerminationRequest: onResponderTerminationRequest,
            onScrollShouldSetResponder: onScrollShouldSetResponder,
            onScrollShouldSetResponderCapture: onScrollShouldSetResponderCapture,
            onSelectionChangeShouldSetResponder: onSelectionChangeShouldSetResponder,
            onSelectionChangeShouldSetResponderCapture: onSelectionChangeShouldSetResponderCapture,
            onStartShouldSetResponder: onStartShouldSetResponder,
            onStartShouldSetResponderCapture: onStartShouldSetResponderCapture,
        }
        : emptyObject;
}
