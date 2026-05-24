import { type ViewProps } from '@hanzogui/web';
import type { PortalProps } from './PortalProps';
export declare const getStackedZIndexProps: (propsIn: PortalProps) => {
    stackZIndex: import("@hanzogui/z-index-stack/types").StackZIndexProp;
    zIndex: any;
};
export declare const resolveViewZIndex: (zIndex: ViewProps["zIndex"]) => any;
