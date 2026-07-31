import type { ComponentContextI, StaticConfig, GuiComponentState, GuiComponentStateRef, GuiInternalConfig, TextProps } from '../types';
import type { ViewProps } from '../views/View';
export declare const useComponentState: (props: ViewProps | TextProps | Record<string, any>, animationDriver: ComponentContextI["animationDriver"], staticConfig: StaticConfig, config: GuiInternalConfig) => {
    startedUnhydrated: boolean;
    curStateRef: GuiComponentStateRef;
    disabled: any;
    groupName: string | undefined;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("../types").UsePresenceResult | null;
    presenceState: import("../types").PresenceContextProps | null | undefined;
    setState: import("react").Dispatch<import("react").SetStateAction<GuiComponentState>>;
    setStateShallow: import("../types").ComponentSetStateShallow;
    noClass: boolean;
    state: GuiComponentState;
    stateRef: import("react").RefObject<GuiComponentStateRef>;
    inputStyle: "css" | "value";
    outputStyle: "css" | "inline";
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
    platformPseudo: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map