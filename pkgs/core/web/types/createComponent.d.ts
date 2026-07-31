import React from 'react';
import type { StaticConfig, GuiComponent, GuiComponentState, GuiElement } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<GuiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends GuiElement = GuiElement, BaseProps = never, BaseStyles extends object = never>(staticConfig: StaticConfig): GuiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export {};
//# sourceMappingURL=createComponent.d.ts.map