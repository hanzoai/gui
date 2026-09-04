import '@hanzogui/polyfill-dev'

import { isServer } from '@hanzogui/constants'
import { GuiRoot, useDidFinishSSR, useThemeName } from '@hanzogui/web'
import { useStackedZIndex, ZIndexHardcodedContext } from '@hanzogui/z-index-stack'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { getStackedZIndexProps } from './helpers.ts'
import type { PortalProps } from './PortalProps.tsx'

export const Portal = React.memo((propsIn: PortalProps) => {
  const { children, passThrough, style, open } = propsIn

  const themeName = useThemeName()
  const didHydrate = useDidFinishSSR()
  const zIndex = useStackedZIndex(getStackedZIndexProps(propsIn))

  if (passThrough) {
    return children
  }

  if (!didHydrate) {
    return null
  }

  return createPortal(
    <GuiRoot
      theme={themeName}
      style={{
        zIndex,
        position: 'fixed',
        inset: 0,
        contain: 'strict',
        pointerEvents: open ? 'auto' : 'none',
        // prevent mobile browser from scrolling/moving this fixed element
        touchAction: 'none',
        display: 'flex',
        ...style,
      }}
    >
      {/* provide computed z-index to children so nested portals can stack above */}
      <ZIndexHardcodedContext.Provider value={zIndex}>
        {children}
      </ZIndexHardcodedContext.Provider>
    </GuiRoot>,
    globalThis.document?.body
  )
})
