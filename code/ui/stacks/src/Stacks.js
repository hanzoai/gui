"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZStack = exports.XStack = exports.YStack = exports.fullscreenStyle = void 0;
var core_1 = require("@hanzogui/core");
var getElevation_1 = require("./getElevation");
exports.fullscreenStyle = {
    position: 'absolute',
    inset: 0,
};
var variants = {
    fullscreen: {
        true: exports.fullscreenStyle,
    },
    elevation: {
        '...size': getElevation_1.getElevation,
        ':number': getElevation_1.getElevation,
    },
};
/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
exports.YStack = (0, core_1.styled)(core_1.View, {
    flexDirection: 'column',
    variants: variants,
});
exports.YStack['displayName'] = 'YStack';
/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
exports.XStack = (0, core_1.styled)(core_1.View, {
    flexDirection: 'row',
    variants: variants,
});
exports.XStack['displayName'] = 'XStack';
/**
 * @summary A view that stacks its children on top of each other.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
exports.ZStack = (0, core_1.styled)(exports.YStack, {
    position: 'relative',
}, {
    neverFlatten: true,
    isZStack: true,
});
exports.ZStack['displayName'] = 'ZStack';
