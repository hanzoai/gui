import React from 'react'

// Avoid bundling react-dom into native: https://github.com/hanzogui/hanzogui/issues/688
export const useFloatingContext = () => React.useCallback(() => {}, [])
