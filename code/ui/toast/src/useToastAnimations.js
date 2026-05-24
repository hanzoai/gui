"use strict";
/**
 * Hook for cross-animation-driver toast drag animations.
 *
 * Animation strategy (all cross-driver):
 * - AnimatePresence => enter/exit styles
 * - transition prop => non-interactive styles (stacking, scale, opacity)
 * - useAnimatedNumber/Style => interactive styles (drag gestures only)
 *
 * This hook handles ONLY the drag gesture animations.
 * Uses the same pattern as Sheet for universal animation support.
 *
 * NOTE: For CSS driver, we use a ref-based approach with direct DOM manipulation
 * because CSS driver's useAnimatedNumberStyle doesn't reactively update.
 * For Motion/Reanimated drivers, we use the AnimatedView + motionValue pattern.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToastAnimations = useToastAnimations;
var constants_1 = require("@hanzogui/constants");
var core_1 = require("@hanzogui/core");
var React = require("react");
// tuned for snappy, premium feel like Sonner
var SPRING_CONFIG = {
    type: 'spring',
    damping: 30,
    stiffness: 400,
    mass: 0.5,
};
var EXIT_DISTANCE = 200;
// simple spring animation for CSS driver
function animateSpring(element, fromX, fromY, toX, toY, config, onComplete) {
    var _a = config.damping, damping = _a === void 0 ? 30 : _a, _b = config.stiffness, stiffness = _b === void 0 ? 400 : _b, _c = config.mass, mass = _c === void 0 ? 0.5 : _c, _d = config.initialVelocityX, initialVelocityX = _d === void 0 ? 0 : _d, _e = config.initialVelocityY, initialVelocityY = _e === void 0 ? 0 : _e, _f = config.fadeOut, fadeOut = _f === void 0 ? false : _f;
    var x = fromX;
    var y = fromY;
    // use initial velocity from gesture for smooth continuation
    var velocityX = initialVelocityX;
    var velocityY = initialVelocityY;
    var animationId = null;
    var targetX = toX;
    var targetY = toY;
    // for fade out, track progress based on distance traveled
    var totalDistance = Math.sqrt(Math.pow((toX - fromX), 2) + Math.pow((toY - fromY), 2)) || 1;
    function step() {
        // spring physics
        var forceX = -stiffness * (x - targetX);
        var forceY = -stiffness * (y - targetY);
        var dampingForceX = -damping * velocityX;
        var dampingForceY = -damping * velocityY;
        var accelerationX = (forceX + dampingForceX) / mass;
        var accelerationY = (forceY + dampingForceY) / mass;
        velocityX += accelerationX * 0.016; // ~60fps
        velocityY += accelerationY * 0.016;
        x += velocityX * 0.016;
        y += velocityY * 0.016;
        element.style.transform = "translate3d(".concat(x, "px, ").concat(y, "px, 0)");
        // animate opacity based on progress toward target
        if (fadeOut) {
            var distanceTraveled = Math.sqrt(Math.pow((x - fromX), 2) + Math.pow((y - fromY), 2));
            var progress = Math.min(distanceTraveled / totalDistance, 1);
            element.style.opacity = String(1 - progress);
        }
        // check if close enough to target and velocity is low
        var distanceX = Math.abs(x - targetX);
        var distanceY = Math.abs(y - targetY);
        var speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (distanceX < 0.5 && distanceY < 0.5 && speed < 0.5) {
            element.style.transform = "translate3d(".concat(targetX, "px, ").concat(targetY, "px, 0)");
            if (fadeOut) {
                element.style.opacity = '0';
            }
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            return;
        }
        animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
    return function () {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}
function useToastAnimations(options) {
    var _a;
    if (options === void 0) { options = {}; }
    var onExitComplete = options.onExitComplete, reducedMotion = options.reducedMotion, _b = options.swipeAxis, swipeAxis = _b === void 0 ? 'horizontal' : _b;
    var animationDriver = (0, core_1.useConfiguration)().animationDriver;
    if (!animationDriver) {
        throw new Error('Toast requires an animation driver to be set in HanzoguiProvider');
    }
    var useAnimatedNumber = animationDriver.useAnimatedNumber, useAnimatedNumberStyle = animationDriver.useAnimatedNumberStyle, useAnimatedNumbersStyle = animationDriver.useAnimatedNumbersStyle;
    var AnimatedView = ((_a = animationDriver.View) !== null && _a !== void 0 ? _a : core_1.View);
    // ref for direct DOM manipulation (CSS driver fallback)
    var dragRef = React.useRef(null);
    var cancelAnimationRef = React.useRef(null);
    var currentOffsetRef = React.useRef({ x: 0, y: 0 });
    // on web, use direct DOM for drag (CSS driver has no reactive style updates)
    // on native, use the animation driver's AnimatedView + animatedStyle
    var useDirectDom = constants_1.isWeb;
    // animated values for drag translation
    var translateX = useAnimatedNumber(0);
    var translateY = useAnimatedNumber(0);
    // multi-value: both axes reactive in one animated style (off-thread on Reanimated)
    var animatedStyleMulti = useAnimatedNumbersStyle
        ? useAnimatedNumbersStyle([translateX, translateY], function (x, y) {
            'worklet';
            return { transform: [{ translateX: x }, { translateY: y }] };
        })
        : null;
    // single-value fallback for drivers without useAnimatedNumbersStyle
    var animatedStyleFallback = useAnimatedNumberStyle(swipeAxis === 'vertical' ? translateY : translateX, function (primary) {
        'worklet';
        var secondary = swipeAxis === 'vertical' ? translateX.getValue() : translateY.getValue();
        return swipeAxis === 'vertical'
            ? { transform: [{ translateX: secondary }, { translateY: primary }] }
            : { transform: [{ translateX: primary }, { translateY: secondary }] };
    });
    var animatedStyle = animatedStyleMulti !== null && animatedStyleMulti !== void 0 ? animatedStyleMulti : animatedStyleFallback;
    // set drag offset directly (no animation) - used during gesture
    var setDragOffset = (0, core_1.useEvent)(function (x, y) {
        var _a;
        // cancel any running animation (e.g., spring back from previous gesture)
        (_a = cancelAnimationRef.current) === null || _a === void 0 ? void 0 : _a.call(cancelAnimationRef);
        cancelAnimationRef.current = null;
        currentOffsetRef.current = { x: x, y: y };
        if (useDirectDom && dragRef.current) {
            // direct DOM manipulation for CSS driver
            dragRef.current.style.transform = "translate3d(".concat(x, "px, ").concat(y, "px, 0)");
            dragRef.current.style.opacity = '1'; // reset in case previous animation faded it
        }
        else {
            // use animation driver for motion/reanimated
            translateX.setValue(x, { type: 'direct' });
            translateY.setValue(y, { type: 'direct' });
        }
    });
    // spring back to origin after cancelled drag
    var springBack = (0, core_1.useEvent)(function (onComplete) {
        var _a;
        // cancel any running animation
        (_a = cancelAnimationRef.current) === null || _a === void 0 ? void 0 : _a.call(cancelAnimationRef);
        if (reducedMotion) {
            // instant for reduced motion
            if (useDirectDom && dragRef.current) {
                dragRef.current.style.transform = 'translate3d(0px, 0px, 0)';
            }
            else {
                translateX.setValue(0, { type: 'direct' });
                translateY.setValue(0, { type: 'direct' });
            }
            currentOffsetRef.current = { x: 0, y: 0 };
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            return;
        }
        if (useDirectDom && dragRef.current) {
            // use JS spring animation for CSS driver
            var _b = currentOffsetRef.current, x = _b.x, y = _b.y;
            cancelAnimationRef.current = animateSpring(dragRef.current, x, y, 0, 0, SPRING_CONFIG, function () {
                currentOffsetRef.current = { x: 0, y: 0 };
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            });
        }
        else {
            // use animation driver for motion/reanimated
            translateX.setValue(0, SPRING_CONFIG);
            translateY.setValue(0, SPRING_CONFIG, onComplete);
        }
    });
    // animate out in a direction after successful swipe
    // velocity is in px/ms from gesture, used for smooth momentum continuation
    var animateOut = (0, core_1.useEvent)(function (direction, velocity, onComplete) {
        var _a;
        // cancel any running animation
        (_a = cancelAnimationRef.current) === null || _a === void 0 ? void 0 : _a.call(cancelAnimationRef);
        var _b = currentOffsetRef.current, curX = _b.x, curY = _b.y;
        // ensure exit target is always further than current drag position
        // (user may have dragged past EXIT_DISTANCE already)
        var exitX = direction === 'left' ? -EXIT_DISTANCE : direction === 'right' ? EXIT_DISTANCE : 0;
        var exitY = direction === 'up' ? -EXIT_DISTANCE : direction === 'down' ? EXIT_DISTANCE : 0;
        if (direction === 'left' && curX < exitX)
            exitX = curX - 50;
        else if (direction === 'right' && curX > exitX)
            exitX = curX + 50;
        if (direction === 'up' && curY < exitY)
            exitY = curY - 50;
        else if (direction === 'down' && curY > exitY)
            exitY = curY + 50;
        if (reducedMotion) {
            // instant for reduced motion
            if (useDirectDom && dragRef.current) {
                dragRef.current.style.transform = "translate3d(".concat(exitX, "px, ").concat(exitY, "px, 0)");
            }
            else {
                translateX.setValue(exitX, { type: 'direct' });
                translateY.setValue(exitY, { type: 'direct' });
            }
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
            return;
        }
        // convert velocity from px/ms to px/frame (assuming 60fps = 16.67ms/frame)
        // multiply by ~500 to get a reasonable initial velocity for the spring
        var velocityScale = (velocity !== null && velocity !== void 0 ? velocity : 0) * 500;
        var initialVelocityX = direction === 'left' ? -velocityScale : direction === 'right' ? velocityScale : 0;
        var initialVelocityY = direction === 'up' ? -velocityScale : direction === 'down' ? velocityScale : 0;
        // exit animation config - tuned for smooth momentum continuation
        var exitConfig = {
            damping: 25,
            stiffness: 350,
            mass: 0.4,
            initialVelocityX: initialVelocityX,
            initialVelocityY: initialVelocityY,
            fadeOut: true,
        };
        if (useDirectDom && dragRef.current) {
            // use JS spring animation for CSS driver
            var _c = currentOffsetRef.current, x = _c.x, y = _c.y;
            cancelAnimationRef.current = animateSpring(dragRef.current, x, y, exitX, exitY, exitConfig, function () {
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
                onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
            });
        }
        else {
            // animation driver path (reanimated/RN)
            var springConfig = {
                type: 'spring',
                damping: 25,
                stiffness: 350,
                mass: 0.4,
            };
            translateX.setValue(exitX, springConfig);
            translateY.setValue(exitY, springConfig, function () {
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
                onExitComplete === null || onExitComplete === void 0 ? void 0 : onExitComplete();
            });
        }
    });
    var stop = (0, core_1.useEvent)(function () {
        var _a;
        (_a = cancelAnimationRef.current) === null || _a === void 0 ? void 0 : _a.call(cancelAnimationRef);
        translateX.stop();
        translateY.stop();
    });
    // cleanup on unmount
    React.useEffect(function () {
        return function () {
            var _a;
            (_a = cancelAnimationRef.current) === null || _a === void 0 ? void 0 : _a.call(cancelAnimationRef);
        };
    }, []);
    return {
        setDragOffset: setDragOffset,
        springBack: springBack,
        animateOut: animateOut,
        stop: stop,
        animatedStyle: animatedStyle,
        AnimatedView: AnimatedView,
        dragRef: dragRef,
    };
}
