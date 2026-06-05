import React from 'react';
import type { StaticConfig } from '../types';
export declare const isGuiElement: (child: any, name?: string) => child is React.ReactElement<any> & {
    type: {
        staticConfig: StaticConfig;
    };
};
//# sourceMappingURL=isGuiElement.d.ts.map