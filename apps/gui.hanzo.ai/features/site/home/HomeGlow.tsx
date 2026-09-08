import { useTint } from '@hanzogui/logo'
import { memo, useMemo, useState } from 'react'
import { AnimatePresence, YStack, isClient, useMedia } from '@hanzo/gui'

import { useTintSectionIndex } from './TintSection'

// Three lamps behind the hero, in the ramp's next three stops.
//
// They stop at the hero. A stop reaches the swatch, the demo, the ink and the
// stored accent — never the ground — and a lamp carried down the page is the
// ground by another route: it is what put a wash under the player row and left
// the section brown at orange and olive at yellow. Below the hero the sections
// stand on the neutral scale, which is where they were published.
const scales = [0.94, 0.51, 1.06]

export const HomeGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const [atHero, setAtHero] = useState(true)
  const { reduceMotion } = useMedia()

  if (isClient) {
    useTintSectionIndex((index) => {
      setAtHero(index <= 1)
    })
  }

  const glows = useMemo(() => {
    if (!atHero) return null

    return scales.map((scale, i) => {
      const curTint = tints[(tintIndex + i) % tints.length]
      if (!curTint) {
        return null
      }

      return (
        <YStack
          key={`${i}${tint}${tintAlt}`}
          transition={reduceMotion ? null : 'superLazy'}
          enterStyle={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
          opacity={0.5}
          overflow="hidden"
          height="100vh"
          maxH={650}
          width={650}
          position="absolute"
          t={0}
          l={`calc(50vw - 500px)`}
          x={i === 1 ? -249 : 251}
          y={350}
          scale={2 * scale}
        >
          <YStack
            fullscreen
            style={{
              background: `radial-gradient(var(--${curTint}7) 20%, transparent 50%)`,
              transition: `all ease-in-out 1000ms`,
              // raster the gradient into its own gpu layer once so scrolling
              // composites a cached texture instead of re-painting it each frame
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </YStack>
      )
    })
  }, [atHero, tint, tintAlt, tintIndex, tints, reduceMotion])

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      pointerEvents="none"
      className="all ease-in-out s1"
      key={0}
      z={0}
      x={0}
      y={-100}
      opacity={0.24}
      // keep the whole glow group on its own compositor layer so page scroll
      // moves a cached texture rather than repainting the gradients
      style={{ willChange: 'transform' }}
    >
      <AnimatePresence>{glows}</AnimatePresence>
    </YStack>
  )
})
