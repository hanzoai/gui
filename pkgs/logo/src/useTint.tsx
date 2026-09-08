import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDidFinishSSR, type ThemeName } from '@hanzo/gui'
import { getTints, setNextTintFamily, useTints } from './tints.tsx'

/** The stop with no sub-theme: the ground as published, and where the mark's
 *  dot sits. Every reader of the ramp asks here rather than writing a 3. */
export const NEUTRAL = 3

let current = NEUTRAL
let disableTintTheme = false

const listeners = new Set<Function>()
const disableListeners = new Set<Function>()

export const onTintChange = (listener: (cur: number) => void) => {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

const numTints = getTints().tints.length

export const setTintIndex = (next: number): void => {
  const val = Math.max(0, next % numTints)
  if (val === current) return
  current = val
  listeners.forEach((x) => x(val))
}

// when true, useTint returns null for tint/tintAlt so ThemeTint doesn't apply sub-themes
export const setDisableTintTheme = (disable: boolean): void => {
  if (disable === disableTintTheme) return
  disableTintTheme = disable
  disableListeners.forEach((x) => x(disable))
}

export const getDisableTintTheme = (): boolean => disableTintTheme

export function getDocsSection(pathname: string): 'compiler' | 'ui' | 'core' | null {
  return pathname === '/docs/intro/compiler-install' ||
    pathname === '/docs/intro/benchmarks' ||
    pathname === '/docs/intro/why-a-compiler'
    ? 'compiler'
    : pathname.startsWith('/ui/')
      ? 'ui'
      : pathname.startsWith('/docs/') || pathname.startsWith('/api')
        ? 'core'
        : null
}

export const InitialPathContext: React.Context<number> = createContext(NEUTRAL)

export const useTint = (
  altOffset = -1
): {
  tints: ThemeName[]
  tintIndex: number
  tintAltIndex: number
  tint: ThemeName
  tintAlt: ThemeName
  setTintIndex: (next: number) => void
  setNextTintFamily: () => void
  setNextTint: () => void
  setDisableTintTheme: (disable: boolean) => void
  disableTintTheme: boolean
  name: string
  families: {
    hanzogui: string[]
    xmas: string[]
    easter: string[]
    halloween: string[]
    valentine: string[]
    lunar: string[]
  }
} => {
  const initial = useContext(InitialPathContext)
  const didHydrate = useDidFinishSSR()
  const [index, setIndex] = useState(didHydrate ? current : initial)
  const [disabled, setDisabled] = useState(disableTintTheme)
  const tintsContext = useTints()
  const { tints } = tintsContext
  const tintAltIndex = Math.abs((index + altOffset) % tints.length)

  useEffect(() => {
    return onTintChange((cur) => {
      setIndex(cur)
    })
  }, [])

  useEffect(() => {
    const cb = (val: boolean) => setDisabled(val)
    disableListeners.add(cb)
    return () => {
      disableListeners.delete(cb)
    }
  }, [])

  // null at the neutral notch, so the parent theme is what shows
  const tint = disabled || index === NEUTRAL ? null : tints[index]
  const tintAlt = disabled || tintAltIndex === NEUTRAL ? null : tints[tintAltIndex]

  return {
    ...tintsContext,
    tints: tintsContext.tints as ThemeName[],
    tintIndex: index,
    tintAltIndex,
    tint: tint as ThemeName,
    tintAlt: tintAlt as ThemeName,
    setTintIndex,
    setNextTintFamily,
    setDisableTintTheme,
    disableTintTheme: disabled,
    setNextTint: () => {
      React.startTransition(() => {
        setTintIndex(index + 1)
      })
    },
  } as const
}
