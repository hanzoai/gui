import type { GetProps, HanzoguiElement, ViewStyle } from '@hanzogui/web';
import * as React from 'react';
export declare const ToggleFrame: import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").TamaDefer, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    unstyled?: boolean | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    defaultActiveStyle?: boolean | undefined;
}, {
    accept: {
        readonly activeStyle: "style";
    };
}>;
type ToggleFrameProps = GetProps<typeof ToggleFrame>;
type ToggleItemExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    defaultValue?: string;
    disabled?: boolean;
    active?: boolean;
    defaultActive?: boolean;
    onActiveChange?(active: boolean): void;
    activeStyle?: ViewStyle | null;
    activeTheme?: string | null;
};
export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps;
export declare const Toggle: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").StackNonStyleProps, "unstyled" | keyof import("@hanzogui/web").StackStyleBase | "size" | "activeStyle" | "defaultActiveStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    unstyled?: boolean | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}> & {
    unstyled?: boolean | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    defaultActiveStyle?: boolean | undefined;
} & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
    readonly activeStyle?: Partial<import("@hanzogui/web").InferStyleProps<import("@hanzogui/web").HanzoguiComponent<import("@hanzogui/web").ViewProps, HanzoguiElement, import("@hanzogui/web").StackNonStyleProps, import("@hanzogui/web").StackStyleBase, {}, {}>, {
        accept: {
            readonly activeStyle: "style";
        };
    }>> | undefined;
}, {
    unstyled?: boolean | undefined;
    size?: number | import("@hanzogui/web").SizeTokens | undefined;
    defaultActiveStyle?: boolean | undefined;
}>> & ToggleItemExtraProps & React.RefAttributes<HanzoguiElement>>;
export {};
//# sourceMappingURL=Toggle.d.ts.map