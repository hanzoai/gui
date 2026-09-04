import type { LayoutValue } from '@hanzogui/use-element-layout'
import React, { useEffect, useState } from 'react'
import type { XStackProps } from '@hanzo/gui'
import { Circle, XStack } from '@hanzo/gui'
import { WORDMARKS } from '@hanzo/logo/wordmarks'
import { useTint } from './useTint.tsx'

/**
 * The wordmark.
 *
 * This drew T-A-M-A-G-U-I: seven pixel-art letter polygons on a 373x41 box,
 * each tinted from a seven-colour table, with the hover strip split into seven
 * sections and the dot stepped by a constant fitted to those letters. The fork
 * renamed the package and kept the artwork, so the site's own name was another
 * company's.
 *
 * It renders the outlined Hanzo wordmark from @hanzo/logo now — real paths cut
 * from Zen, so it needs no font loaded and cannot drift from the wordmark every
 * other Hanzo surface uses.
 *
 * The tint interaction stays, because it is a feature rather than a piece of
 * the old wordmark — but it is no longer DIMENSIONED to seven letters. The
 * strip divides by however many tints there are, and the dot rides the same
 * fraction, so the two agree whatever that number becomes.
 */
const WORDMARK = WORDMARKS['Hanzo']
const [WM_X, WM_Y, WM_W, WM_H] = WORDMARK.box

export const LogoWords: React.MemoExoticComponent<
  ({
    downscale,
    animated,
    ...props
  }: XStackProps & {
    downscale?: number
    animated?: boolean
  }) => import('react/jsx-runtime').JSX.Element
> = React.memo(({ downscale = 1, animated, ...props }) => {
  const Tint = useTint()
  const [hovered, setHovered] = React.useState(false)
  const [mounted, setMounted] = React.useState<'start' | 'animate' | 'done'>('start')

  const { tintIndex: index } = Tint
  const sections = Tint.tints.length

  useEffect(() => {
    const idle = window.requestIdleCallback || setTimeout
    idle(() => {
      setTimeout(() => {
        setMounted('animate')
      }, 50)

      setTimeout(() => {
        setMounted('done')
      }, 1500)
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const i = Number.parseInt(event.key, 10) - 1 // Convert key to index (0-based)
      if (!Number.isNaN(i) && i >= 0 && i < Tint.tints.length) {
        Tint.setTintIndex(i)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [Tint])

  const [layout, setLayout] = useState<LayoutValue>()

  // The mark is one ink; the tint shows through the dot rather than by
  // recolouring letters, which is what the seven-colour table did.
  const fill = hovered ? `var(--${Tint.tints[index]}9)` : 'var(--color12)'

  const width = 373 * (1 / downscale) * 0.3333333
  const height = (width * WM_H) / WM_W
  // the dot sits over the section the current tint owns
  const dotX = Math.round((width / sections) * (index + 0.5))

  return (
    <XStack
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      paddingVertical="$2"
      data-tauri-drag-region
      marginVertical="$-2"
      position="relative"
      className="logo-words"
      onLayout={(e) => {
        setLayout(e.nativeEvent.layout as any)
      }}
      // @ts-ignore
      onMouseMove={(e: MouseEvent) => {
        if (!layout) return
        const x = e.clientX - layout.pageX
        const sectionWidth = layout.width / sections
        const section = Math.min(sections - 1, Math.max(0, Math.floor(x / sectionWidth)))
        Tint.setTintIndex(section)
      }}
      {...props}
    >
      {animated && (
        <Circle
          transition="medium"
          position="absolute"
          top={0}
          left={0}
          y={mounted === 'start' ? -30 : -4}
          x={dotX}
          size={4}
          backgroundColor="$color12"
        />
      )}

      <svg
        data-tauri-drag-region
        role="img"
        aria-label="Hanzo"
        width={width}
        height={height}
        viewBox={`${WM_X} ${-WM_Y - WM_H} ${WM_W} ${WM_H}`}
      >
        <g transform="scale(1,-1)">
          <path d={WORDMARK.d} fill={fill} />
        </g>
      </svg>
    </XStack>
  )
})
