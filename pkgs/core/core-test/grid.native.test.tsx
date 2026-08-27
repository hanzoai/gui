import { StyleObjectValue, View, createGui, getSplitStyles } from '@hanzogui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import configDefault from '../config-default'

/**
 * Grid SURVIVES the native build.
 *
 * It used not to. Yoga's Display enum carried Flex, None and Contents and
 * nothing else, so `display: grid` was rewritten to flex on the way through and
 * every other grid property was stripped — a one-dimensional stack arrived and
 * the rest of the layout did not. That was the correct answer for that engine.
 *
 * hanzoai/yoga has `Display::Grid` and a grid algorithm, so the correct answer
 * changed. This file is the assertion that it actually did: the value is not
 * rewritten, and the track and placement properties are still there afterwards
 * rather than dropped on the floor.
 *
 * The web counterpart (grid.web.test.tsx) proves the other half — that a
 * property gui does not recognise becomes a DOM attribute and a console warning
 * nobody reads. Here the failure is quieter still: a stripped property is simply
 * absent, and the layout is wrong with nothing said about it.
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
    true,
  ) as any

/** What the style actually carries for this property once gui is done with it. */
const styled = (props: Record<string, any>, prop: string) => {
  const out = split(props)
  const flat = ([] as any[]).concat(out.style ?? [], out.viewProps?.style ?? [])
  for (const s of flat) if (s && s[prop] !== undefined) return s[prop]
  const rules = out.rulesToInsert ?? {}
  const rule: any = Object.values(rules).find((r: any) => r[0] === prop)
  return rule?.[StyleObjectValue]
}

describe('grid crosses to native', () => {
  test('display: grid is NOT rewritten to flex', () => {
    // The whole point. A rewrite here is invisible downstream — the element
    // still lays out, just as a column, and nothing reports the substitution.
    expect(styled({ display: 'grid' }, 'display')).toBe('grid')
  })

  test('inline-grid folds to grid, because native has no inline context', () => {
    // The inline half has nothing to mean where there is no inline formatting
    // context for a box to join. The grid half does, and it is kept.
    expect(styled({ display: 'inline-grid' }, 'display')).toBe('grid')
  })

  const grid = {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gridTemplateRows: 'auto auto',
    gridAutoColumns: 'max-content',
    gridAutoRows: 'min-content',
    gridAutoFlow: 'column',
    gridColumn: 'span 2',
    gridRow: '1 / 3',
    gridColumnStart: 2,
    gridRowEnd: -1,
    justifyItems: 'center',
    justifySelf: 'end',
    placeItems: 'center',
    placeContent: 'space-between',
    placeSelf: 'center',
  }

  for (const [prop, value] of Object.entries(grid)) {
    test(`${prop} is not stripped`, () => {
      expect(styled({ display: 'grid', [prop]: value }, prop)).toBe(value)
    })
  }

  test('list-item still folds — Yoga has no marker box', () => {
    // Grid moving does not move this one with it: a marker box is a different
    // capability, and nothing here has it.
    expect(styled({ display: 'list-item' }, 'display')).toBe('flex')
  })
})
