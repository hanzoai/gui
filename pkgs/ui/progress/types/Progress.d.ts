import type { GetProps } from '@hanzogui/core';
declare const createProgressScope: import("@hanzogui/create-context").CreateScope;
export declare const ProgressIndicatorFrame: import("@hanzogui/core").GuiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export type ProgressIndicatorProps = GetProps<typeof ProgressIndicatorFrame>;
declare const ProgressIndicator: import("@hanzogui/core").GuiComponent<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const ProgressFrame: import("@hanzogui/core").GuiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/core").SizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export interface ProgressExtraProps {
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
}
export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps;
declare const Progress: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/core").SizeTokens | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps & import("react").RefAttributes<import("@hanzogui/core").GuiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/core").SizeTokens | undefined;
}>, keyof ProgressExtraProps> & ProgressExtraProps, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & ProgressExtraProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: import("@hanzogui/core").SizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }>, keyof ProgressExtraProps> & ProgressExtraProps, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & ProgressExtraProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: import("@hanzogui/core").SizeTokens | undefined;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Indicator: import("@hanzogui/core").GuiComponent<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, import("@hanzogui/core").GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & void, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@hanzogui/core").StaticConfigPublic>;
};
export { createProgressScope, Progress, ProgressIndicator };
//# sourceMappingURL=Progress.d.ts.map