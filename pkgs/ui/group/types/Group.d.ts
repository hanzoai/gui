import type { GetProps } from '@hanzogui/core';
import type { Scope } from '@hanzogui/create-context';
import React from 'react';
type ScopedProps<P> = P & {
    __scopeGroup?: Scope;
};
declare const createGroupScope: import("@hanzogui/create-context").CreateScope;
export declare const GroupFrame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/web").StaticConfigPublic>;
export type GroupExtraProps = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
};
export type GroupProps = GetProps<typeof GroupFrame> & GroupExtraProps;
export type GroupItemProps = {
    children: React.ReactNode;
    /**
     * forces the item to be a starting, center or ending item and gets the respective styles
     */
    forcePlacement?: 'first' | 'center' | 'last';
};
declare function GroupItem(props: ScopedProps<GroupItemProps & Record<string, any>>): any;
export declare const useGroupItem: (childrenProps: {
    disabled?: boolean;
}, forcePlacement?: GroupItemProps["forcePlacement"], __scopeGroup?: Scope) => {
    borderBottomLeftRadius?: number | undefined;
    borderBottomRightRadius?: number | undefined;
    borderTopLeftRadius?: number | undefined;
    borderTopRightRadius?: number | undefined;
    disabled: boolean | undefined;
};
export declare const Group: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const YGroup: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const XGroup: React.ForwardRefExoticComponent<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/web").GuiElement>> & import("@hanzogui/web").StaticComponentObject<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/web").StaticConfigPublic> & Omit<import("@hanzogui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/web").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export { createGroupScope };
//# sourceMappingURL=Group.d.ts.map