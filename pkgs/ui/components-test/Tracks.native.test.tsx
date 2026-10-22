import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, Text, View, createGui } from '@hanzogui/core'
import { shorthands } from '@hanzogui/shorthands/v5'
import { Wrap, XStack, YStack } from '@hanzogui/stacks'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

/**
 * `tracks` on native (@hanzogui/web helpers/tracks.ts): the stack stays flex,
 * and each child takes the track at its position as its flex style. Asserted on
 * the host views react-native receives, because that is the only place the
 * style a child ends with can be read.
 */

const conf = createGui({ ...getDefaultGuiConfig('native'), shorthands })

async function draw(ui: React.ReactElement) {
  let rendered: TestRenderer.ReactTestRenderer | null = null
  await act(async () => {
    rendered = TestRenderer.create(
      <GuiProvider config={conf} defaultTheme="light">
        {ui}
      </GuiProvider>
    )
  })
  return rendered!
}

const flatten = (style: any): Record<string, any> =>
  Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : style || {}

/** The flattened style on the host view carrying this testID. */
function styleOf(rendered: TestRenderer.ReactTestRenderer, id: string) {
  const host = rendered.root.findAll(
    (node) => node.props.testID === id && typeof node.type === 'string'
  )[0]
  if (!host) throw new Error(`no host view with testID ${id}`)
  return flatten(host.props.style)
}

const FILL = (n: number) => ({ flexGrow: n, flexShrink: 1, flexBasis: 0 })
const FIXED = (basis: number | string) => ({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: basis,
})
const CONTENT = { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }

describe('a stack with tracks falls back to flex', () => {
  test('the stack keeps its flex axis and gains no grid', async () => {
    const r = await draw(
      <YStack testID="s" tracks="auto 1fr auto">
        <View testID="a" />
      </YStack>
    )
    const s = styleOf(r, 's')
    expect(s.flexDirection).toBe('column')
    expect(s.display).toBeUndefined()
    expect(Object.keys(s).filter((k) => k.startsWith('grid'))).toEqual([])
  })

  test('each child takes the track at its position', async () => {
    const r = await draw(
      <YStack tracks="auto 1fr 120px 25% 2fr">
        <View testID="a" />
        <View testID="b" />
        <View testID="c" />
        <View testID="d" />
        <View testID="e" />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject(CONTENT)
    expect(styleOf(r, 'b')).toMatchObject(FILL(1))
    expect(styleOf(r, 'c')).toMatchObject(FIXED(120))
    expect(styleOf(r, 'd')).toMatchObject(FIXED('25%'))
    expect(styleOf(r, 'e')).toMatchObject(FILL(2))
  })

  test('an XStack does the same along its row', async () => {
    const r = await draw(
      <XStack testID="s" tracks="240px 1fr">
        <View testID="a" />
        <View testID="b" />
      </XStack>
    )
    expect(styleOf(r, 's').flexDirection).toBe('row')
    expect(styleOf(r, 'a')).toMatchObject(FIXED(240))
    expect(styleOf(r, 'b')).toMatchObject(FILL(1))
  })

  test('minmax(_, Nfr) is a fill, repeat() is written out, and a child past the list is content-sized', async () => {
    const r = await draw(
      <YStack tracks="minmax(0, 1fr) repeat(2, 64px 1fr)">
        <View testID="a" />
        <View testID="b" />
        <View testID="c" />
        <View testID="d" />
        <View testID="e" />
        <View testID="f" />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject(FILL(1))
    expect(styleOf(r, 'b')).toMatchObject(FIXED(64))
    expect(styleOf(r, 'c')).toMatchObject(FILL(1))
    expect(styleOf(r, 'd')).toMatchObject(FIXED(64))
    expect(styleOf(r, 'e')).toMatchObject(FILL(1))
    expect(styleOf(r, 'f')).toMatchObject(CONTENT)
  })

  test('an auto repeat needs a measured size, so the list ends there', async () => {
    const r = await draw(
      <YStack tracks="1fr repeat(auto-fill, 100px)">
        <View testID="a" />
        <View testID="b" />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject(FILL(1))
    expect(styleOf(r, 'b')).toMatchObject(CONTENT)
  })

  test('the track wins over a flex the child set itself', async () => {
    const r = await draw(
      <YStack tracks="auto 80px">
        <View testID="a" flex={1} />
        <View testID="b" grow={3} flexBasis={10} />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject(CONTENT)
    expect(styleOf(r, 'b')).toMatchObject(FIXED(80))
  })

  test('positions run through fragments and skip what does not render', async () => {
    const r = await draw(
      <YStack tracks="auto 1fr 2fr">
        {null}
        <>
          <View testID="a" />
          {false}
          <View testID="b" />
        </>
        <View testID="c" />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject(CONTENT)
    expect(styleOf(r, 'b')).toMatchObject(FILL(1))
    expect(styleOf(r, 'c')).toMatchObject(FILL(2))
  })

  test('an absolute child takes no track, as in grid', async () => {
    const r = await draw(
      <YStack tracks="auto 1fr">
        <View testID="over" position="absolute" />
        <View testID="a" />
        <View testID="b" />
      </YStack>
    )
    expect(styleOf(r, 'over').flexGrow).toBeUndefined()
    expect(styleOf(r, 'a')).toMatchObject(CONTENT)
    expect(styleOf(r, 'b')).toMatchObject(FILL(1))
  })

  test('a non-gui child takes the track as a style after its own', async () => {
    const Host = (props: any) => React.createElement('host-view', props)
    const r = await draw(
      <YStack tracks="1fr">
        <Host testID="a" style={{ flexGrow: 9, opacity: 0.5 }} />
      </YStack>
    )
    expect(styleOf(r, 'a')).toMatchObject({ ...FILL(1), opacity: 0.5 })
  })

  test('alignment keeps its flex names on native', async () => {
    const r = await draw(
      <YStack testID="s" tracks="1fr" items="center" justify="space-between">
        <View testID="a" self="flex-end" />
      </YStack>
    )
    expect(styleOf(r, 's')).toMatchObject({
      alignItems: 'center',
      justifyContent: 'space-between',
    })
    expect(styleOf(r, 'a').alignSelf).toBe('flex-end')
  })

  test('a Text child is placed like any other', async () => {
    const r = await draw(
      <YStack tracks="1fr">
        <Text testID="t">hello</Text>
      </YStack>
    )
    expect(styleOf(r, 't')).toMatchObject(FILL(1))
  })

  test('a stack without tracks leaves its children alone', async () => {
    const r = await draw(
      <YStack>
        <View testID="a" />
      </YStack>
    )
    expect(styleOf(r, 'a').flexGrow).toBeUndefined()
  })
})

describe('Wrap', () => {
  test('is a row that wraps', async () => {
    const r = await draw(<Wrap testID="w" gap={8} />)
    expect(styleOf(r, 'w')).toMatchObject({
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    })
  })
})
