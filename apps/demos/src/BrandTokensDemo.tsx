import { Button, Card, H2, Paragraph, Text, Theme, XStack, YStack } from 'hanzogui'

// Proof surface for the token layer: true-black neutral ramp, one accent per
// white-label brand (read straight from each brand's generated theme — the
// $color9 accent slot), Geist type. Open with ?demo=BrandTokens.
// Brand accent SoT: pkgs/core/themes/src/brands.ts.

const BRANDS = ['hanzo', 'lux', 'zoo', 'pars'] as const

const SURFACES: Array<[string, string, string]> = [
  ['background', '$background', '#000 canvas'],
  ['color2', '$color2', '#050505 panel'],
  ['color3', '$color3', '#0f0f0f raised'],
  ['color4', '$color4', '#171717 elevated'],
]

export function BrandTokensDemo() {
  return (
    <Theme name="dark">
      <YStack backgroundColor="$background" padding="$6" gap="$5" minHeight={640}>
        <YStack gap="$2">
          <H2 fontFamily="$heading" color="$color12">
            Hanzo GUI — design tokens
          </H2>
          <Paragraph color="$color11" fontFamily="$body">
            True-black canvas · one accent per brand · Geist type system
          </Paragraph>
        </YStack>

        <YStack gap="$2">
          <Text color="$color11" fontFamily="$mono" fontSize="$2">
            neutral surface ramp
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {SURFACES.map(([name, tok, label]) => (
              <YStack
                key={name}
                backgroundColor={tok}
                width={160}
                height={96}
                borderRadius={12}
                borderWidth={1}
                borderColor="$borderColor"
                padding="$3"
                justifyContent="flex-end"
              >
                <Text color="$color12" fontFamily="$mono" fontSize="$3">
                  {name}
                </Text>
                <Text color="$color10" fontSize="$2">
                  {label}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>

        <YStack gap="$2">
          <Text color="$color11" fontFamily="$mono" fontSize="$2">
            per-brand accent (applied sparingly over the shared canvas)
          </Text>
          <XStack gap="$4" flexWrap="wrap">
            {BRANDS.map((b) => (
              <Theme key={b} name={b}>
                <Card
                  backgroundColor="$color2"
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius={12}
                  padding="$4"
                  width={210}
                  gap="$3"
                >
                  <XStack alignItems="center" gap="$2">
                    <YStack
                      width={14}
                      height={14}
                      borderRadius={999}
                      backgroundColor="$color9"
                    />
                    <Text color="$color12" fontFamily="$heading" fontSize="$5">
                      {b}
                    </Text>
                  </XStack>
                  <YStack
                    height={44}
                    borderRadius={8}
                    backgroundColor="$color9"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$color1" fontSize="$3" fontWeight="700">
                      Primary CTA
                    </Text>
                  </YStack>
                  <Button>Themed button</Button>
                </Card>
              </Theme>
            ))}
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  )
}
