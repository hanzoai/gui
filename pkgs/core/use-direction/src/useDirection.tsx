// forked from https://github.com/radix-ui/primitives/blob/main/packages/react/direction/src/Direction.tsx

import * as React from 'react'

export type Direction = 'ltr' | 'rtl'
const DirectionContext = React.createContext<Direction | undefined>(undefined)

interface DirectionProviderProps {
  children?: React.ReactNode
  dir: Direction
}

export const DirectionProvider: React.FC<DirectionProviderProps> = (props) => {
  const { dir, children } = props
  return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>
}

// The document's own direction: what an i18n layer sets with
// <html dir="rtl">. One observer serves every subscriber, and a change re-renders
// whatever read it, so switching language flips keyboard and slider direction
// without a provider anywhere.
const listeners = new Set<() => void>()
let observer: MutationObserver | undefined

function subscribe(listener: () => void) {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {}
  }
  listeners.add(listener)
  if (!observer) {
    observer = new MutationObserver(() => {
      for (const notify of listeners) notify()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    })
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size && observer) {
      observer.disconnect()
      observer = undefined
    }
  }
}

export function getDocumentDirection(): Direction {
  if (typeof document === 'undefined') return 'ltr'
  return document.documentElement.dir.toLowerCase() === 'rtl' ? 'rtl' : 'ltr'
}

const serverDirection = (): Direction => 'ltr'

export function useDirection(localDir?: Direction): Direction {
  const globalDir = React.useContext(DirectionContext)
  const documentDir = React.useSyncExternalStore(
    subscribe,
    getDocumentDirection,
    serverDirection
  )
  return localDir || globalDir || documentDir
}

export const Provider: React.FC<DirectionProviderProps> = DirectionProvider

/**
 * Spread onto an icon whose meaning is a direction (chevron, arrow, back,
 * forward, send) so it mirrors under RTL. Never on logos, media controls,
 * numbers, code or a chart's time axis. The rule that reads it:
 * `[data-i18n-mirror]:dir(rtl) { transform: scaleX(-1) }`.
 */
export const mirror = { 'data-i18n-mirror': '' } as const
