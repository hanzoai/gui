import { Dismissable as DismissableLayer } from '@hanzogui/dismissable';
import { FocusScope } from '@hanzogui/focus-scope';
import type { PopperContentProps } from '@hanzogui/popper';
import * as PopperPrimitive from '@hanzogui/popper';
import type { RovingFocusGroupProps } from '@hanzogui/roving-focus';
import type { TextProps } from '@hanzogui/web';
import { type ViewProps, View } from '@hanzogui/web';
import type { GuiElement } from '@hanzogui/web/types';
import * as React from 'react';
import type { Image, ImageProps } from 'react-native';
import { MenuPredefined } from './MenuPredefined';
type Direction = 'ltr' | 'rtl';
type ScopedProps<P> = P & {
    scope?: string;
};
interface MenuBaseProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    dir?: Direction;
    modal?: boolean;
    native?: boolean;
}
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>;
interface MenuAnchorProps extends PopperAnchorProps {
}
interface MenuPortalProps {
    children?: React.ReactNode;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    zIndex?: number;
}
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuRootContentTypeProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps> {
}
type MenuContentImplElement = React.ElementRef<typeof PopperPrimitive.PopperContent>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type MenuContentImplPrivateProps = {
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
    onDismiss?: DismissableLayerProps['onDismiss'];
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents'];
    /**
     * Whether scrolling outside the `MenuContent` should be prevented
     * (default: `false`)
     */
    disableOutsideScroll?: boolean;
    /**
     * Whether focus should be trapped within the `MenuContent`
     * (default: false)
     */
    trapFocus?: FocusScopeProps['trapped'];
    /**
     * Whether to disable dismissing the menu when the user scrolls outside of it
     * (default: false, meaning scroll will dismiss on web)
     */
    disableDismissOnScroll?: boolean;
};
interface MenuContentImplProps extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
    /**
     * Whether keyboard navigation should loop around
     * @defaultValue false
     */
    loop?: RovingFocusGroupProps['loop'];
    onEntryFocus?: RovingFocusGroupProps['onEntryFocus'];
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside'];
    onFocusOutside?: DismissableLayerProps['onFocusOutside'];
    onInteractOutside?: DismissableLayerProps['onInteractOutside'];
}
interface MenuGroupProps extends ViewProps {
}
interface MenuLabelProps extends ViewProps {
}
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void;
    unstyled?: boolean;
    /**
     * Prevents the menu from closing when this item is selected.
     * Useful for toggle items or multi-select scenarios.
     */
    preventCloseOnSelect?: boolean;
}
interface MenuItemImplProps extends ViewProps {
    disabled?: boolean;
    textValue?: string;
    unstyled?: boolean;
}
interface MenuItemTitleProps extends TextProps {
}
interface MenuItemSubTitleProps extends TextProps {
}
type MenuItemIconProps = ViewProps;
type CheckedState = boolean | 'indeterminate';
interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState;
    onCheckedChange?: (checked: boolean) => void;
}
interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
}
interface MenuRadioItemProps extends MenuItemProps {
    value: string;
}
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof View>;
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
interface MenuSeparatorProps extends ViewProps {
}
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>;
interface MenuArrowProps extends PopperArrowProps {
    unstyled?: boolean;
}
export interface MenuSubProps extends PopperPrimitive.PopperProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
}
interface MenuSubTriggerProps extends MenuItemImplProps {
}
export type MenuSubContentElement = MenuContentImplElement;
export interface MenuSubContentProps extends Omit<MenuContentImplProps, keyof MenuContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
}
export type CreateBaseMenuProps = {
    Item?: typeof MenuPredefined.MenuItem;
    MenuGroup?: typeof MenuPredefined.MenuGroup;
    Title?: typeof MenuPredefined.Title;
    SubTitle?: typeof MenuPredefined.SubTitle;
    Image?: React.ElementType;
    Icon?: typeof MenuPredefined.MenuIcon;
    Indicator?: typeof MenuPredefined.MenuIndicator;
    Separator?: typeof MenuPredefined.MenuSeparator;
    Label?: typeof MenuPredefined.MenuLabel;
};
export declare function createBaseMenu({ Item: _Item, Title: _Title, SubTitle: _SubTitle, Image: _Image, Icon: _Icon, Indicator: _Indicator, Separator: _Separator, MenuGroup: _MenuGroup, Label: _Label, }: CreateBaseMenuProps): {
    Menu: {
        (props: ScopedProps<MenuBaseProps>): import("react/jsx-runtime").JSX.Element;
        displayName: string;
    } & {
        Anchor: {
            (props: MenuAnchorProps): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Portal: {
            (props: ScopedProps<MenuPortalProps>): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
        Content: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            size?: import("@hanzogui/web").SizeTokens | undefined;
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof MenuContentProps> & MenuContentProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & MenuContentProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            size?: import("@hanzogui/web").SizeTokens | undefined;
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        Group: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, keyof MenuGroupProps> & MenuGroupProps, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuGroupProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        Label: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }>, keyof MenuLabelProps> & MenuLabelProps, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & MenuLabelProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        Item: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuItemProps> & MenuItemProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuItemProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        CheckboxItem: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuCheckboxItemProps> & MenuCheckboxItemProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuCheckboxItemProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        RadioGroup: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuRadioGroupProps> & MenuRadioGroupProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuRadioGroupProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        RadioItem: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuRadioItemProps> & MenuRadioItemProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuRadioItemProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        ItemIndicator: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, "scope" | keyof MenuItemIndicatorProps> & MenuItemIndicatorProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuItemIndicatorProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        Separator: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, keyof MenuSeparatorProps> & MenuSeparatorProps, GuiElement, import("@hanzogui/web").StackNonStyleProps & MenuSeparatorProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        Arrow: React.ForwardRefExoticComponent<MenuArrowProps & React.RefAttributes<GuiElement>>;
        Sub: React.FC<ScopedProps<MenuSubProps>>;
        SubTrigger: React.ForwardRefExoticComponent<MenuSubTriggerProps & {
            scope?: string;
        } & React.RefAttributes<GuiElement>>;
        SubContent: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNGuiViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            size?: import("@hanzogui/web").SizeTokens | undefined;
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof MenuSubContentProps> & MenuSubContentProps & {
            scope?: string;
        }, GuiElement, import("@hanzogui/core").RNGuiViewNonStyleProps & MenuSubContentProps & {
            scope?: string;
        }, import("@hanzogui/web").StackStyleBase, {
            size?: import("@hanzogui/web").SizeTokens | undefined;
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        ItemTitle: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }>, keyof MenuItemTitleProps> & MenuItemTitleProps, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & MenuItemTitleProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        ItemSubtitle: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").TextNonStyleProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }>, keyof MenuItemSubTitleProps> & MenuItemSubTitleProps, import("@hanzogui/web").GuiTextElement, import("@hanzogui/web").TextNonStyleProps & MenuItemSubTitleProps, import("@hanzogui/web").TextStylePropsBase, {
            unstyled?: boolean | undefined;
            size?: import("@hanzogui/web").FontSizeTokens | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
        ItemImage: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<Image>>;
        ItemIcon: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }>, `$${string}` | `$${number}` | import("@hanzogui/web").GroupMediaKeys | keyof import("@hanzogui/web").StackStyleBase | keyof import("@hanzogui/web").StackNonStyleProps | keyof import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>>> & import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>>, GuiElement, import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>>, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
        }, import("@hanzogui/web").StaticConfigPublic>;
    };
};
export type { MenuAnchorProps, MenuArrowProps, MenuCheckboxItemProps, MenuContentProps, MenuGroupProps, MenuItemIconProps, MenuItemIndicatorProps, MenuItemProps, MenuItemSubTitleProps, MenuItemTitleProps, MenuLabelProps, MenuPortalProps, MenuBaseProps as MenuProps, MenuRadioGroupProps, MenuRadioItemProps, MenuSeparatorProps, MenuSubTriggerProps, };
//# sourceMappingURL=createBaseMenu.d.ts.map