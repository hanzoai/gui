import {
  enable,
  useElementLayout as useGuiElementLayout,
} from '@hanzo/gui-use-element-layout'
import { type RefObject, useEffect, useMemo } from 'react'
import type { LayoutEvent } from '../../types'

export function useElementLayout(
  ref: RefObject<any>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  // translates to hanzo-gui style
  const wrappedRef = useMemo(() => {
    return {
      current: {
        get host() {
          return ref.current
        },
      },
    }
  }, [ref])

  useEffect(() => {
    enable()
  }, [])

  return useGuiElementLayout(wrappedRef, onLayout)
}
