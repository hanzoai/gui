import type { CircleProps } from '@hanzo/gui'
import { Circle } from '@hanzo/gui'

const button = <button type="button" />

/**
 * A round control that says whether it is the chosen one.
 *
 * Chosen is a two-pixel border in the theme's ink, on the edge. Focus is a ring
 * in the theme's solid step, a clear gap further out — so the two are told apart
 * by where they sit as well as by tone, and a focused circle still shows the
 * hairline that says it is not the chosen one. The solid step is the lowest rung
 * that clears 3:1 against every ground this row sits on, measured on both
 * schemes over all seven tints the page can paint behind it.
 *
 * Hover stays off the chosen one: a pointer resting on it must not dim the ring
 * that says it is chosen.
 *
 * It renders a real button, which is what puts it in the tab order and makes
 * Enter and Space work.
 */
export const ActiveCircle = ({
  isActive,
  children,
  ...rest
}: CircleProps & { isActive?: boolean }) => {
  return (
    <Circle
      render={button}
      aria-pressed={isActive}
      size={32}
      cursor="pointer"
      borderWidth={isActive ? 2 : 1}
      borderColor={isActive ? '$color' : '$borderColor'}
      focusVisibleStyle={{
        outlineColor: '$color10',
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineOffset: 3,
      }}
      {...(!isActive && { hoverStyle: { borderColor: '$color10' } })}
      {...rest}
    >
      {children}
    </Circle>
  )
}
