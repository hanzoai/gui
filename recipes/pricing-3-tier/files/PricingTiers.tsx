import { Button, Card, Stack, Text, XStack } from '@hanzo/gui'

export type Tier = {
  name: string
  price: string
  cadence?: string
  features: string[]
  ctaLabel: string
  onCtaPress: () => void
  highlighted?: boolean
}

export type PricingTiersProps = {
  tiers?: Tier[]
}

const DEFAULT_TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    cadence: '/mo',
    features: ['Up to 3 projects', 'Community support', 'Basic analytics'],
    ctaLabel: 'Get started',
    onCtaPress: () => {},
  },
  {
    name: 'Pro',
    price: '$29',
    cadence: '/mo',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Team seats'],
    ctaLabel: 'Start Pro trial',
    onCtaPress: () => {},
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: ['SLA + dedicated CSM', 'SSO + audit log', 'Custom contracts'],
    ctaLabel: 'Talk to sales',
    onCtaPress: () => {},
  },
]

export function PricingTiers({ tiers = DEFAULT_TIERS }: PricingTiersProps) {
  return (
    <XStack gap="$3" flexWrap="wrap">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          padding="$4"
          gap="$3"
          width={260}
          borderWidth={tier.highlighted ? 2 : 1}
          borderColor={tier.highlighted ? '$blue10' : '$gray6'}
        >
          <Text fontSize="$6" fontWeight="700">{tier.name}</Text>
          <Stack flexDirection="row" alignItems="baseline" gap="$1">
            <Text fontSize="$8" fontWeight="800">{tier.price}</Text>
            {tier.cadence && <Text color="$gray11">{tier.cadence}</Text>}
          </Stack>
          <Stack gap="$1">
            {tier.features.map((f) => (
              <Text key={f}>✓ {f}</Text>
            ))}
          </Stack>
          <Button onPress={tier.onCtaPress}>{tier.ctaLabel}</Button>
        </Card>
      ))}
    </XStack>
  )
}
