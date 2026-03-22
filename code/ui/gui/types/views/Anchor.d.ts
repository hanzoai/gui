import type { SizableTextProps } from '@gui/text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@gui/core").GuiComponent<Omit<import("@gui/core").GetFinalProps<import("@gui/core").TextNonStyleProps, import("@gui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@gui/core").FontSizeTokens | undefined;
}>, keyof AnchorExtraProps> & AnchorExtraProps, import("@gui/core").GuiTextElement, import("@gui/core").TextNonStyleProps & AnchorExtraProps, import("@gui/core").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("@gui/core").FontSizeTokens | undefined;
}, import("@gui/core").StaticConfigPublic>;
//# sourceMappingURL=Anchor.d.ts.map