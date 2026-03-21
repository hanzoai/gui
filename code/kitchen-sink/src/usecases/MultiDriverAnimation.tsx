import { useState } from 'react'
import { Button, Square, YStack, XStack, Text, View } from 'tamagui'

/**
 * Test case for multi-driver animation config.
 * Tests that animatedBy prop correctly selects different drivers.
 *
 * With config: { default: motionDriver, css: cssDriver }
 * - animatedBy="default" should use motion driver (JS-based, smooth)
 * - animatedBy="css" should use CSS driver (CSS transitions)
 * - no animatedBy should use default (motion)
 * - $group-hover with transition should work with selected driver
 */
export function MultiDriverAnimation() {
  const [active, setActive] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <XStack gap="$4">
        {/* animatedBy="default" - uses motion driver */}
        <YStack alignItems="center" gap="$2">
          <Text fontSize="$2">default (motion)</Text>
          <Square
            testID="driver-default"
            animatedBy="default"
            size={80}
            backgroundColor={active ? '$blue10' : '$red10'}
            opacity={active ? 1 : 0.3}
            transition="200ms"
          />
        </YStack>

        {/* animatedBy="css" - uses CSS driver */}
        <YStack alignItems="center" gap="$2">
          <Text fontSize="$2">css</Text>
          <Square
            testID="driver-css"
            animatedBy="css"
            size={80}
            backgroundColor={active ? '$green10' : '$purple10'}
            opacity={active ? 1 : 0.3}
            transition="200ms"
          />
        </YStack>

        {/* no animatedBy - uses default (motion) */}
        <YStack alignItems="center" gap="$2">
          <Text fontSize="$2">no prop (default)</Text>
          <Square
            testID="driver-none"
            size={80}
            backgroundColor={active ? '$orange10' : '$pink10'}
            opacity={active ? 1 : 0.3}
            transition="200ms"
          />
        </YStack>
      </XStack>

      <Button testID="toggle-multi" onPress={() => setActive(!active)}>
        Toggle Animation
      </Button>

      {/* group hover with different drivers */}
      <Text fontSize="$3" fontWeight="bold">
        Group hover transitions
      </Text>
      <XStack gap="$4">
        {/* group with default (motion) driver */}
        <View
          testID="group-motion"
          // @ts-expect-error - custom group name
          group="motionGroup"
          padding="$4"
          backgroundColor="$gray5"
          borderRadius="$4"
        >
          <Square
            testID="group-motion-child"
            size={60}
            backgroundColor="$blue10"
            opacity={0.5}
            transition="500ms"
            $group-motionGroup-hover={{
              opacity: 1,
              scale: 1.1,
              transition: '100ms',
            }}
          />
        </View>

        {/* group with css driver */}
        <View
          testID="group-css"
          // @ts-expect-error - custom group name
          group="cssGroup"
          animatedBy="css"
          padding="$4"
          backgroundColor="$gray5"
          borderRadius="$4"
        >
          <Square
            testID="group-css-child"
            animatedBy="css"
            size={60}
            backgroundColor="$green10"
            opacity={0.5}
            transition="500ms"
            $group-cssGroup-hover={{
              opacity: 1,
              scale: 1.1,
              transition: '100ms',
            }}
          />
        </View>
      </XStack>
    </YStack>
  )
}
