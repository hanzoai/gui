import { Check } from '@hanzo/gui-lucide-icons-2'
import { YStack } from '@hanzo/gui'

export const CheckCircle = () => (
  <YStack
    bg="$backgroundHover"
    width={25}
    height={25}
    items="center"
    justify="center"
    rounded={100}
    mr="$2.5"
  >
    <Check size={12} color="var(--colorHover)" />
  </YStack>
)
