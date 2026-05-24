import type { SizeTokens } from '@hanzogui/web';
import React from 'react';
import type { TextParentStyles } from './types';
type Props = TextParentStyles & {
    children?: React.ReactNode;
    size?: SizeTokens;
};
export declare function wrapChildrenInText(TextComponent: any, propsIn: Props & {
    unstyled?: boolean;
}, extraProps?: Record<string, any>): any;
export {};
