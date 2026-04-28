export { createSheetScope } from './SheetContext';
export * from './types';
export declare const Handle: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const Overlay: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const Frame: import("@hanzogui/core").HanzoguiComponent<import("@hanzogui/core").TamaDefer, import("@hanzogui/core").HanzoguiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/core").StaticConfigPublic>;
export declare const Sheet: import("react").ForwardRefExoticComponent<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: import("react").Dispatch<import("react").SetStateAction<boolean>> | ((open: boolean) => void);
    position?: number;
    defaultPosition?: number;
    snapPoints?: (string | number)[];
    snapPointsMode?: import("./types").SnapPointsMode;
    onPositionChange?: import("./types").PositionChangeHandler;
    children?: import("react").ReactNode;
    dismissOnOverlayPress?: boolean;
    dismissOnSnapToBottom?: boolean;
    disableRemoveScroll?: boolean;
    forceRemoveScrollEnabled?: boolean;
    transitionConfig?: import("@hanzogui/core").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("@hanzogui/core").TransitionProp;
    handleDisableScroll?: boolean;
    disableDrag?: boolean;
    modal?: boolean;
    zIndex?: number;
    portalProps?: import("@hanzogui/portal").PortalProps;
    moveOnKeyboardChange?: boolean;
    containerComponent?: React.ComponentType<any>;
    onAnimationComplete?: (info: {
        open: boolean;
    }) => void;
} & {
    __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
} & import("react").RefAttributes<import("react-native").View>> & {
    Controlled: import("react").FunctionComponent<Omit<import("./types").SheetProps, "open" | "onOpenChange"> & import("react").RefAttributes<import("react-native").View>> & {
        Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, any, any, any, {
            open?: boolean;
        }, {}> | import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, any, {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, {}, {}, {}>;
        Handle: import("@hanzogui/core").HanzoguiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("@hanzogui/core").HanzoguiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/core").HanzoguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@hanzogui/core").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/core").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/core").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }>>;
    Overlay: import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, any, any, any, {
        open?: boolean;
    }, {}> | import("@hanzogui/core").HanzoguiComponent<Omit<import("@hanzogui/core").StackNonStyleProps & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase> & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, any, {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, {}, {}, {}>;
    Handle: import("@hanzogui/core").HanzoguiComponent<any, any, any, any, {
        open?: boolean;
    }, {}> | import("@hanzogui/core").HanzoguiComponent<any, any, any, {}, {}, {}>;
    ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/core").HanzoguiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@hanzogui/core").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/core").WithPseudoProps<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/core").WithShorthands<import("@hanzogui/core").WithThemeValues<import("@hanzogui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/core").WithMediaProps<import("@hanzogui/core").WithThemeShorthandsAndPseudos<import("@hanzogui/core").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/core").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
};
//# sourceMappingURL=Sheet.d.ts.map