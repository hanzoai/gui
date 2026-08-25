import {
  GuiProvider,
  StyleObjectValue,
  View,
  createGui,
  getSplitStyles,
  styled,
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

  // A track SIZE is a length too, and these four sat with the line properties:
  // `grid-auto-rows: 100` computes to `auto`, so it compiled, extracted,
  // shipped and rendered nothing.
  for (const prop of [
    'gridAutoColumns',
    'gridAutoRows',
    'gridTemplateColumns',
    'gridTemplateRows',
  ]) {
    test(`a number on ${prop} is a length`, () => {
      expect(declared({ [prop]: 100 }, prop)).toBe('100px')
    })
  }
})

describe('the axis is resolved against the mode', () => {
  // These render rather than split props, because a styled component's own base
  // style is not among its props: `flexDirection: 'row'` reaches the style
  // object from XStack's definition, and the whole question is what the
  // finished element emits.
  const classOf = (ui: React.ReactElement) => {
    const { container } = render(
      <GuiProvider config={config} defaultTheme="light">
        {ui}
      </GuiProvider>
    )
    return (container.querySelector('[data-solo]') as HTMLElement).className
  }

  // flexDirection is inert under grid, and grid's default flow fills ROWS,
  // which runs DOWN — so a component whose axis is named the flex way laid out
  // backwards. Restated once, where display and flexDirection are both visible.
  test('a stack asked for grid still runs across', () => {
    expect(classOf(<XStack data-solo display="grid" />)).toBe(
      'is_View _fd-row _dsp-grid _gridAutoFlow-column'
    )
  })

  test('and inline-grid the same', () => {
    expect(classOf(<XStack data-solo display="inline-grid" />)).toContain(
      '_gridAutoFlow-column'
    )
  })

  // Not an XStack fix. Seven components in pkgs/ui carry flexDirection: 'row'
  // as a base style — Card, ListItem, RadioGroup, Button, Fieldset,
  // MenuPredefined, Tabs — as does every styled(View) an author writes, which
  // is the pattern the docs teach.
  test('any component whose base names a row is covered', () => {
    const Row = styled(View, { flexDirection: 'row' })
    expect(classOf(<Row data-solo display="grid" />)).toBe(
      'is_View _fd-row _dsp-grid _gridAutoFlow-column'
    )
  })

  test('costs nothing when grid is not asked for', () => {
    expect(classOf(<XStack data-solo />)).toBe('is_View _fd-row')
  })

  // Grid's default flow already fills one implicit column top to bottom, which
  // is what a YStack is. Asserted so the asymmetry reads as a measurement
  // rather than an omission.
  test('a column needs no restatement, because grid already agrees', () => {
    expect(classOf(<YStack data-solo display="grid" />)).toBe(
      'is_View _fd-column _dsp-grid'
    )
  })
})

describe('naming the tracks is the author speaking', () => {
  const classOf = (ui: React.ReactElement) => {
    const { container } = render(
      <GuiProvider config={config} defaultTheme="light">
        {ui}
      </GuiProvider>
    )
    return (container.querySelector('[data-solo]') as HTMLElement).className
  }

  // Column flow on top of three explicit columns pushes the fourth item into an
  // implicit fourth column: measured in Chromium as six tracks, three of them
  // 7px slivers, on one row. The restatement has to yield here, and it can,
  // because the rest of the style is visible where it happens.
  test('an explicit column list is left alone', () => {
    expect(classOf(<XStack data-solo display="grid" gridTemplateColumns="repeat(3, 1fr)" />))
      .not.toContain('_gridAutoFlow')
  })

  // Named areas are worse than broken under forced column flow — they keep the
  // right geometry and put the wrong children in it.
  test('named areas are left alone', () => {
    expect(classOf(<XStack data-solo display="grid" gridTemplateAreas={'"a b" "c d"'} />))
      .not.toContain('_gridAutoFlow')
  })

  for (const [name, props] of [
    ['a row list', { gridTemplateRows: 'repeat(2, 1fr)' }],
    ['the grid shorthand', { grid: 'auto / auto' }],
    ['the template shorthand', { gridTemplate: 'auto / auto' }],
  ] as const) {
    test(`${name} is left alone`, () => {
      expect(classOf(<XStack data-solo display="grid" {...props} />)).not.toContain(
        '_gridAutoFlow'
      )
    })
  }

  // Grid has no equivalent of wrap, and column flow plus wrap does not wrap —
  // it lays an eighth 120px child 360px outside a 600px box. Grid's own row
  // flow gives a single column, which is a degradation you can see.
  test('a wrapping stack is left alone', () => {
    expect(classOf(<XStack data-solo display="grid" flexWrap="wrap" />)).not.toContain(
      '_gridAutoFlow'
    )
  })

  // The author's own flow wins from either side. As a variant this depended on
  // the order the props were written in, silently.
  test('an explicit flow wins, written before display', () => {
    expect(classOf(<XStack data-solo gridAutoFlow="row" display="grid" />)).toContain(
      '_gridAutoFlow-row'
    )
  })

  test('an explicit flow wins, written after display', () => {
    expect(classOf(<XStack data-solo display="grid" gridAutoFlow="row" />)).toContain(
      '_gridAutoFlow-row'
    )
  })
})
