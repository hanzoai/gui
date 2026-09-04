import { isWeb } from '@hanzogui/constants'
import { normalizeShadow } from './normalizeShadow.ts'

export function fixStyles(style: Record<string, any>) {
  if (process.env.GUI_TARGET === 'web') {
    resolveAxis(style)
  }

  if (process.env.GUI_TARGET === 'native') {
    if ('elevationAndroid' in style) {
      // @ts-ignore
      style['elevation'] = style.elevationAndroid
      // @ts-ignore
      delete style.elevationAndroid
    }
  }

  // TODO deprecate for web-style shadows
  if (
    style.shadowRadius != null ||
    style.shadowColor ||
    style.shadowOpacity != null ||
    style.shadowOffset
  ) {
    Object.assign(style, normalizeShadow(style))
  }

  // could be optimized better
  // ensure border style set by default to solid
  for (const key in borderDefaults) {
    if (key in style) {
      style[borderDefaults[key]] ||= 'solid'
    }
  }
}

/**
 * A stack asked for grid is still a stack.
 *
 * flex-direction is inert under `display: grid`, so a component that names its
 * axis the flex way lays out along grid's default axis instead — which runs the
 * other way, because the two vocabularies invert: flex `row` runs across, grid
 * `row` fills rows and so runs down. An XStack asked for grid came out vertical.
 *
 * That is not an XStack problem. `flexDirection: 'row'` is a base style on
 * seven more components in pkgs/ui — Card, ListItem, RadioGroup, Button,
 * Fieldset, MenuPredefined, Tabs — and on every `styled(View, ...)` an author
 * writes, which is the pattern the docs teach. So the axis is restated here,
 * once, rather than in any component's variant table.
 *
 * Here is also the only place the REST of the style is visible, and that is
 * what makes the restatement safe to skip. Naming tracks or areas is the author
 * describing the grid themselves; forcing column flow on top would push items
 * into implicit tracks — `repeat(3, 1fr)` became six columns, three of them 7px
 * slivers — and transpose named areas into the right geometry with the wrong
 * items in it. Being visible to the whole style is also what makes it
 * order-independent: as a variant, `gridAutoFlow` before `display` and after it
 * gave different layouts.
 *
 * flexWrap bails out for the same reason and a blunter one: grid has no
 * equivalent, and column flow plus wrap does not wrap — it lays an eighth
 * 120px child 360px outside a 600px box. Leaving grid's own row flow gives a
 * single column, which is a degradation you can see rather than one off-screen.
 */
function resolveAxis(style: Record<string, any>) {
  if (style.display !== 'grid' && style.display !== 'inline-grid') return
  if (style.flexDirection !== 'row' && style.flexDirection !== 'row-reverse') return
  if (style.flexWrap === 'wrap' || style.flexWrap === 'wrap-reverse') return
  if (
    style.gridAutoFlow != null ||
    style.grid != null ||
    style.gridTemplate != null ||
    style.gridTemplateAreas != null ||
    style.gridTemplateColumns != null ||
    style.gridTemplateRows != null
  ) {
    return
  }
  style.gridAutoFlow = 'column'
}

// native doesn't support specific border edge style
const nativeStyle = isWeb ? null : 'borderStyle'
const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: nativeStyle || 'borderBottomStyle',
  borderTopWidth: nativeStyle || 'borderTopStyle',
  borderLeftWidth: nativeStyle || 'borderLeftStyle',
  borderRightWidth: nativeStyle || 'borderRightStyle',
  // TODO: need to add borderBlock and borderInline here, but they are alot and might impact performance
}
