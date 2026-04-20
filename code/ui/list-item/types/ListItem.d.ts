import type { ColorTokens, FontSizeTokens, GetProps, SizeTokens } from '@hanzogui/web';
import type { FunctionComponent, JSX, ReactNode } from 'react';
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
type ListItemVariant = 'outlined';
export type ListItemExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    title?: ReactNode;
    subTitle?: ReactNode;
    iconSize?: SizeTokens;
};
export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;
declare const ListItemFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const ListItem: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps & import("react").RefAttributes<import("@hanzogui/web").HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}>, keyof ListItemExtraProps> & ListItemExtraProps, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & ListItemExtraProps, import("@hanzogui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    active?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }>, keyof ListItemExtraProps> & ListItemExtraProps, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & ListItemExtraProps, import("@hanzogui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: SizeTokens;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens;
        variant?: ListItemVariant;
        color?: ColorTokens | string;
    }> & {
        children?: ReactNode;
        scope?: string;
    }>;
    Frame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        active?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Text: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Subtitle: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        size?: SizeTokens | FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Icon: (props: {
        children: React.ReactNode;
        size?: SizeTokens;
        scaleIcon?: number;
    }) => any;
    Title: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=ListItem.d.ts.map