import React from 'react'
import * as LucideIcons from '@hanzogui/lucide-icons-2'

import { ScrollView } from 'react-native'
import { Input, Paragraph, Spacer, View, YStack, useDebounceValue } from '@hanzo/gui'

const lucideIcons = Object.keys(
  // vite tree shaking workaround
  typeof LucideIcons !== 'undefined' ? LucideIcons : {}
).map((name) => ({
  key: name.toLowerCase(),
  name,
  Icon: LucideIcons[name],
}))

export function LucideIconsDemo() {
  const [searchRaw, setSearch] = React.useState('')
  const search = useDebounceValue(searchRaw, 400)

  const size = 100

  const iconsMemo = React.useMemo(
    () =>
      lucideIcons
        .filter((x) => x.key.includes(search.toLowerCase()))
        .map(({ Icon, name }) => (
          <YStack height={size + 20} items="center" justify="center" key={name}>
            <Icon size={size * 0.25} />
            <Spacer />
            <Paragraph
              height="$6"
              wordWrap="break-word"
              maxW="100%"
              text="center"
              px="$2"
              size="$1"
              opacity={0.5}
            >
              {name}
            </Paragraph>
          </YStack>
        )),
    [search]
  )

  return (
    <YStack minW="100%" p="$4" pb="$0" gap="$4">
      <Input value={searchRaw} onChangeText={setSearch as any} placeholder="Search..." />

      <YStack height={420}>
        <ScrollView>
          {/*
            One element, both engines. On web the track list runs and the flex
            properties are inert; on native there is no grid, so display falls
            back to flex and the track list is stripped — leaving a wrapping
            row, which is what an icon grid of fixed-size children needs. Icons
            carry their own size, so nothing has to be said per child.
          */}
          <View
            display="grid"
            gridTemplateColumns={`repeat(auto-fit, minmax(min(${size}px, 100%), 1fr))`}
            flexDirection="row"
            flexWrap="wrap"
            justify="center"
            items="center"
          >
            {iconsMemo}
          </View>
        </ScrollView>
      </YStack>
    </YStack>
  )
}
