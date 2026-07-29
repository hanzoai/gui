import type { SizableTextProps } from '@hanzogui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}>, keyof AnchorExtraProps> & AnchorExtraProps, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & AnchorExtraProps, import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@hanzogui/web").FontSizeTokens | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
//# sourceMappingURL=Anchor.d.ts.map