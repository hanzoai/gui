"use strict";
// compat with bad imports in native
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegenNativeComponent = codegenNativeComponent;
function codegenNativeComponent() {
    console.warn("codegenNativeComponent on web is a no-op");
    return {};
}
