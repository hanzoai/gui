export default createAnimatedComponent;
/**
 * Experimental implementation of `createAnimatedComponent` that is intended to
 * be compatible with concurrent rendering.
 */
export function createAnimatedComponent(Component: any): React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from 'react';
