import React from 'react';
import type { StaticConfig, HanzoguiComponent, HanzoguiComponentState, HanzoguiElement } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<HanzoguiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends HanzoguiElement = HanzoguiElement, BaseProps = never, BaseStyles extends object = never>(staticConfig: StaticConfig): HanzoguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export {};
//# sourceMappingURL=createComponent.d.ts.map