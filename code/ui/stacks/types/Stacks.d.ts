import type { GetProps, SizeTokens } from '@hanzogui/core';
export interface StackVariants {
    /**
     * @deprecated use `inset: 0, position: 'absolute'` instead
     */
    fullscreen?: boolean;
    elevation?: number | SizeTokens;
}
export type YStackProps = Omit<GetProps<typeof YStack>, keyof StackVariants> & StackVariants;
export type XStackProps = YStackProps;
export type ZStackProps = YStackProps;
export declare const fullscreenStyle: {
    readonly position: "absolute";
    readonly inset: 0;
};
/**
 * @summary A view that arranges its children in a vertical line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const YStack: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
/**
 * @summary A view that arranges its children in a horizontal line.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const XStack: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
/**
 * @summary A view that stacks its children on top of each other.
 * @see — Docs https://hanzogui.dev/ui/stacks#xstack-ystack-zstack
 */
export declare const ZStack: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic & {
    neverFlatten: true;
    isZStack: true;
}>;
//# sourceMappingURL=Stacks.d.ts.map