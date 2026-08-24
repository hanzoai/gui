import type { JSX } from 'react/jsx-runtime'
import { MARK_BLOCKS } from '@hanzo/logo/logos'

type GuiIconSvgProps = React.SVGProps<SVGSVGElement> & {
  color?: string
}

/**
 * The Hanzo mark.
 *
 * This drew a duck — `<g id="duck">`, pixel art, `#ECD20A` — because the fork
 * renamed the package and left the artwork. It was the mark in this site's
 * header, footer, login, 404, every doc page and its favicon.
 *
 * The geometry comes from `@hanzo/logo`, never retyped: MARK_BLOCKS is the five
 * body blocks of the block-H on its own 67 viewBox. `currentColor` by default so
 * the mark themes with the text around it rather than pinning a brand hex.
 */
export const GuiIconSvg = ({
  color = 'currentColor',
  ...props
}: GuiIconSvgProps): JSX.Element => (
  <svg viewBox="0 0 67 67" width="67px" height="67px" {...props}>
    {MARK_BLOCKS.map((d) => (
      <path key={d} d={d} fill={color} />
    ))}
  </svg>
)
