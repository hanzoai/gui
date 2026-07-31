import React from 'react';
import type { LinkProps } from 'solito/link';
import type { AnchorProps } from 'hanzogui';
export type TextLinkProps = Pick<LinkProps, 'href' | 'target'> & AnchorProps;
export declare const TextLink: React.ForwardRefExoticComponent<Pick<LinkProps, "href" | "target"> & Omit<import("hanzogui").TextNonStyleProps, keyof import("@hanzogui/web").TextStylePropsBase | "unstyled" | "size"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("hanzogui").FontSizeTokens | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase> & {
    unstyled?: boolean | undefined;
    size?: import("hanzogui").FontSizeTokens | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").TextStylePropsBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").TextStylePropsBase, {
    unstyled?: boolean | undefined;
    size?: import("hanzogui").FontSizeTokens | undefined;
}>> & import("hanzogui").AnchorExtraProps & React.RefAttributes<HTMLAnchorElement>>;
//# sourceMappingURL=TestSolito.d.ts.map