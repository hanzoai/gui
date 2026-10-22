import { View, Wrap, XStack, YStack } from '@hanzo/gui'

/**
 * `tracks` and `Wrap` in a real browser, at fixed pixel sizes so
 * tests/tracks.integration.test.js can measure every box. Served at `/?tracks`.
 */
export const Tracks = () => (
  <View padding={20} gap={20}>
    {/* rows 40 / 1fr / 30 down a 300px column, children stretched across */}
    <YStack testID="y" tracks="40px 1fr 30px" width={200} height={300}>
      <View testID="y0" backgroundColor="red" />
      <View testID="y1" backgroundColor="green">
        {/* a flex column again: flex-end is the right edge */}
        <YStack testID="g">
          <View testID="g0" width={20} height={10} alignSelf="flex-end" />
        </YStack>
      </View>
      <View testID="y2" backgroundColor="blue" />
    </YStack>

    {/* alignment written the flex way, on a vertical stack */}
    <YStack testID="ya" tracks="auto auto" width={200} alignItems="center">
      <View testID="ya0" width={50} height={10} backgroundColor="red" />
      <View testID="ya1" width={50} height={10} alignSelf="flex-end" />
    </YStack>

    {/* columns 60 / 1fr across 300px, children stretched down */}
    <XStack testID="x" tracks="60px 1fr" width={300} height={100} alignItems="center">
      <View testID="x0" backgroundColor="red" />
      <View testID="x1" height={20} backgroundColor="green" />
    </XStack>

    {/* the flex stack, untouched */}
    <YStack testID="f" width={200} alignItems="center">
      <View testID="f0" width={50} height={10} />
    </YStack>

    <Wrap testID="w" width={100} gap={10}>
      <View testID="w0" width={40} height={40} />
      <View testID="w1" width={40} height={40} />
      <View testID="w2" width={40} height={40} />
    </Wrap>
  </View>
)
