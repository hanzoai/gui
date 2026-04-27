import type { TextContextStyles, TextParentStyles } from '@hanzogui/text';
import type { FontSizeTokens, GetProps, SizeTokens, ThemeableProps } from '@hanzogui/web';
import type { FunctionComponent, JSX } from 'react';
type ButtonVariant = 'outlined';
export declare const ButtonContext: import("@hanzogui/web").StyledContext<Partial<TextContextStyles & {
    size: SizeTokens;
    variant?: ButtonVariant;
}>>;
type ButtonIconProps = {
    color?: any;
    size?: any;
};
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | ((props: ButtonIconProps) => any) | null;
type ButtonExtraProps = TextParentStyles & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
};
type ButtonProps = ButtonExtraProps & GetProps<typeof ButtonFrame>;
declare const ButtonFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    transparent?: boolean | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    fullscreen?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const ButtonText: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
    size?: FontSizeTokens | undefined;
    unstyled?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
declare const ButtonIcon: (props: {
    children: React.ReactNode;
    scaleIcon?: number;
}) => any;
/**
 * @summary A Button is a clickable element that can be used to trigger actions such as submitting forms, navigating to other pages, or performing other actions.
 * @see — Docs https://hanzogui.dev/ui/button
 */
declare const Button: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    transparent?: boolean | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    fullscreen?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>, "unstyled" | "icon" | "iconAfter" | "scaleIcon" | keyof TextContextStyles | "textProps" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
} & import("react").RefAttributes<import("@hanzogui/web").HanzoguiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    transparent?: boolean | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    fullscreen?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}>, "unstyled" | "icon" | "iconAfter" | "scaleIcon" | keyof TextContextStyles | "textProps" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
}, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & TextContextStyles & {
    textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
    noTextWrap?: boolean;
} & ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     *
     * @default 1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
    /**
     * remove default styles
     */
    unstyled?: boolean;
}, import("@hanzogui/web").StackStyleBase, {
    size?: number | SizeTokens | undefined;
    variant?: "outlined" | undefined;
    elevation?: number | SizeTokens | undefined;
    circular?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
    transparent?: boolean | undefined;
    disabled?: boolean | undefined;
    unstyled?: boolean | undefined;
    fullscreen?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        transparent?: boolean | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        fullscreen?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }>, "unstyled" | "icon" | "iconAfter" | "scaleIcon" | keyof TextContextStyles | "textProps" | "noTextWrap" | keyof ThemeableProps | "spaceFlex" | "scaleSpace"> & TextContextStyles & {
        textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp;
        /**
         * adjust icon relative to size
         *
         * @default 1
         */
        scaleIcon?: number;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number;
        /**
         * remove default styles
         */
        unstyled?: boolean;
    }, import("@hanzogui/web").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & TextContextStyles & {
        textProps?: Partial<import("@hanzogui/text").SizableTextProps>;
        noTextWrap?: boolean;
    } & ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp;
        /**
         * adjust icon relative to size
         *
         * @default 1
         */
        scaleIcon?: number;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number;
        /**
         * remove default styles
         */
        unstyled?: boolean;
    }, import("@hanzogui/web").StackStyleBase, {
        size?: number | SizeTokens | undefined;
        variant?: "outlined" | undefined;
        elevation?: number | SizeTokens | undefined;
        circular?: boolean | undefined;
        chromeless?: boolean | "all" | undefined;
        transparent?: boolean | undefined;
        disabled?: boolean | undefined;
        unstyled?: boolean | undefined;
        fullscreen?: boolean | undefined;
        elevate?: boolean | undefined;
        bordered?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Text: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        size?: FontSizeTokens | undefined;
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Icon: (props: {
        children: React.ReactNode;
        scaleIcon?: number;
    }) => any;
};
/**
 * @deprecated Instead of useButton, see the Button docs for the newer and much improved Advanced customization pattern: https://hanzogui.dev/docs/components/button
 */
declare function useButton<Props extends ButtonProps>({ textProps, ...propsIn }: Props, { Text }?: {
    Text: any;
}): {
    spaceSize: number | import("@hanzogui/web").UnionableString | "unset" | import("@hanzogui/web").Variable<any>;
    isNested: boolean;
    props: Props;
};
export { Button, ButtonFrame, ButtonIcon, ButtonText, useButton, };
export type { ButtonProps };
//# sourceMappingURL=Button.d.ts.map