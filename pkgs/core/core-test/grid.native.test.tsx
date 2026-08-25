import { View, createGui, getSplitStyles } from '@hanzogui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

/**
 * What a grid becomes when it crosses to a platform that has no grid.
 *
 * React Native 0.83 types `display` as 'none' | 'flex' | 'contents' and Yoga's
 * Display enum carries Flex, None and Contents — there is no grid engine to
 * hand these to. So the crossing has two halves, and the point of this file is
 * that they are DIFFERENT halves and neither is a guess:
 *
 *   faithful  — flex reproduces the layout exactly, so the property is mapped
 *   absent    — flex has no equivalent, so the property is dropped entirely
 *
 * The second half is the one worth testing. A property that is dropped and a
 * property that is handed to an engine which ignores it look identical in a
 * screenshot and identical in a passing build; the difference is whether it
 * reached React Native at all, which is what `viewProps` answers.
 */

beforeAll(() => {
  createGui(config.getDefaultGuiConfig('native'))
})

function split(props: Record<string, any>) {
  return getSplitStyles(
    props,
    View.staticConfig,
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
    {
      isAnimated: false,
      mediaState: undefined,
      noClassNames: false,
      resolveValues: 'auto',
    } as any,
    {},
    { animationDriver: {}, groups: { state: {} } } as any,
    undefined,
    undefined,
    true
  ) as any
}

describe('the half flex reproduces', () => {
  // A grid with no template has one implicit column and fills it top to
  // bottom. That is a flex column, so a one-dimensional grid arrives intact.
  test('grid is flex', () => {
    expect(split({ display: 'grid' }).style).toEqual({ display: 'flex' })
    expect(split({ display: 'inline-grid' }).style).toEqual({ display: 'flex' })
  })

  // gridAutoFlow and flexDirection name the same axis with the words swapped:
  // grid fills ROWS to run down, flex points its main axis along a ROW to run
  // across. Crossing without the swap would turn every row into a column.
  test('the axis crosses, inverted', () => {
    expect(split({ gridAutoFlow: 'column' }).style).toEqual({ flexDirection: 'row' })
    expect(split({ gridAutoFlow: 'row' }).style).toEqual({ flexDirection: 'column' })
  })

  // `dense` only decides how holes left by explicit placement are backfilled,
  // and a one-dimensional layout has no holes.
  test('dense crosses as its plain form', () => {
    expect(split({ gridAutoFlow: 'column dense' }).style).toEqual({
      flexDirection: 'row',
    })
    expect(split({ gridAutoFlow: 'row dense' }).style).toEqual({
      flexDirection: 'column',
    })
  })

  // gap is React Native's own since 0.71, and means the same thing in both
  // engines, so it is not a grid property crossing — it just works.
  test('gap is not a crossing', () => {
    expect(split({ gap: 12 }).style).toEqual({ gap: 12 })
  })
})

describe('the half flex cannot reproduce', () => {
  // Two-dimensional placement has no arrangement of flex properties that
  // yields it. These do not reach React Native in any form: not in style,
  // where an unknown key is ignored, and not as a prop either.
  const noEquivalent = {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: '"a b" "c d"',
    gridTemplate: 'auto / auto',
    grid: 'auto / auto',
    gridAutoColumns: '1fr',
    gridAutoRows: '1fr',
    gridArea: 'a',
    gridColumn: 'span 2',
    gridColumnStart: 1,
    gridColumnEnd: 3,
    gridRow: '1 / 3',
    gridRowStart: 1,
    gridRowEnd: 3,
    justifyItems: 'center',
    justifySelf: 'center',
    placeItems: 'center',
    placeContent: 'center',
    placeSelf: 'center',
  }

  for (const [prop, value] of Object.entries(noEquivalent)) {
    test(`${prop} does not cross`, () => {
      const { style, viewProps } = split({ [prop]: value })
      expect(style?.[prop]).toBeUndefined()
      // the assertion that matters: it is not handed to React Native as a prop
      // either. A style key React Native ignores and a property that never
      // arrived are indistinguishable on screen.
      expect(viewProps?.[prop]).toBeUndefined()
      expect(viewProps?.style?.[prop]).toBeUndefined()
    })
  }

  // and the whole set together is still nothing, so no single one of them is
  // carrying the others through some shorthand expansion
  test('the set together reaches native as nothing at all', () => {
    const { style, viewProps } = split(noEquivalent)
    expect(style).toBeNull()
    expect(viewProps).toEqual({})
  })
})
