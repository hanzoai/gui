import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, Theme, View, createGui } from '@hanzogui/core'
import { Section } from '@hanzogui/elements'
import { Separator } from '@hanzogui/separator'
import { Cell, Grid, XStack, YStack, ZStack } from '@hanzogui/stacks'
import { createRoot } from 'react-dom/client'

/**
 * The default config's themes carry `background` and `color` and nothing else,
 * so `$borderColor` and `$backgroundFocus` BOTH resolve to the CSS initial
 * value and a colour assertion cannot tell them apart. Naming them here, as two
 * colours nothing else uses, is what makes "which token did the rule take"
 * answerable at all.
 */
const conf = createGui({
  ...getDefaultGuiConfig(),
  themes: {
    light: {
      background: '#fff',
      color: '#000',
      borderColor: 'rgb(1, 2, 3)',
      backgroundFocus: 'rgb(9, 8, 7)',
    },
  },
})

/**
 * Every layout claim this change makes, in one page, mounted in a real browser.
 *
 * jsdom cannot answer any of it: `getComputedStyle` there resolves the cascade
 * correctly for the FIRST element queried in a document and returns the base
 * `.is_View` rule for every element after it, so three identical `display:grid`
 * boxes read grid, flex, flex. Measured, not assumed — see the report.
 */
const Probe = () => (
  <GuiProvider config={conf} defaultTheme="light">
    <Theme name="light">
    {/* --- the flex controls. These must not move. --- */}
    <YStack data-probe="ystack" />
    <XStack data-probe="xstack" />
    <ZStack data-probe="zstack" />

    {/* --- Grid --- */}
    <Grid data-probe="grid-default" />
    <Grid data-probe="grid-count" columns={3} />
    <Grid data-probe="grid-rows" rows={['auto', '1fr']} />
    <Grid data-probe="grid-gap-token" gap="$4" />
    <Grid data-probe="grid-gap-px" gap={16} />
    {/* the case jsdom got wrong: a caller style prop beside the base */}
    <Grid data-probe="grid-with-props" width={300} p="$4" />

    <Grid columns={4}>
      <Cell data-probe="cell-span" col={2} />
      <Cell data-probe="cell-place" col="2 / -1" row={3} />
      <YStack data-probe="grid-plain-child" />
    </Grid>

    {/* the responsive fit has to actually reflow, which is a layout question */}
    <View width={390} data-probe="narrow-box">
      <Grid data-probe="grid-narrow" columns={{ min: 160, max: 4 }} gap={12}>
        {Array.from({ length: 8 }, (_, i) => (
          <YStack key={i} data-probe-cell="narrow" height={10} />
        ))}
      </Grid>
    </View>
    <View width={1280} data-probe="wide-box">
      <Grid data-probe="grid-wide" columns={{ min: 160, max: 4 }} gap={12}>
        {Array.from({ length: 8 }, (_, i) => (
          <YStack key={i} data-probe-cell="wide" height={10} />
        ))}
      </Grid>
    </View>
    {/* no cap: the same floor must give more than four columns at 1280 */}
    <View width={1280}>
      <Grid data-probe="grid-uncapped" columns={{ min: 160 }} gap={12}>
        {Array.from({ length: 12 }, (_, i) => (
          <YStack key={i} data-probe-cell="uncapped" height={10} />
        ))}
      </Grid>
    </View>
    {/* a min wider than the viewport must not push the document sideways */}
    <View width={390} overflow="visible">
      <Grid data-probe="grid-overwide" columns={{ min: 900 }}>
        <YStack height={10} />
      </Grid>
    </View>

    {/* --- Separator. The colour reference is a box asking for the same two
        tokens, so the assertion is "the rule took THIS token", not a literal
        rgb() that moves with the theme. --- */}
    <Separator data-probe="sep" />
    <Separator data-probe="sep-v" vertical />
    <View
      data-probe="token-border"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      borderRightWidth={1}
      borderRightColor="$backgroundFocus"
    />

    {/* --- Section: the semantic element --- */}
    <Section data-probe="section" />
    </Theme>
  </GuiProvider>
)

createRoot(document.getElementById('root')!).render(<Probe />)
