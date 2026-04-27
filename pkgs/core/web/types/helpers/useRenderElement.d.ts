import type React from 'react';
import type { HanzoguiComponentState } from '../types';
export type RenderProp<Props = Record<string, any>> = string | React.ReactElement | ((props: Props, state: HanzoguiComponentState) => React.ReactElement);
/**
 * Evaluates a render prop and returns the element to render.
 *
 * @param render - The render prop (tag string, JSX element, or function)
 * @param props - Props to pass to the rendered element (including ref)
 * @param state - Component state for render functions
 * @param defaultElement - Fallback element if render prop is not provided
 */
export declare function evaluateRenderProp(render: RenderProp | undefined, props: Record<string, any>, state: HanzoguiComponentState, defaultElement: React.ReactElement<any>): React.ReactElement;
//# sourceMappingURL=useRenderElement.d.ts.map