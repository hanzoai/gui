import type { ComponentContextI, StaticConfig, HanzoguiComponentState, HanzoguiComponentStateRef, HanzoguiInternalConfig, TextProps } from '../types';
import type { ViewProps } from '../views/View';
export declare const useComponentState: (props: ViewProps | TextProps | Record<string, any>, animationDriver: ComponentContextI["animationDriver"], staticConfig: StaticConfig, config: HanzoguiInternalConfig) => {
    startedUnhydrated: boolean;
    curStateRef: HanzoguiComponentStateRef;
    disabled: any;
    groupName: string | undefined;
    hasAnimationProp: boolean;
    hasEnterStyle: boolean;
    isAnimated: boolean;
    isExiting: boolean;
    isHydrated: boolean;
    presence: import("../types").UsePresenceResult | null;
    presenceState: import("../types").PresenceContextProps | null | undefined;
    setState: import("react").Dispatch<import("react").SetStateAction<HanzoguiComponentState>>;
    setStateShallow: import("react").Dispatch<import("react").SetStateAction<Partial<HanzoguiComponentState>>>;
    noClass: boolean;
    state: HanzoguiComponentState;
    stateRef: import("react").RefObject<HanzoguiComponentStateRef>;
    inputStyle: "css" | "value";
    outputStyle: "css" | "inline";
    willBeAnimated: boolean;
    willBeAnimatedClient: boolean;
};
//# sourceMappingURL=useComponentState.d.ts.map