import { View, createGui, getSplitStyles } from '@hanzogui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

/**
 * What a grid becomes when it crosses to a platform that has no grid.
 *
 * React Native 0.83 types `display` as 'none' | 'flex' | 'contents' and Yoga's
 * Display enum carries Flex, None and Contents — there is no grid engine to
 * hand these to.
 *
 * So `display` crosses and nothing else does. The one-dimensional case survives
 * because the element's own flex properties already describe it: `display:
 * grid` becomes `flex`, and an XStack's `flexDirection: 'row'` was never a
 * grid property to begin with. No grid property is translated.
 *
 * That is the half worth testing. A property that is dropped and a property
 * that is handed to an engine which ignores it look identical in a screenshot
 * and identical in a passing build; the difference is whether it reached React
 * Native at all, which is what `viewProps` answers.
 *
 * NOTE: this file reads a PREBUILT bundle (@hanzogui/core/native-test →
 * dist/test.native.cjs), not src. Rebuild @hanzogui/core after touching
 * expandStyle or the prop tables, or it will grade the previous version.
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

  // The axis arrives on the flex property the element already carries — an
  // XStack's own base style — rather than being reconstructed from grid's
  // vocabulary. So a stack asked for grid keeps its direction here.
  test('a stack keeps its axis', () => {
    expect(split({ display: 'grid', flexDirection: 'row' }).style).toEqual({
      display: 'flex',
      flexDirection: 'row',
    })
  })

  // gap is React Native's own since 0.71, and means the same thing in both
  // engines, so it is not a grid property crossing — it just works.
  test('gap is not a crossing', () => {
    expect(split({ gap: 12 }).style).toEqual({ gap: 12 })
  })
})

describe('gridAutoFlow does not rewrite the flex axis', () => {
  // It reads like the one grid property flex could reproduce, since both name
  // an axis. It cannot be done per-property: expandStyle sees one key at a
  // time and never sees `display`, so the rewrite fired on flex containers
  // too — where grid-auto-flow is inert on web — and inverted them on native
  // only. Same source, two layouts.
  test("an author's flexDirection survives beside it", () => {
    expect(split({ flexDirection: 'row', gridAutoFlow: 'row' }).style).toEqual({
      flexDirection: 'row',
    })
  })

  // and it was total over its input, so values that mean nothing still picked
  // an axis
  for (const value of ['inherit', '', 'column', 'row']) {
    test(`${JSON.stringify(value)} picks no axis`, () => {
      const { style, viewProps } = split({ gridAutoFlow: value })
      expect(style?.flexDirection).toBeUndefined()
      expect(viewProps?.style?.flexDirection).toBeUndefined()
    })
  }
})

describe('the half flex cannot reproduce', () => {
  // Two-dimensional placement has no arrangement of flex properties that
  // yields it. These do not reach React Native in any form: not in style,
  // where an unknown key is ignored, and not as a prop either.
  const noEquivalent = {
    gridAutoFlow: 'column',
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
