"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSafeAreaValue = resolveSafeAreaValue;
var safeAreaTokens = {
    $safeAreaTop: 'env(safe-area-inset-top)',
    $safeAreaBottom: 'env(safe-area-inset-bottom)',
    $safeAreaLeft: 'env(safe-area-inset-left)',
    $safeAreaRight: 'env(safe-area-inset-right)',
};
function resolveSafeAreaValue(value) {
    return safeAreaTokens[value];
}
