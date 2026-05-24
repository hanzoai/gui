"use strict";
/**
 * Web event handling - maps RN-style events to DOM events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebEvents = getWebEvents;
exports.wrapWithGestureDetector = wrapWithGestureDetector;
exports.useEvents = useEvents;
function getWebEvents(events, webStyle) {
    var _a;
    if (webStyle === void 0) { webStyle = true; }
    return _a = {
            onMouseEnter: events.onMouseEnter,
            onMouseLeave: events.onMouseLeave
        },
        _a[webStyle ? 'onClick' : 'onPress'] = events.onPress,
        _a.onMouseDown = events.onPressIn,
        _a.onMouseUp = events.onPressOut,
        _a.onTouchStart = events.onPressIn,
        _a.onTouchEnd = events.onPressOut,
        _a.onFocus = events.onFocus,
        _a.onBlur = events.onBlur,
        _a;
}
// web doesn't need wrapping - events go directly on element
function wrapWithGestureDetector(content, _gesture, _stateRef, _isHOC, _isCompositeComponent) {
    return content;
}
// no-op on web, events attached via getWebEvents
function useEvents(_events, _viewProps, _stateRef, _staticConfig, _isHOC, _isInsideNativeMenu, _debugName) {
    return null;
}
