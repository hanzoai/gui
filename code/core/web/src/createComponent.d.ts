import type { StaticConfig, HanzoguiComponent, HanzoguiComponentState, HanzoguiElement } from './types';
export declare const componentSetStates: Set<React.Dispatch<React.SetStateAction<HanzoguiComponentState>>>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends HanzoguiElement = HanzoguiElement, BaseProps = never, BaseStyles extends object = never>(staticConfig: StaticConfig): HanzoguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
