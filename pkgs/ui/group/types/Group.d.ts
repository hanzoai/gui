import type { GetProps } from '@hanzogui/core';
import type { Scope } from '@hanzogui/create-context';
import React from 'react';
type ScopedProps<P> = P & {
    __scopeGroup?: Scope;
};
declare const createGroupScope: import("@hanzogui/create-context").CreateScope;
export declare const GroupFrame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/core").StaticConfigPublic>;
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
export declare const Group: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/core").HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const YGroup: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/core").HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export declare const XGroup: React.ForwardRefExoticComponent<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
} & React.RefAttributes<import("@hanzogui/core").HanzoguiElement>> & import("@hanzogui/core").StaticComponentObject<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
    __scopeGroup?: Scope;
}, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    size?: any;
}, import("@hanzogui/core").StaticConfigPublic> & Omit<import("@hanzogui/core").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNHanzoguiViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }>, keyof GroupExtraProps | "__scopeGroup"> & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNHanzoguiViewNonStyleProps & GroupExtraProps & {
        __scopeGroup?: Scope;
    }, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        size?: any;
    }, import("@hanzogui/core").StaticConfigPublic];
} & {
    Item: typeof GroupItem;
};
export { createGroupScope };
//# sourceMappingURL=Group.d.ts.map