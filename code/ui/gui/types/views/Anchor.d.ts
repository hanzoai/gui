import type { SizableTextProps } from '@hanzo/gui-text';
export interface AnchorExtraProps {
    href?: string;
    target?: string;
    rel?: string;
}
export type AnchorProps = SizableTextProps & AnchorExtraProps;
export declare const Anchor: import("@hanzo/gui-core").GuiComponent<Omit<any, keyof AnchorExtraProps> & AnchorExtraProps, any, any, any, any, any>;
//# sourceMappingURL=Anchor.d.ts.map