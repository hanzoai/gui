import '@testing-library/jest-dom'
import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, Text, View, createGui, styled } from '@hanzogui/core'
import { shorthands } from '@hanzogui/shorthands/v5'
import { Wrap, XStack, YStack } from '@hanzogui/stacks'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

/**
 * `tracks` on web (@hanzogui/web helpers/tracks.ts): the stack is a CSS grid
 * along its own axis, and alignment written the flex way keeps its flex
 * meaning. Every assertion reads the rules gui inserted for the element's own
 * classes, because a renamed or dropped property is only visible there.
 */

// the fleet's shorthands: items, justify, content, self
const conf = createGui({ ...getDefaultGuiConfig(), shorthands })

afterEach(cleanup)

// every rule gui has inserted into the document, as text
const css = () =>
  [...document.styleSheets]
    .flatMap((sheet) => {
      try {
        return [...sheet.cssRules].map((r) => r.cssText)
      } catch {
        return []
      }
    })
    .join('\n')

/** The declarations behind one element's classes, as `prop:value` strings. */
const declarations = (el: Element) => {
  const text = css()
  const out: string[] = []
  for (const cls of el.classList) {
    const escaped = cls.replace(/[^\w-]/g, (c) => `\\${c}`)
    for (const m of text.matchAll(new RegExp(`\\.${escaped}[^{]*\\{([^}]*)\\}`, 'g'))) {
      for (const d of m[1].split(';')) {
        const [prop, ...value] = d.split(':')
        if (prop.trim()) out.push(`${prop.trim()}:${value.join(':').trim()}`)
      }
    }
  }
  return out
}

const draw = (ui: React.ReactElement) =>
  render(
    <GuiProvider config={conf} defaultTheme="light">
      {ui}
    </GuiProvider>
  )

const byId = (id: string) => document.querySelector(`[data-testid="${id}"]`)!

describe('a stack with tracks is a grid along its axis', () => {
  test('YStack: rows, flowing down, one column as wide as the stack', () => {
    draw(<YStack testID="s" tracks="auto 1fr auto" />)
    expect(declarations(byId('s'))).toEqual(
      expect.arrayContaining([
        'display:grid',
        'grid-auto-flow:row',
        'grid-template-rows:auto 1fr auto',
        'grid-auto-columns:minmax(0, 1fr)',
      ])
    )
  })

  test('XStack: columns, flowing across, one row as tall as the stack', () => {
    draw(<XStack testID="s" tracks="240px 1fr" />)
    expect(declarations(byId('s'))).toEqual(
      expect.arrayContaining([
        'display:grid',
        'grid-auto-flow:column',
        'grid-template-columns:240px 1fr',
        'grid-auto-rows:minmax(0, 1fr)',
      ])
    )
  })

  test('the prop never reaches the element', () => {
    draw(<YStack testID="s" tracks="auto 1fr" />)
    expect(byId('s').hasAttribute('tracks')).toBe(false)
  })

  test('a prop the author names wins over the grid', () => {
    draw(<YStack testID="s" tracks="auto 1fr" display="none" gridAutoFlow="dense" />)
    const d = declarations(byId('s'))
    expect(d).toContain('display:none')
    expect(d).not.toContain('display:grid')
    expect(d).toContain('grid-auto-flow:dense')
  })

  test('a stack without tracks is untouched', () => {
    draw(<YStack testID="s" items="center" justify="space-between" />)
    const d = declarations(byId('s'))
    expect(d).toEqual(
      expect.arrayContaining(['align-items:center', 'justify-content:space-between'])
    )
    expect(d.filter((x) => /grid|justify-items|align-content/.test(x))).toEqual([])
  })
})

describe('alignment keeps its flex meaning', () => {
  test('a vertical stack renames its cross-axis alignment onto grid’s inline axis', () => {
    draw(<YStack testID="s" tracks="auto 1fr" items="center" justify="space-between" />)
    const d = declarations(byId('s'))
    expect(d).toContain('justify-items:center')
    expect(d).toContain('align-content:space-between')
    expect(d).not.toContain('align-items:center')
    expect(d).not.toContain('justify-content:space-between')
  })

  test('content (alignContent) lands on justify-content', () => {
    draw(<YStack testID="s" tracks="auto" content="center" />)
    expect(declarations(byId('s'))).toContain('justify-content:center')
  })

  test('a horizontal stack keeps the names, because the axes already agree', () => {
    draw(<XStack testID="s" tracks="1fr 1fr" items="center" justify="space-between" />)
    const d = declarations(byId('s'))
    expect(d).toContain('align-items:center')
    expect(d).toContain('justify-content:space-between')
    expect(d).not.toContain('justify-items:center')
  })

  test('the rename holds inside a media query', () => {
    draw(<YStack testID="s" tracks="auto" $gtSm={{ items: 'flex-end' }} />)
    const rules = css()
    expect(rules).toMatch(/@media[^{]*\{[^}]*justify-items:\s*flex-end/)
    expect(rules).not.toMatch(/@media[^{]*\{[^}]*align-items:\s*flex-end/)
  })

  test('the rename holds for a key a variant sets', () => {
    const Column = styled(YStack, {
      variants: { centered: { true: { alignItems: 'center' } } } as const,
    })
    draw(<Column testID="s" tracks="auto" centered />)
    expect(declarations(byId('s'))).toContain('justify-items:center')
  })
})

describe('a child reads `self` from the stack it sits in', () => {
  test('in a vertical stack, self is the inline axis', () => {
    draw(
      <YStack tracks="auto 1fr">
        <View testID="c" self="center" />
      </YStack>
    )
    const d = declarations(byId('c'))
    expect(d).toContain('justify-self:center')
    expect(d).not.toContain('align-self:center')
  })

  test('a Text child is a child too', () => {
    draw(
      <YStack tracks="auto">
        <Text testID="c" self="flex-end">
          hello
        </Text>
      </YStack>
    )
    expect(declarations(byId('c'))).toContain('justify-self:flex-end')
  })

  test('only the direct child: its own children are flex items again', () => {
    draw(
      <YStack tracks="auto">
        <YStack>
          <View testID="g" self="center" />
        </YStack>
      </YStack>
    )
    expect(declarations(byId('g'))).toContain('align-self:center')
  })

  test('a child keeps its own container alignment', () => {
    draw(
      <YStack tracks="auto">
        <XStack testID="c" items="center" self="center" />
      </YStack>
    )
    const d = declarations(byId('c'))
    expect(d).toContain('align-items:center')
    expect(d).toContain('justify-self:center')
  })

  test('in a horizontal stack, self is unchanged', () => {
    draw(
      <XStack tracks="1fr 1fr">
        <View testID="c" self="center" />
      </XStack>
    )
    expect(declarations(byId('c'))).toContain('align-self:center')
  })

  test('a stack inside a stack is both a child and a stack', () => {
    draw(
      <YStack tracks="auto 1fr">
        <YStack testID="c" tracks="auto" self="center" items="flex-start">
          <View testID="g" self="flex-end" />
        </YStack>
      </YStack>
    )
    const c = declarations(byId('c'))
    expect(c).toContain('justify-self:center')
    expect(c).toContain('justify-items:flex-start')
    expect(declarations(byId('g'))).toContain('justify-self:flex-end')
  })

  test('a styleable wrapper passes the stack through to what it wraps', () => {
    const Card = YStack.styleable((props, ref) => <YStack {...props} ref={ref} />)
    draw(
      <YStack tracks="auto">
        <Card testID="c" self="center" />
      </YStack>
    )
    expect(declarations(byId('c'))).toContain('justify-self:center')
  })
})

describe('Wrap', () => {
  test('is a row that wraps', () => {
    draw(<Wrap testID="w" gap={8} />)
    const d = declarations(byId('w'))
    expect(d).toContain('flex-direction:row')
    expect(d).toContain('flex-wrap:wrap')
    expect(d).toContain('gap:8px')
  })
})
