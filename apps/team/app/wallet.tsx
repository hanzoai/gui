import { Separator, SizableText, XStack, YStack } from 'hanzogui'

// layout skeleton — live values wire to billing.hanzo.ai (hanzoai/commerce)
const usage = [
  { label: 'AI credits used', value: '0' },
  { label: 'Requests', value: '0' },
  { label: 'Seats', value: '1' },
  { label: 'Period', value: 'This month' },
] as const

export default function Wallet() {
  return (
    <YStack p="$4" gap="$4" maxW={560} width="100%" self="center">
      <YStack
        bg="$color1"
        borderWidth={1}
        borderColor="$borderColor"
        rounded="$6"
        p="$4"
        gap="$1"
      >
        <SizableText size="$2" color="$color10">
          Balance
        </SizableText>
        <SizableText size="$9" fontWeight="600">
          $0.00
        </SizableText>
        <SizableText size="$1" color="$color10">
          Usage-metered · billed via billing.hanzo.ai
        </SizableText>
      </YStack>

      <YStack bg="$color1" borderWidth={1} borderColor="$borderColor" rounded="$6">
        {usage.map((row, index) => (
          <YStack key={row.label}>
            {index > 0 && <Separator borderColor="$borderColor" />}
            <XStack p="$3.5" items="center" justify="space-between">
              <SizableText size="$3" color="$color10">
                {row.label}
              </SizableText>
              <SizableText size="$3" fontWeight="600">
                {row.value}
              </SizableText>
            </XStack>
          </YStack>
        ))}
      </YStack>
    </YStack>
  )
}
