"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCloseIcon = exports.ToastActionFrame = exports.ToastCloseFrame = exports.ToastItemFrame = exports.ToastPositionWrapper = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Shared visual styled components for toast items.
 * Shared across web and native — imported by ToastComposable.
 */
var core_1 = require("@hanzogui/core");
var stacks_1 = require("@hanzogui/stacks");
var text_1 = require("@hanzogui/text");
/* -------------------------------------------------------------------------------------------------
 * ToastPositionWrapper - handles absolute positioning and stacking animations
 * On web: uses Hanzogui transition/enterStyle/exitStyle
 * On native: replaced by Animated.View with useAnimatedStyle
 * -----------------------------------------------------------------------------------------------*/
exports.ToastPositionWrapper = (0, core_1.styled)(stacks_1.YStack, {
    name: 'ToastPositionWrapper',
    pointerEvents: 'auto',
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
});
/* -------------------------------------------------------------------------------------------------
 * ToastItemFrame - visual styling for the toast
 * Shared across web and native — the visual appearance of the toast card.
 * -----------------------------------------------------------------------------------------------*/
exports.ToastItemFrame = (0, core_1.styled)(stacks_1.YStack, {
    name: 'ToastItem',
    userSelect: 'none',
    cursor: 'default',
    focusable: true,
    variants: {
        unstyled: {
            false: {
                backgroundColor: '$background',
                borderRadius: '$6',
                paddingHorizontal: '$4',
                paddingVertical: '$3',
                borderWidth: 1,
                borderColor: '$borderColor',
                shadowColor: 'rgba(0, 0, 0, 0.15)',
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                focusVisibleStyle: {
                    outlineWidth: 2,
                    outlineColor: '$color8',
                    outlineStyle: 'solid',
                },
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastCloseFrame
 * -----------------------------------------------------------------------------------------------*/
exports.ToastCloseFrame = (0, core_1.styled)(stacks_1.XStack, {
    name: 'ToastClose',
    render: 'button',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    variants: {
        unstyled: {
            false: {
                width: 18,
                height: 18,
                borderRadius: '$10',
                backgroundColor: '$background',
                borderWidth: 1,
                borderColor: '$borderColor',
                shadowColor: 'rgba(0, 0, 0, 0.08)',
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 3,
                hoverStyle: { backgroundColor: '$color3' },
                pressStyle: { backgroundColor: '$color4' },
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * ToastActionFrame - for action/cancel buttons with text
 * -----------------------------------------------------------------------------------------------*/
exports.ToastActionFrame = (0, core_1.styled)(stacks_1.XStack, {
    name: 'ToastAction',
    render: 'button',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    variants: {
        unstyled: {
            false: {
                borderRadius: '$2',
                paddingHorizontal: '$2',
                height: 24,
                backgroundColor: '$color5',
                hoverStyle: { backgroundColor: '$color6' },
                pressStyle: { backgroundColor: '$color7' },
            },
        },
    },
    defaultVariants: {
        unstyled: process.env.HANZOGUI_HEADLESS === '1',
    },
});
/* -------------------------------------------------------------------------------------------------
 * DefaultCloseIcon
 * -----------------------------------------------------------------------------------------------*/
var DefaultCloseIcon = function () { return ((0, jsx_runtime_1.jsx)(text_1.SizableText, { size: "$1", color: "$color11", children: "\u2715" })); };
exports.DefaultCloseIcon = DefaultCloseIcon;
