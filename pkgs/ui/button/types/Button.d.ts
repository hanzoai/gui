import type { TextContextStyles } from '@hanzogui/text';
import type { GetProps, SizeTokens } from '@hanzogui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
type ButtonContextStyles = TextContextStyles & {
    size?: SizeTokens;
    variant?: ButtonVariant;
    elevation?: SizeTokens | number;
};
export declare const ButtonContext: import("@hanzogui/web").StyledContext<{
    size?: SizeTokens;
    variant?: ButtonVariant;
    color?: ButtonContextStyles["color"];
}>;
type IconProp = JSX.Element | FunctionComponent<{
    color?: any;
    size?: any;
}> | null;
declare const ButtonComponent: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "form" | "name" | "value" | keyof TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "form" | "name" | "value" | keyof TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
} & import("react").RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>, "form" | "name" | "value" | keyof TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & {
    icon?: IconProp;
    iconAfter?: IconProp;
    scaleIcon?: number;
    iconSize?: SizeTokens;
    type?: "submit" | "reset" | "button";
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    value?: string | readonly string[] | number;
}, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }>, "form" | "name" | "value" | keyof TextContextStyles | "textProps" | "noTextWrap" | "icon" | "iconAfter" | "scaleIcon" | "iconSize" | "type" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget"> & TextContextStyles & {
        textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: IconProp;
        iconAfter?: IconProp;
        scaleIcon?: number;
        iconSize?: SizeTokens;
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps & TextContextStyles & {
        textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & {
        icon?: IconProp;
        iconAfter?: IconProp;
        scaleIcon?: number;
        iconSize?: SizeTokens;
        type?: "submit" | "reset" | "button";
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        value?: string | readonly string[] | number;
    }, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Apply: import("react").Provider<ButtonContextStyles> & import("react").ProviderExoticComponent<Partial<ButtonContextStyles> & {
        children?: import("react").ReactNode;
        scope?: string;
    }>;
    Frame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Text: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
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