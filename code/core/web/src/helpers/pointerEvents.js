"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePointerEvents = usePointerEvents;
/**
 * Web pointer events - no-op, pointer events work natively on web
 *
 * For drag scenarios, users should call e.target.setPointerCapture(e.pointerId)
 * in their onPointerDown handler to receive move events outside element bounds.
 */
function usePointerEvents(_props, _viewProps) {
    // pointer events pass through directly on web
}
