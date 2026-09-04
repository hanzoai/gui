import { jsx as _jsx } from "react/jsx-runtime";
import React, { useId, useRef } from 'react';
import { useEvent } from '@hanzogui/core';
import { SheetControllerContext } from './useSheetController.js';
export const SheetController = ({ children, onOpenChange: onOpenChangeProp, onAnimationComplete: onAnimationCompleteProp, open, hidden, disableDrag, }) => {
    const onOpenChange = useEvent(onOpenChangeProp);
    const onAnimationComplete = useEvent(onAnimationCompleteProp);
    const id = useId();
    // track hidden transitions to signal adapt handoff
    // when hidden goes from true -> false while open, the sheet should skip animation
    const wasHiddenRef = useRef(hidden);
    let skipNextAnimation = false;
    if (wasHiddenRef.current && !hidden && open) {
        skipNextAnimation = true;
    }
    wasHiddenRef.current = hidden;
    const memoValue = React.useMemo(() => ({
        id,
        open,
        hidden,
        disableDrag,
        onOpenChange,
        onAnimationComplete,
        skipNextAnimation,
    }), [id, onOpenChange, onAnimationComplete, open, hidden, disableDrag, skipNextAnimation]);
    return (_jsx(SheetControllerContext.Provider, { value: memoValue, children: children }));
};
//# sourceMappingURL=SheetController.js.map