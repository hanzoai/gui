import { NEUTRAL, useTint } from '@hanzogui/logo'
import { memo, useEffect, useState } from 'react'
import type { ColorTokens, ThemeName } from '@hanzo/gui'
import { YStack, isClient, useDidFinishSSR, useTheme } from '@hanzo/gui'

type Props = {
  colorKey?: ColorTokens
  theme?: ThemeName | null
}

/** Sets the ramp from a theme name, and paints the ground the page stands on. */
export const ThemeNameEffect = memo((props: Props) => {
  const Tint = useTint()

  useEffect(() => {
    if (!props.theme) {
      Tint.setTintIndex(NEUTRAL)
    } else {
      Tint.setTintIndex(Tint.tints.findIndex((x) => x === props.theme))
    }
  }, [props.theme])

  return <ThemeNameEffectNoTheme {...props} />
})

/**
 * The ground, off the neutral scale, whatever tint is in effect.
 *
 * A tint names an ACCENT. It belongs to the swatch, the demo and the ink, and
 * an accent that paints the ground stops being one: a few percent of yellow
 * across a dark page is olive, and of orange is brown. So this reads its colour
 * from the theme it is called under rather than from the tint, and the page
 * stays the same considered dark or light it was while the accent changes.
 */
export const ThemeNameEffectNoTheme = ({ colorKey = '$color1' }: Props) => {
  const isHydrated = useDidFinishSSR()
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)

  const color = theme[colorKey]?.val

  if (isClient) {
    useEffect(() => {
      if (!isHydrated) return
      if (!isActive) return
      document.querySelector('#theme-color')?.setAttribute('content', color)
      document.body.style.setProperty('background-color', color, 'important')
    }, [isHydrated, isActive, color])
  }

  return (
    <>
      <YStack
        ref={() => {
          setIsActive(true)
        }}
      />
      <style>{`body { background: var(--${colorKey.slice(1)}) !important }`}</style>
    </>
  )
}
