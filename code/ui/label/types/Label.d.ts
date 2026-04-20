import type { FontSizeTokens, GetProps } from '@hanzogui/web';
export declare const LabelFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | FontSizeTokens | undefined;
}>, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps & void, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").SizeTokens | FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map