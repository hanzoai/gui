import type { ColorTokens, GetProps, SizeTokens } from '@hanzogui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
export declare const ButtonContext: import("@hanzogui/web").StyledContext<{
    size?: SizeTokens;
    variant?: ButtonVariant;
    color?: ColorTokens | string;
}>;
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
type ButtonExtraProps = {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: 'submit' | 'reset' | 'button';
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
};
declare const ButtonComponent: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & ButtonExtraProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps & import("react").RefAttributes<import("@hanzogui/web").HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}>, keyof ButtonExtraProps> & ButtonExtraProps, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & ButtonExtraProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }>, keyof ButtonExtraProps> & ButtonExtraProps, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & ButtonExtraProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<{
        size?: SizeTokens;
        variant?: ButtonVariant;
        color?: ColorTokens | string;
        elevation?: SizeTokens | number;
    }> & import("react").ProviderExoticComponent<Partial<{
        size?: SizeTokens;
        variant?: ButtonVariant;
        color?: ColorTokens | string;
        elevation?: SizeTokens | number;
    }> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Text: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Icon: (props: {
        children: React.ReactNode;
        scaleIcon?: number;
        size?: SizeTokens;
    }) => any;
};
export type ButtonProps = GetProps<typeof ButtonComponent>;
export {};
//# sourceMappingURL=Button.d.ts.map