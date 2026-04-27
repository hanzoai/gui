import type * as BaseMenuTypes from '@hanzogui/create-menu';
import { type MenuArrowProps as BaseMenuArrowProps, type MenuCheckboxItemProps as BaseMenuCheckboxItemProps, type MenuContentProps as BaseMenuContentProps, type MenuGroupProps as BaseMenuGroupProps, type MenuItemIndicatorProps as BaseMenuItemIndicatorProps, type MenuItemProps as BaseMenuItemProps, type MenuLabelProps as BaseMenuLabelProps, type MenuPortalProps as BaseMenuPortalProps, type MenuRadioGroupProps as BaseMenuRadioGroupProps, type MenuRadioItemProps as BaseMenuRadioItemProps, type MenuSubContentProps as BaseMenuSubContentProps, type MenuSubTriggerProps as BaseMenuSubTriggerProps, type CreateBaseMenuProps } from '@hanzogui/create-menu';
import { type ScrollViewProps } from '@hanzogui/scroll-view';
import { type HanzoguiElement, type ViewProps } from '@hanzogui/web';
import * as React from 'react';
type Direction = 'ltr' | 'rtl';
export declare const DROPDOWN_MENU_CONTEXT = "MenuContext";
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuProps extends BaseMenuTypes.MenuProps {
    children?: React.ReactNode;
    dir?: Direction;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}
interface MenuTriggerProps extends ViewProps {
    onKeydown?(event: React.KeyboardEvent): void;
}
type MenuPortalProps = BaseMenuPortalProps;
interface MenuContentProps extends Omit<BaseMenuContentProps, 'onEntryFocus'> {
}
type MenuGroupProps = BaseMenuGroupProps;
type MenuLabelProps = BaseMenuLabelProps;
type MenuItemProps = BaseMenuItemProps;
type MenuCheckboxItemProps = BaseMenuCheckboxItemProps;
type MenuRadioGroupProps = BaseMenuRadioGroupProps;
type MenuRadioItemProps = BaseMenuRadioItemProps;
type MenuItemIndicatorProps = BaseMenuItemIndicatorProps;
type MenuArrowProps = BaseMenuArrowProps;
type MenuSubProps = BaseMenuTypes.MenuSubProps & {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
};
type MenuSubTriggerProps = BaseMenuSubTriggerProps;
type MenuSubContentProps = BaseMenuSubContentProps;
type MenuScrollViewProps = ScrollViewProps;
export declare function createNonNativeMenu(params: CreateBaseMenuProps): {
    (props: ScopedProps<MenuProps>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
} & {
    Root: {
        (props: ScopedProps<MenuProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Trigger: import("@hanzogui/web").HanzoguiComponent<Omit<ViewProps, "scope" | keyof MenuTriggerProps> & MenuTriggerProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & MenuTriggerProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {}, {}>;
    Portal: {
        (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    Content: React.ForwardRefExoticComponent<MenuContentProps & {
        scope?: string;
    } & React.RefAttributes<HanzoguiElement>>;
    Group: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuGroupProps> & BaseMenuTypes.MenuGroupProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuGroupProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Label: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuLabelProps> & BaseMenuTypes.MenuLabelProps, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps & BaseMenuTypes.MenuLabelProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Item: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemProps> & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuItemProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    CheckboxItem: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuCheckboxItemProps> & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuCheckboxItemProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    RadioGroup: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioGroupProps> & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuRadioGroupProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    RadioItem: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuRadioItemProps> & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuRadioItemProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    ItemIndicator: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, "scope" | keyof BaseMenuTypes.MenuItemIndicatorProps> & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuItemIndicatorProps & {
        scope?: string;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Separator: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, keyof BaseMenuTypes.MenuSeparatorProps> & BaseMenuTypes.MenuSeparatorProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & BaseMenuTypes.MenuSeparatorProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    Arrow: React.ForwardRefExoticComponent<BaseMenuTypes.MenuArrowProps & React.RefAttributes<HanzoguiElement>>;
    Sub: {
        (props: ScopedProps<MenuSubProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    };
    SubTrigger: React.ForwardRefExoticComponent<BaseMenuTypes.MenuSubTriggerProps & {
        scope?: string;
    } & React.RefAttributes<HanzoguiElement>>;
    SubContent: React.ForwardRefExoticComponent<BaseMenuTypes.MenuSubContentProps & {
        scope?: string;
    } & React.RefAttributes<HanzoguiElement>>;
    ItemTitle: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemTitleProps> & BaseMenuTypes.MenuItemTitleProps, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps & BaseMenuTypes.MenuItemTitleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    ItemSubtitle: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }>, keyof BaseMenuTypes.MenuItemSubTitleProps> & BaseMenuTypes.MenuItemSubTitleProps, import("@hanzogui/web").HanzoguiTextElement, import("@hanzogui/web").TextNonStyleProps & BaseMenuTypes.MenuItemSubTitleProps, import("@hanzogui/web").TextStylePropsBase, {
        unstyled?: boolean | undefined;
        size?: import("@hanzogui/web").FontSizeTokens | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    ItemImage: React.ForwardRefExoticComponent<import("react-native").ImageProps & React.RefAttributes<import("react-native").Image>>;
    ItemIcon: import("@hanzogui/web").HanzoguiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }>, `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | `$theme-${string}` | `$theme-${number}` | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").StackNonStyleProps | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>>> & import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>>, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>>, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
    }, import("@hanzogui/web").StaticConfigPublic>;
    ScrollView: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, import("react-native").ScrollView, import("@hanzogui/web").HanzoguiComponentPropsBaseBase & import("react-native").ScrollViewProps, import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }, {
        accept: {
            readonly contentContainerStyle: "style";
        };
    } & import("@hanzogui/web").StaticConfigPublic>;
};
export type { MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIndicatorProps, MenuItemProps, MenuLabelProps, MenuPortalProps, MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuScrollViewProps, MenuSubContentProps, MenuSubProps, MenuSubTriggerProps, MenuTriggerProps, };
//# sourceMappingURL=createNonNativeMenu.d.ts.map