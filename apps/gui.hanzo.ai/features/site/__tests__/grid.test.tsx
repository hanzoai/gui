import { createGui, GuiProvider, View, XStack, YStack } from '@hanzo/gui'
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'

/**
 * Grid, asserted on what RENDERS.
 *
 * A green build proves nothing here: gui drops a style prop it does not know
 * without a throw and without a type error, so `display="grid"` compiled long
 * before it reached the DOM. Every claim below is read back out of
 * `getComputedStyle`, and every element is also checked for the OTHER failure
 * mode — an unrecognised prop falling through React onto the node as a
 * lowercase attribute (`gridtemplatecolumns="…"`), which reads as working in
 * the markup and styles nothing.
 *
 * The config is built inline rather than imported: the site's own config pulls
 * in font packages, and none of this depends on a typeface.
 */
const gui = createGui({
  tokens: { color: {}, space: {}, size: {}, radius: {}, zIndex: {} },
  themes: { light: {} },
  fonts: {},
})

const draw = async (ui: ReactNode) => {
  // One tree at a time. jsdom resolves a bare `#id` through getElementById,
  // which returns the first match in the DOCUMENT and only then checks it is
  // inside the scope element — so an id reused by an earlier test resolves to
  // that earlier tree and this one reads as never rendered.
  document.body.innerHTML = ''
  const host = document.createElement('div')
  document.body.appendChild(host)
  await act(async () => {
    createRoot(host).render(
      <GuiProvider config={gui as any} defaultTheme="light">
        {ui}
      </GuiProvider>
    )
  })
  return (id: string) => {
    const el = host.querySelector(`#${id}`) as HTMLElement | null
    if (!el) throw new Error(`#${id} never rendered: ${host.innerHTML}`)
    return el
  }
}

/** A style prop must arrive as CSS. Anything else on the node is a leak. */
const leaked = (el: HTMLElement) =>
  el.getAttributeNames().filter((a) => a !== 'id' && a !== 'class' && a !== 'style')

describe('display grid reaches the DOM', () => {
  it('is grid, not the flex a View defaults to', async () => {
    const find = await draw(
      <>
        <View id="plain" />
        <View id="grid" display="grid" />
      </>
    )
    expect(getComputedStyle(find('plain')).display).toBe('flex')
    expect(getComputedStyle(find('grid')).display).toBe('grid')
    expect(leaked(find('grid'))).toEqual([])
  })

  it('carries the track props as CSS, not as attributes', async () => {
    const find = await draw(
      <View
        id="t"
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gridTemplateRows="auto 1fr"
        gridAutoRows="minmax(40px, auto)"
        gridAutoColumns="1fr"
      />
    )
    const css = getComputedStyle(find('t'))
    expect(css.display).toBe('grid')
    expect(css.gridTemplateColumns).toBe('repeat(3, 1fr)')
    expect(css.gridTemplateRows).toBe('auto 1fr')
    expect(css.gridAutoRows).toBe('minmax(40px, auto)')
    expect(css.gridAutoColumns).toBe('1fr')
    expect(leaked(find('t'))).toEqual([])
  })

  it('carries the placement keywords flex never had', async () => {
    const find = await draw(
      <>
        <View id="a" display="grid" justifyItems="center" placeItems="end" />
        <View id="b" display="grid" placeContent="space-between" />
        <View id="c" display="grid" justifySelf="stretch" placeSelf="center" />
      </>
    )
    expect(getComputedStyle(find('a')).justifyItems).toBe('center')
    expect(getComputedStyle(find('a')).placeItems).toBe('end')
    expect(getComputedStyle(find('b')).placeContent).toBe('space-between')
    expect(getComputedStyle(find('c')).justifySelf).toBe('stretch')
    expect(getComputedStyle(find('c')).placeSelf).toBe('center')
    expect(leaked(find('a'))).toEqual([])
    expect(leaked(find('b'))).toEqual([])
    expect(leaked(find('c'))).toEqual([])
  })

  it('places a child by line and by area', async () => {
    const find = await draw(
      <View id="p" display="grid" gridTemplateAreas="'l r'" gridTemplateColumns="1fr 1fr">
        <View id="byline" gridColumn="1 / 2" gridRow="1 / 2" />
        <View id="byarea" gridArea="r" />
      </View>
    )
    expect(getComputedStyle(find('p')).gridTemplateAreas).toBe('"l r"')
    expect(getComputedStyle(find('byline')).gridColumn).toBe('1 / 2')
    expect(getComputedStyle(find('byarea')).gridArea).toBe('r')
    expect(leaked(find('byline'))).toEqual([])
    expect(leaked(find('byarea'))).toEqual([])
  })

  it('stays grid next to the other atomic classes on the same node', async () => {
    // `.is_View` declares `display: flex`, and grid arrives as one more atomic
    // class rather than an inline style — so the conversion rests on that class
    // winning, on nodes that also carry width, padding and margin classes.
    const find = await draw(
      <>
        <View id="w" display="grid" gridTemplateColumns="repeat(2, 1fr)" width={300} />
        <View id="p" display="grid" padding={16} />
        <View id="m" display="grid" width={300} height={100} margin={8} />
      </>
    )
    for (const id of ['w', 'p', 'm']) {
      expect(`${id}=${getComputedStyle(find(id)).display}`).toBe(`${id}=grid`)
    }
  })

  it('separates the two gaps, which is what a two-value gap meant', async () => {
    const find = await draw(<View id="g" display="grid" rowGap={32} columnGap={24} />)
    const css = getComputedStyle(find('g'))
    expect(css.rowGap).toBe('32px')
    expect(css.columnGap).toBe('24px')
    expect(leaked(find('g'))).toEqual([])
  })
})

describe('the conversion preserves what rendered before', () => {
  /**
   * The migration's whole claim, asserted directly: the native props and the
   * raw style object they replace must compute to the same CSS. Anything gui
   * silently dropped would show up here as a difference.
   */
  const same = (a: HTMLElement, b: HTMLElement, keys: string[]) => {
    const x = getComputedStyle(a)
    const y = getComputedStyle(b)
    for (const k of keys) {
      expect(`${k}=${x[k as any]}`).toBe(`${k}=${y[k as any]}`)
    }
  }

  it('matches the studio preview grid it replaced', async () => {
    const find = await draw(
      <>
        <XStack
          id="was"
          gap="$4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          }}
        />
        <XStack
          id="now"
          gap="$4"
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        />
      </>
    )
    same(find('was'), find('now'), [
      'display',
      'gridTemplateColumns',
      'rowGap',
      'columnGap',
    ])
    // the old form needed an inline style to say grid at all; the new one does not
    expect(find('now').getAttribute('style')).toBeNull()
    expect(leaked(find('now'))).toEqual([])
  })

  it('matches the auto-fill card grid it replaced', async () => {
    const find = await draw(
      <>
        <View
          id="was"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            alignItems: 'start',
          }}
        />
        <View
          id="now"
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          alignItems="start"
        />
      </>
    )
    same(find('was'), find('now'), ['display', 'gridTemplateColumns', 'alignItems'])
    expect(find('now').getAttribute('style')).toBeNull()
    expect(leaked(find('now'))).toEqual([])
  })

  it('matches the auto-fit footer grid, gap split into its two axes', async () => {
    const find = await draw(
      <>
        <View
          id="was"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px 24px',
          }}
        />
        <View
          id="now"
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
          rowGap={32}
          columnGap={24}
        />
      </>
    )
    same(find('was'), find('now'), ['display', 'gridTemplateColumns'])
    // `gap: A B` IS row-gap A, column-gap B. The two are asserted on their own
    // sides rather than through `same`: jsdom's cssstyle does not expand the
    // shorthand, so the old form reads rowGap '' and comparing them would be
    // measuring jsdom, not the conversion.
    expect(getComputedStyle(find('was')).gap).toBe('32px 24px')
    expect(getComputedStyle(find('now')).rowGap).toBe('32px')
    expect(getComputedStyle(find('now')).columnGap).toBe('24px')
    expect(leaked(find('now'))).toEqual([])
  })
})

describe('a stack asked for grid keeps its own axis', () => {
  /**
   * flexDirection is INERT under grid, and grid's default `grid-auto-flow: row`
   * fills ONE implicit column — so an XStack switched to grid used to lay its
   * children out vertically, the opposite of the component's name, with no
   * error anywhere. Measured in a browser before the fix: x 24,24,24 /
   * y 313,353,393.
   *
   * The axis is now said in grid's vocabulary too. The two engines invert:
   * flex `row` runs across, grid `row` fills rows and so runs DOWN. So an
   * XStack's row becomes `grid-auto-flow: column`, and a YStack needs no arm
   * because grid's default flow is already a column of rows.
   *
   * jsdom does no layout, so this asserts the CAUSE — which declaration decides
   * the axis — rather than the child offsets.
   */
  it('an XStack flows across, in grid words', async () => {
    const find = await draw(<XStack id="x" display="grid" />)
    const css = getComputedStyle(find('x'))
    expect(css.display).toBe('grid')
    expect(css.gridAutoFlow).toBe('column')
    expect(leaked(find('x'))).toEqual([])
  })

  it('a YStack flows down, which is already grid default', async () => {
    const find = await draw(<YStack id="y" display="grid" />)
    const css = getComputedStyle(find('y'))
    expect(css.display).toBe('grid')
    // no arm needed: an unset grid-auto-flow already fills one column downward,
    // and jsdom reports the initial value for one that is unset
    expect(find('y').style.gridAutoFlow).toBe('')
    expect(leaked(find('y'))).toEqual([])
  })

  it('costs a plain stack nothing', async () => {
    const find = await draw(<XStack id="p" />)
    expect(find('p').className).toBe('is_View _fd-row')
  })

  it('an explicit template still wins', async () => {
    const find = await draw(
      <XStack id="t" display="grid" gridTemplateColumns="repeat(3, 1fr)" />
    )
    expect(getComputedStyle(find('t')).gridTemplateColumns).toBe('repeat(3, 1fr)')
  })
})
