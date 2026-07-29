export { createSheetScope } from './SheetContext';
export * from './types';
export declare const Handle: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const Overlay: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    open?: boolean | undefined;
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
export declare const Frame: import("@hanzogui/web").GuiComponent<import("@hanzogui/web").TamaDefer, import("@hanzogui/web").GuiElement, import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
    fullscreen?: boolean | undefined;
}, import("@hanzogui/web").StaticConfigPublic>;
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
    transitionConfig?: import("@hanzogui/web").AnimatedNumberStrategy;
    preferAdaptParentOpenState?: boolean;
    unmountChildrenWhenHidden?: boolean;
    native?: "ios"[] | boolean;
    transition?: import("@hanzogui/web").TransitionProp;
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
        Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
            unstyled?: boolean | undefined;
            elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
            fullscreen?: boolean | undefined;
        }>, keyof {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }> & {
            disableHideBottomOverflow?: boolean;
            adjustPaddingForOffscreenContent?: boolean;
        }>>;
        Overlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, any, any, any, {
            open?: boolean;
        }, {}> | import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & {
            open?: boolean;
        }, "__scopeSheet"> & {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, any, {
            __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
        }, {}, {}, {}>;
        Handle: import("@hanzogui/web").GuiComponent<any, any, any, any, {
            open?: boolean;
        }, {}> | import("@hanzogui/web").GuiComponent<any, any, any, {}, {}, {}>;
        ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GuiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@hanzogui/web").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }> & {
            fullscreen?: boolean | undefined;
        } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
            readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
                accept: {
                    readonly contentContainerStyle: "style";
                };
            }>> | undefined;
        }, {
            fullscreen?: boolean | undefined;
        }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
    };
    Frame: import("react").ForwardRefExoticComponent<import("./types").SheetScopedProps<Omit<import("@hanzogui/web").GetFinalProps<import("@hanzogui/core").RNViewNonStyleProps, import("@hanzogui/web").StackStyleBase, {
        unstyled?: boolean | undefined;
        elevation?: number | import("@hanzogui/web").SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }>, keyof {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }> & {
        disableHideBottomOverflow?: boolean;
        adjustPaddingForOffscreenContent?: boolean;
    }>>;
    Overlay: import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, any, any, any, {
        open?: boolean;
    }, {}> | import("@hanzogui/web").GuiComponent<Omit<import("@hanzogui/web").StackNonStyleProps & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase> & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase, {}>> & {
        open?: boolean;
    }, "__scopeSheet"> & {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, any, {
        __scopeSheet?: import("@hanzogui/create-context").Scope<any>;
    }, {}, {}, {}>;
    Handle: import("@hanzogui/web").GuiComponent<any, any, any, any, {
        open?: boolean;
    }, {}> | import("@hanzogui/web").GuiComponent<any, any, any, {}, {}, {}>;
    ScrollView: import("react").ForwardRefExoticComponent<Omit<import("@hanzogui/web").GuiComponentPropsBaseBase & import("react-native").ScrollViewProps, keyof import("@hanzogui/web").StackStyleBase | "fullscreen" | "contentContainerStyle"> & import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>> & import("@hanzogui/web").WithPseudoProps<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }> & {
        fullscreen?: boolean | undefined;
    } & import("@hanzogui/web").WithShorthands<import("@hanzogui/web").WithThemeValues<import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }>>> & import("@hanzogui/web").WithMediaProps<import("@hanzogui/web").WithThemeShorthandsAndPseudos<import("@hanzogui/web").StackStyleBase & {
        readonly contentContainerStyle?: Partial<import("@hanzogui/web").InferStyleProps<typeof import("react-native").ScrollView, {
            accept: {
                readonly contentContainerStyle: "style";
            };
        }>> | undefined;
    }, {
        fullscreen?: boolean | undefined;
    }>> & import("react").RefAttributes<import("react-native").ScrollView>>;
};
//# sourceMappingURL=Sheet.d.ts.map