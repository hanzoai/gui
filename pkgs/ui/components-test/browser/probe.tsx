import { getDefaultGuiConfig } from '@hanzogui/config-default'
import { GuiProvider, Theme, View, createGui } from '@hanzogui/core'
import { Section } from '@hanzogui/elements'
import { Separator } from '@hanzogui/separator'
import { XStack, YStack, ZStack } from '@hanzogui/stacks'
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
 * Every layout claim, in one page, mounted in a real browser.
 *
 * jsdom cannot answer any of it: `getComputedStyle` there resolves the cascade
 * correctly for the FIRST element queried in a document and returns the base
 * `.is_View` rule for every element after it, so three identical `display:grid`
 * boxes read grid, flex, flex. Measured, not assumed.
 *
 * Grid is a DISPLAY, not a component. There is no `<Grid>` here because there
 * is no `Grid` to import — the layout mode is a parameter of any box, which is
 * what makes `<XStack display="grid">` and `<View display="grid">` both mean
 * something, and what keeps a layout export from shadowing the `Grid` icon.
 */
const Probe = () => (
  <GuiProvider config={conf} defaultTheme="light">
    <Theme name="light">
      {/* --- the flex controls. These must not move. --- */}
      <YStack data-probe="ystack" />
      <XStack data-probe="xstack" />
      <ZStack data-probe="zstack" />

      {/* --- display: grid, on the boxes that already exist --- */}
      <View
        data-probe="grid-view"
        display="grid"
        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
        gridTemplateRows="auto auto"
        gap="$4"
      />
      {/* An XStack asked for grid runs ACROSS: `flexDirection: row` is inert
          under grid, so the track list is the only thing deciding the axis. */}
      <XStack
        data-probe="grid-xstack"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      />
      {/* The case jsdom read as `flex`: a caller style prop beside display. */}
      <View data-probe="grid-with-props" display="grid" width={300} p="$4" />

      <View data-probe="grid-place" display="grid" gridTemplateColumns="repeat(4, 1fr)">
        <View data-probe="cell-span" gridColumn="span 2" />
        <View data-probe="cell-place" gridColumn="2 / -1" gridRow="span 3" />
        <YStack data-probe="grid-plain-child" />
      </View>

      {/* the responsive fit has to actually reflow, which is a layout question */}
      <View width={390}>
        <View
          display="grid"
          gap={12}
          gridTemplateColumns="repeat(auto-fill, minmax(max(min(160px, 100%), calc((100% - 36px) / 4)), 1fr))"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <YStack key={i} data-probe-cell="narrow" height={10} />
          ))}
        </View>
      </View>
      <View width={1280}>
        <View
          display="grid"
          gap={12}
          gridTemplateColumns="repeat(auto-fill, minmax(max(min(160px, 100%), calc((100% - 36px) / 4)), 1fr))"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <YStack key={i} data-probe-cell="wide" height={10} />
          ))}
        </View>
      </View>
      {/* a floor wider than the box must not push the document sideways */}
      <View width={390}>
        <View
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(min(900px, 100%), 1fr))"
        >
          <YStack height={10} />
        </View>
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

      {/* --- Section: the semantic element, which owns no spacing --- */}
      <Section data-probe="section" />
    </Theme>
  </GuiProvider>
)

createRoot(document.getElementById('root')!).render(<Probe />)
