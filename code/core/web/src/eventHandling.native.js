"use strict";
/**
 * Native event handling - uses RNGH when available, falls back to responder system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebEvents = getWebEvents;
exports.useEvents = useEvents;
exports.wrapWithGestureDetector = wrapWithGestureDetector;
var helpers_1 = require("@hanzogui/helpers");
var native_1 = require("@hanzogui/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var mainThreadPressEvents_1 = require("./helpers/mainThreadPressEvents");
// web events not used on native
function getWebEvents() {
    return {};
}
function useEvents(events, viewProps, stateRef, staticConfig, isHOC, isInsideNativeMenu, debugName) {
    // focus/blur events always attached directly
    if (events) {
        if (events.onFocus) {
            viewProps['onFocus'] = events.onFocus;
        }
        if (events.onBlur) {
            viewProps['onBlur'] = events.onBlur;
        }
    }
    var hasPressEvents = 
    // its stable and always on if you have in/out/regular
    events === null || events === void 0 ? void 0 : events.onPress;
    var hasAnyPressCallbacks = Boolean((events === null || events === void 0 ? void 0 : events.onPress) || (events === null || events === void 0 ? void 0 : events.onPressIn) || (events === null || events === void 0 ? void 0 : events.onPressOut) || (events === null || events === void 0 ? void 0 : events.onLongPress));
    var gh = (0, native_1.getGestureHandler)();
    // track if we ever had press events to avoid re-parenting / hooks issues
    if (hasPressEvents) {
        stateRef.current.hasHadEvents = true;
    }
    // avoid hooks/reparenting
    var everEnabled = Boolean(hasPressEvents || stateRef.current.hasHadEvents);
    var isUsingRNGH = gh.isEnabled;
    // NOW handle early returns (after all hooks are called)
    // THESE BRANCHES ARE NEVER CHANGING RENDER-TO-RENDER
    // input special case - TextInput needs press events attached directly (not via RNGH)
    if (staticConfig.isInput) {
        if (events) {
            var onPressIn = events.onPressIn, onPressOut = events.onPressOut, onPress = events.onPress;
            var inputEvents = {
                onPressIn: onPressIn,
                onPressOut: onPressOut || onPress,
            };
            if (onPressOut && onPress) {
                // only supports onPressIn and onPressOut so combine them
                inputEvents.onPressOut = (0, helpers_1.composeEventHandlers)(onPress, onPressOut);
            }
            Object.assign(viewProps, inputEvents);
        }
        // inputs don't use gesture handler
        return null;
    }
    // HOC special case - pass press events to the inner component instead of wrapping
    // HOC components may return null which crashes GestureDetector (it tries to access
    // _internalInstanceHandle on a null native view). By passing events down, the inner
    // component handles gesture detection at its own level.
    //
    // Composite component special case - when styled() wraps a non-Hanzogui component
    // (e.g. React.forwardRef), the elementType becomes that composite component.
    // GestureDetector/responder wrapping around a composite component breaks during
    // re-renders triggered by pressStyle state changes (the gesture/responder loses
    // attachment to the native view through the composite layers). Pass events as props
    // so they flow through to the inner native View.
    var isCompositeComponent = !isHOC && staticConfig.Component && typeof staticConfig.Component !== 'string';
    if (isHOC || isCompositeComponent) {
        if (events) {
            var onPressIn = events.onPressIn, onPressOut = events.onPressOut, onPress = events.onPress, onLongPress = events.onLongPress, delayLongPress = events.delayLongPress;
            Object.assign(viewProps, {
                onPressIn: onPressIn,
                onPressOut: onPressOut,
                onPress: onPress,
                onLongPress: onLongPress,
                delayLongPress: delayLongPress,
            });
        }
        // HOCs and composite components don't use gesture handler at this level
        return null;
    }
    // rngh path - logic (hooks already called above)
    if (isUsingRNGH) {
        // rngh path - hooks
        var callbacksRef_1 = (0, react_1.useRef)(isUsingRNGH ? {} : null);
        var gestureRef = (0, react_1.useRef)(null);
        if (everEnabled) {
            // store callbacks in refs so gesture doesn't need to be recreated on every render
            callbacksRef_1.current = hasPressEvents
                ? {
                    onPressIn: events.onPressIn,
                    onPressOut: events.onPressOut,
                    onPress: events.onPress,
                    onLongPress: events.onLongPress,
                }
                : {};
            // only create gesture once, callbacks are read from ref
            if (!gestureRef.current) {
                if (isInsideNativeMenu) {
                    // Inside native menus on Android: use Manual gesture with manualActivation
                    // so it never goes ACTIVE (which would send ACTION_CANCEL to MenuView).
                    // Press callbacks fire via onTouchesDown/Up instead.
                    var Gesture = gh.state.Gesture;
                    var manual = Gesture.Manual()
                        .runOnJS(true)
                        .manualActivation(true)
                        .onTouchesDown(function () {
                        var _a, _b;
                        (_b = (_a = callbacksRef_1.current).onPressIn) === null || _b === void 0 ? void 0 : _b.call(_a, {});
                    })
                        .onTouchesUp(function () {
                        var _a, _b, _c, _d;
                        (_b = (_a = callbacksRef_1.current).onPress) === null || _b === void 0 ? void 0 : _b.call(_a, {});
                        (_d = (_c = callbacksRef_1.current).onPressOut) === null || _d === void 0 ? void 0 : _d.call(_c, {});
                    })
                        .onTouchesCancelled(function () {
                        var _a, _b;
                        (_b = (_a = callbacksRef_1.current).onPressOut) === null || _b === void 0 ? void 0 : _b.call(_a, {});
                    });
                    gestureRef.current = manual;
                }
                else {
                    gestureRef.current = gh.createPressGesture({
                        debugName: debugName,
                        onPressIn: function (e) { var _a, _b; return (_b = (_a = callbacksRef_1.current).onPressIn) === null || _b === void 0 ? void 0 : _b.call(_a, e); },
                        onPressOut: function (e) { var _a, _b; return (_b = (_a = callbacksRef_1.current).onPressOut) === null || _b === void 0 ? void 0 : _b.call(_a, e); },
                        onPress: function (e) { var _a, _b; return (_b = (_a = callbacksRef_1.current).onPress) === null || _b === void 0 ? void 0 : _b.call(_a, e); },
                        onLongPress: function (e) { var _a, _b; return (_b = (_a = callbacksRef_1.current).onLongPress) === null || _b === void 0 ? void 0 : _b.call(_a, e); },
                        delayLongPress: events === null || events === void 0 ? void 0 : events.delayLongPress,
                        hitSlop: viewProps.hitSlop,
                    });
                }
            }
            // TODO update viewProps.hitSlop / events.delayLongPress!
            return gestureRef.current;
        }
        return null;
    }
    (0, mainThreadPressEvents_1.useMainThreadPressEvents)(events, viewProps, hasPressEvents, debugName);
    return null;
}
function wrapWithGestureDetector(content, gesture, stateRef, isHOC, isCompositeComponent) {
    // Skip wrapping for HOC and composite components - they pass press events
    // to the inner component via props instead of using GestureDetector
    if (isHOC || isCompositeComponent) {
        return content;
    }
    var gh = (0, native_1.getGestureHandler)();
    var _a = gh.state, GestureDetector = _a.GestureDetector, Gesture = _a.Gesture;
    // avoid re-parenting: only wrap if we ever had press events
    var shouldWrap = stateRef.current.hasHadEvents;
    if (!GestureDetector || !shouldWrap) {
        return content;
    }
    // use actual gesture or no-op Manual gesture to maintain tree structure
    var gestureToUse = gesture || (Gesture === null || Gesture === void 0 ? void 0 : Gesture.Manual());
    if (!gestureToUse) {
        return content;
    }
    var detector = react_1.default.createElement(GestureDetector, { gesture: gestureToUse }, content);
    // wrap in a responder-claiming View OUTSIDE the GestureDetector.
    // this blocks parent RN Pressable/TouchableOpacity from firing when
    // a press lands on this component, without causing the RNGH deadlock
    // that happens when responder claims are applied to a view inside
    // the gesture-managed subtree (RNGH intercepts UIManager.setJSResponder
    // globally — when the claimant is one of its own gesture targets it
    // creates a coordination conflict, especially at scale on first mount).
    return react_1.default.createElement(react_native_1.View, {
        collapsable: false,
        // display: contents keeps the wrapper transparent to layout (new arch /
        // Fabric) so it doesn't become an extra flex child and shift siblings.
        style: responderWrapperStyle,
        onStartShouldSetResponder: responderClaim,
        onResponderTerminationRequest: responderDeny,
    }, detector);
}
var responderClaim = function () { return true; };
var responderDeny = function () { return false; };
var responderWrapperStyle = { display: 'contents' };
