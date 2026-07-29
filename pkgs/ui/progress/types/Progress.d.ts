import type { GetProps } from '@hanzogui/core';
declare const createProgressScope: import("@hanzogui/create-context").CreateScope;
export declare const ProgressIndicatorFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>;
declare const ProgressIndicator: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & void, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const ProgressFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export interface ProgressExtraProps {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
}
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
declare const Progress: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps & import("react").RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & ProgressExtraProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }>, keyof ProgressExtraProps> & ProgressExtraProps, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & ProgressExtraProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/web").SizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Indicator: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & void, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
};
export { createProgressScope, Progress, ProgressIndicator };
//# sourceMappingURL=Progress.d.ts.map