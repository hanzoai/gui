"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSafeAreaValue = resolveSafeAreaValue;
var safeAreaEdges = {
    $safeAreaTop: 'top',
    $safeAreaBottom: 'bottom',
    $safeAreaLeft: 'left',
    $safeAreaRight: 'right',
};
function resolveSafeAreaValue(value) {
    var edge = safeAreaEdges[value];
    if (!edge)
        return undefined;
    var g = globalThis;
    var state = g.__hanzogui_native_safe_area_state__;
    if ((state === null || state === void 0 ? void 0 : state.enabled) && state.initialMetrics) {
        return state.initialMetrics.insets[edge];
    }
    return 0;
}
