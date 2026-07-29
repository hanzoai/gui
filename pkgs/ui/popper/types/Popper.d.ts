import type { SizeTokens, GuiElement } from '@hanzogui/core';
import type { PopupTriggerMap } from '@hanzogui/floating';
import type { Coords, OffsetOptions, Placement, SizeOptions, Strategy, UseFloatingReturn } from '@hanzogui/floating';
import { flip, shift } from '@hanzogui/floating';
import type { SizableStackProps, YStackProps } from '@hanzogui/stacks';
import * as React from 'react';
type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never;
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never;
export type PopperContextShared = {
    open: boolean;
    size?: SizeTokens;
    hasFloating: boolean;
    arrowStyle?: Partial<Coords> & {
        centerOffset: number;
    };
    placement?: Placement;
    arrowRef: any;
    onArrowSize?: (val: number) => void;
    transformOrigin?: {
        x: string;
        y: string;
    };
};
export type PopperContextValue = UseFloatingReturn & PopperContextShared;
export declare const PopperContextFast: import("@hanzogui/web").StyledContext<PopperContextValue>;
export declare const PopperPositionContext: <VariantProps extends Record<string, any>>(defaultValues?: VariantProps, namespace?: string) => import("@hanzogui/web").StyledContext<VariantProps>;
export declare const usePopperContext: (scope?: string) => PopperContextValue, PopperProviderFast: React.Provider<PopperContextValue> & React.ProviderExoticComponent<Partial<PopperContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export type PopperContextSlowValue = Pick<UseFloatingReturn, 'getReferenceProps' | 'update' | 'refs'> & {
    onHoverReference?: (event: any) => void;
    onLeaveReference?: () => void;
    triggerElements?: PopupTriggerMap;
};
export declare const PopperContextSlow: import("@hanzogui/web").StyledContext<PopperContextSlowValue>;
export declare const usePopperContextSlow: (scope?: string) => PopperContextSlowValue, PopperProviderSlow: React.Provider<PopperContextSlowValue> & React.ProviderExoticComponent<Partial<PopperContextSlowValue> & {
    children?: React.ReactNode;
    scope?: string;
}>;
export declare const PopperProvider: ({ scope, children, ...context }: PopperContextValue & {
    scope?: string;
    children?: React.ReactNode;
}) => React.JSX.Element;
export type PopperProps = {
    /**
     * Popper is a component used by other components to create interfaces, so scope is required
     * For example Popover uses it internally and sets a default "POPOVER_SCOPE".
     */
    scope?: string;
    /**
     * Optional, will disable measuring updates when open is false for better performance
     * */
    open?: boolean;
    size?: SizeTokens;
    children?: React.ReactNode;
    /**
     * Determine the preferred placement of the content in relation to the trigger
     */
    placement?: Placement;
    /**
     * Shifts content horizontally to stay within viewport.
     * Pass an object to override shift options (mainAxis, crossAxis, padding, etc).
     * Defaults: { mainAxis: true, crossAxis: false, padding: 10 }
     * @see https://floating-ui.com/docs/shift
     */
    stayInFrame?: ShiftProps | boolean;
    /**
     * Allows content to switch sides when space is limited.
     * @see https://floating-ui.com/docs/flip
     */
    allowFlip?: FlipProps | boolean;
    /**
     * Resizes the content to fix inside the screen when space is limited
     * @see https://floating-ui.com/docs/size
     */
    resize?: boolean | Omit<SizeOptions, 'apply'>;
    /**
     * Choose between absolute or fixed positioning
     */
    strategy?: Strategy;
    /**
     * Move the content away from the trigger
     * @see https://floating-ui.com/docs/offset
     */
    offset?: OffsetOptions;
    disableRTL?: boolean;
    passThrough?: boolean;
};
export type PopperSetupOptions = {
    disableRTL?: boolean;
};
export declare function setupPopper(options?: PopperSetupOptions): void;
export declare function Popper(props: PopperProps): React.JSX.Element;
export type PopperAnchorExtraProps = {
    virtualRef?: React.RefObject<any>;
    scope?: string;
};
export type PopperAnchorProps = YStackProps;
export declare const PopperAnchor: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof PopperAnchorExtraProps> & PopperAnchorExtraProps, GuiElement, import("@hanzogui/core").RNViewNonStyleProps & PopperAnchorExtraProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export type PopperContentProps = SizableStackProps & {
    scope?: string;
    /**
     * Enable smooth animation when the content position changes (e.g., when flipping sides)
     */
    animatePosition?: boolean | 'even-when-repositioning';
    /** @deprecated Use `animatePosition` instead */
    enableAnimationForPositionChange?: boolean | 'even-when-repositioning';
    passThrough?: boolean;
};
export declare const PopperContentFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    size?: SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const PopperContent: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").RNViewNonStyleProps, "size" | "unstyled" | "elevation" | keyof import("@hanzogui/web").StackStyleBase | "fullscreen" | "transparent" | "circular" | "elevate" | "bordered" | "chromeless"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {
    size?: import("@hanzogui/web").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}>> & {
    scope?: string;
    /**
     * Enable smooth animation when the content position changes (e.g., when flipping sides)
     */
    animatePosition?: boolean | "even-when-repositioning";
    /** @deprecated Use `animatePosition` instead */
    enableAnimationForPositionChange?: boolean | "even-when-repositioning";
    passThrough?: boolean;
} & React.RefAttributes<GuiElement>>;
export type PopperArrowExtraProps = {
    offset?: number;
    size?: SizeTokens;
    scope?: string;
    /**
     * Enable smooth animation when the arrow position changes
     */
    animatePosition?: boolean;
};
export type PopperArrowProps = YStackProps & PopperArrowExtraProps;
export declare const PopperArrowFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const PopperArrow: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}>, keyof import("@hanzogui/stacks").StackVariants> & import("@hanzogui/stacks").StackVariants & PopperArrowExtraProps & React.RefAttributes<GuiElement>>;
export {};
//# sourceMappingURL=Popper.d.ts.map