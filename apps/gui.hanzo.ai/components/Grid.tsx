import { View, type ViewProps } from '@hanzo/gui'

/**
 * A grid, on the platform's own grid.
 *
 * This used to be two components behind an `isWeb` branch, and the web half
 * dropped to a raw `<div style={{ display: 'grid' }}>` — outside the theme,
 * outside the tokens, outside media queries. That was not a shortcut; it was
 * the only way to say `display: grid`, because gui's `display` type listed
 * flex and not grid. It does now, so this is one component again.
 *
 * The platform branch survives as a VALUE rather than a second return: React
 * Native has no grid engine, so native gets a wrapping row, declared here in
 * the same style object as everything else.
 */
export type GridProps = ViewProps & {
  /** Narrowest a cell may get before the track count drops. */
  min?: number
  /** A fixed track count, for a layout that should not reflow. */
  columns?: number
}

export const Grid = ({ min = 200, columns, ...rest }: GridProps) => (
  <View
    display="grid"
    gridTemplateColumns={
      columns ? `repeat(${columns}, 1fr)` : `repeat(auto-fit, minmax(${min}px, 1fr))`
    }
    $platform-native={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    {...rest}
  />
)
