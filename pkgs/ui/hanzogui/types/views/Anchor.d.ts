import type { SizableTextProps } from '@hanzogui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").TextNonStyleProps, import("@hanzogui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
}>, keyof AnchorExtraProps> & AnchorExtraProps, import("@hanzogui/core").HanzoguiTextElement, import("@hanzogui/core").TextNonStyleProps & AnchorExtraProps, import("@hanzogui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/core").FontSizeTokens | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
//# sourceMappingURL=Anchor.d.ts.map