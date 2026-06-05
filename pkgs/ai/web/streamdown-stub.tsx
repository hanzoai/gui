// Web DEV stub for the streamdown markdown stack. The real packages carry a
// nested micromark@4/util@2 chain that esbuild's dev pre-bundle can't resolve
// (it flattens the bare `micromark-util-symbol` to the hoisted @1, which has
// subpath-only exports). The PROD build (rollup) uses the real packages and
// resolves the nesting correctly, so this stub only affects `vite` dev: chat
// markdown renders as pre-wrapped text, code/math/mermaid plugins are no-ops.
import React from 'react';

export const createCodePlugin = () => () => ({});
export const math = () => ({});
export const mermaid = () => ({});

export const Streamdown: React.FC<{
  children?: React.ReactNode;
  content?: string;
  className?: string;
}> = ({ children, content, className }) =>
  React.createElement(
    'div',
    { className: ['prose', 'max-w-none', 'whitespace-pre-wrap', className].filter(Boolean).join(' ') },
    content ?? children,
  );

export default Streamdown;
