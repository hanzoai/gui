import {
  GuiProvider,
  StyleObjectValue,
  View,
  createGui,
  getSplitStyles,
} from '@hanzogui/core'
import { XStack, YStack } from '@hanzogui/stacks'
import { render } from '@testing-library/react'
import { beforeAll, describe, expect, test } from 'vitest'

import configDefault from '../config-default'

/**
 * Grid on web is the browser's own, so what has to be proven here is not that
 * CSS Grid works — it is that a grid property gui does not recognise leaves no
 * trace anyone would notice. gui drops an unknown prop without a throw and
 * without a type error; it falls through to the element as an attribute, where
 * React logs a warning nobody reads. `gridTemplateRows` sat in exactly that
 * state. So every property is checked twice: it produced a rule, AND it is not
 * sitting in viewProps waiting to become an attribute.
 */

let config: any
beforeAll(() => {
  config = createGui(configDefault.getDefaultGuiConfig())
})

const split = (props: Record<string, any>, C: any = View) =>
  getSplitStyles(
    props,
    C.staticConfig,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      focusVisible: false,
      disabled: false,
      unmounted: true,
    },
    { isAnimated: false, mediaState: undefined, resolveValues: 'auto' } as any,
    {},
    { animationDriver: {}, groups: { state: {} } } as any,
    undefined,
    undefined,
    true
  ) as any

/** the declaration gui actually wrote for this property, or undefined */
const declared = (props: Record<string, any>, prop: string) => {
  const rules = split(props).rulesToInsert ?? {}
  const rule: any = Object.values(rules).find((r: any) => r[0] === prop)
  return rule?.[StyleObjectValue]
}

describe('every grid property reaches CSS', () => {
  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: '"a b" "c d"',
    gridAutoColumns: '1fr',
    gridAutoRows: 'minmax(100px, auto)',
    gridAutoFlow: 'dense',
    justifyItems: 'center',
    placeItems: 'center',
    placeContent: 'space-between',
    gridArea: 'a',
    gridColumn: 'span 2',
    gridRow: '1 / 3',
    justifySelf: 'end',
    placeSelf: 'center',
    gap: '12px',
  }

  for (const [prop, value] of Object.entries(grid)) {
    test(`${prop} is a declaration, not an attribute`, () => {
      const one = { [prop]: value }
      expect(declared(one, prop)).toBe(String(value))
      // the failure mode this whole file exists for: not recognised, so passed
      // through to the element, where it becomes a lowercase DOM attribute and
      // costs only a console warning.
      expect(split(one).viewProps?.[prop]).toBeUndefined()
    })
  }

  test('all of them together, one class each, nothing left over', () => {
    const { classNames, viewProps } = split(grid)
    expect(Object.keys(classNames)).toEqual(Object.keys(grid))
    expect(Object.keys(viewProps)).toEqual(['className', 'style'])
  })
})

describe('a grid line is a line, not a length', () => {
  // `grid-row: 2px` is a declaration the browser drops. Numbers on these
  // properties are line numbers and must not be given a unit — unlike gap,
  // which is a length and must.
  test('a number on a placement property stays unitless', () => {
    expect(declared({ gridRow: 2 }, 'gridRow')).toBe(2)
    expect(declared({ gridColumnStart: 1 }, 'gridColumnStart')).toBe(1)
  })

  test('a number on gap is a length', () => {
    expect(declared({ gap: 12 }, 'gap')).toBe('12px')
    expect(declared({ rowGap: 12 }, 'rowGap')).toBe('12px')
  })
})

describe('the axis is resolved against the mode', () => {
  // XStack means "a horizontal line". flexDirection is one engine's word for
  // that, and it is inert under grid — grid's default flow fills ROWS, which
  // runs DOWN, so an XStack asked for grid used to lay out vertically.
  test('XStack in grid mode still runs across', () => {
    expect(split({ display: 'grid' }, XStack).classNames).toMatchObject({
      display: '_dsp-grid',
      gridAutoFlow: '_gridAutoFlow-column',
    })
  })

  test('and inline-grid the same', () => {
    expect(split({ display: 'inline-grid' }, XStack).classNames).toMatchObject({
      display: '_dsp-inline-grid',
      gridAutoFlow: '_gridAutoFlow-column',
    })
  })

  test('every other display value still passes through', () => {
    for (const mode of ['none', 'flex', 'inline-flex', 'block', 'contents']) {
      expect(split({ display: mode }, XStack).classNames.display).toBe(`_dsp-${mode}`)
      expect(split({ display: mode }, XStack).classNames.gridAutoFlow).toBeUndefined()
    }
  })

  // These read the rendered element rather than getSplitStyles, because the
  // question is what the WHOLE component emits — a styled component's own base
  // style is not among the props, so `flexDirection: 'row'` never appears in a
  // split of `{}`, and the cost of the arm is exactly what is being measured.
  const classOf = (ui: React.ReactElement) => {
    const { container } = render(
      <GuiProvider config={config} defaultTheme="light">
        {ui}
      </GuiProvider>
    )
    return (container.querySelector('[data-solo]') as HTMLElement).className
  }

  // The arm must cost nothing to the call sites that never ask for grid, which
  // today is all of them: a variant that is not passed emits no class.
  test('a plain XStack is unchanged', () => {
    expect(classOf(<XStack data-solo />)).toBe('is_View _fd-row')
  })

  test('a grid XStack adds the axis and nothing else', () => {
    expect(classOf(<XStack data-solo display="grid" />)).toBe(
      'is_View _fd-row _dsp-grid _gridAutoFlow-column'
    )
  })

  // YStack needs no arm at all: grid's default flow already fills one implicit
  // column top to bottom, which is what a YStack is. Asserted so the asymmetry
  // with XStack reads as a measurement rather than an omission.
  test('YStack needs no arm, because grid already agrees with it', () => {
    expect(classOf(<YStack data-solo display="grid" />)).toBe('is_View _fd-column _dsp-grid')
  })
})
