import React from 'react';
import type { LinkProps } from 'solito/link';
import type { AnchorProps } from 'gui';
export type TextLinkProps = Pick<LinkProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: React.ForwardRefExoticComponent<Pick<LinkProps, "href" | "target"> & Omit<import("gui").TextNonStyleProps, keyof import("@gui/web").TextStylePropsBase | "unstyled" | "size"> & import("@gui/web").WithThemeValues<import("@gui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("gui").FontSizeTokens | undefined;
} & import("@gui/web").WithShorthands<import("@gui/web").WithThemeValues<import("@gui/web").TextStylePropsBase>> & import("@gui/web").WithPseudoProps<import("@gui/web").WithThemeValues<import("@gui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("gui").FontSizeTokens | undefined;
} & import("@gui/web").WithShorthands<import("@gui/web").WithThemeValues<import("@gui/web").TextStylePropsBase>>> & import("@gui/web").WithMediaProps<import("@gui/web").WithThemeShorthandsAndPseudos<import("@gui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("gui").FontSizeTokens | undefined;
}>> & import("gui").AnchorExtraProps & React.RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map