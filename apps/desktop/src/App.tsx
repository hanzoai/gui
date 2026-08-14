import { TitleBar } from '@hanzogui/tauri'
import { Button, Card, H1, Paragraph, Text, Theme, XStack, YStack } from '@hanzo/gui'
import type { BrandName } from '@hanzogui/themes'

const brands: BrandName[] = ['hanzo', 'lux', 'zoo', 'pars']

// The Tauri webview content: a hanzogui tree on the true-black default theme.
// Rendering this proves the weld — the same components that run on web/native
// render in the desktop webview, and the TitleBar drives the real OS window.
export function App() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <TitleBar title="Hanzo — Desktop (Tauri weld)" />

      <YStack flex={1} padding="$6" gap="$5">
        <YStack gap="$2">
          <H1 fontFamily="$heading" fontSize={32} color="$color12">
            One definition, every surface
          </H1>
          <Paragraph fontFamily="$body" fontSize={15} color="$color11" maxWidth={560}>
            This window is a Tauri webview rendering @hanzo/gui on the true-black default
            theme. The bar above is a hanzogui component driving the real OS window
            through @hanzogui/tauri.
          </Paragraph>
        </YStack>

        <Card
          backgroundColor="$color2"
          borderColor="$borderColor"
          borderWidth={1}
          borderRadius={12}
          padding="$5"
          gap="$4"
        >
          <Text fontFamily="$body" fontSize={13} color="$color11">
            Per-brand accent — one hue each, used sparingly over the shared canvas
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {brands.map((brand) => (
              <Theme key={brand} name={brand}>
                <Button
                  backgroundColor="$color9"
                  color="$color1"
                  borderRadius={8}
                  hoverStyle={{ backgroundColor: '$color10' }}
                  pressStyle={{ backgroundColor: '$color8' }}
                >
                  {brand}
                </Button>
              </Theme>
            ))}
          </XStack>
        </Card>
      </YStack>
    </YStack>
  )
}
