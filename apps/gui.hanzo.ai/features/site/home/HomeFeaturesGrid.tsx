import { EnsureFlexed, H4, Paragraph, View, YStack } from '@hanzo/gui'

import { ContainerLarge } from '~/components/Containers'

export function HomeFeaturesGrid() {
  return (
    <>
      <ContainerLarge gap="$8">
        <YStack maxW={950} self="center">
          {/*
            As many equal columns as fit at 280px or wider, and no media query
            anywhere — the reflow is the track list's own.

            `min(280px, 100%)` rather than a bare 280px: minmax(280px, 1fr)
            forces a 280px track inside a narrower viewport and scrolls the
            document sideways. `minmax(0, 1fr)` is implied by auto-fit here;
            what matters is that the floor can collapse.
          */}
          <View
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(min(280px, 100%), 1fr))"
            gap={25}
          >
            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Fully typed
              </H4>
              <Paragraph color="$color10">
                <EnsureFlexed />
                Typed inline styles, themes, tokens, shorthands, media queries,
                animations, and hooks that optimize.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Server-first
              </H4>
              <Paragraph color="$color10">
                SSR and RSC just work, hydrate, and don't flicker, with all animation
                drivers, responsive styles, and themes.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Fast
              </H4>
              <Paragraph color="$color10">
                Fully optimizes and flattens to platform-ideal code for web and native,
                every feature works at compile and runtime.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Introspection
              </H4>
              <Paragraph color="$color10">
                <EnsureFlexed />
                Multi-level debug pragma and props, compile-time JSX props for quick
                file:line:component jump.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Compatibility
              </H4>
              <Paragraph color="$color10">
                Runs entirely without plugins, with optional optimizing plugins for Metro,
                Vite, and Webpack.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 letterSpacing={0} fontFamily="$mono" text="center">
                Full Featured
              </H4>
              <Paragraph color="$color10">
                Style library + headless components. Animations, themes, variants, tokens,
                fonts. Advanced selectors, and more.
              </Paragraph>
            </YStack>
          </View>
        </YStack>
      </ContainerLarge>
    </>
  )
}
