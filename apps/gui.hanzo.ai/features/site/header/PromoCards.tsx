import { Brush } from '@hanzogui/lucide-icons-2'
import { styled, YStack } from '@hanzo/gui'
import { TooltipLabelLarge } from './TooltipLabelLarge'

const Card = styled(YStack, {
  maxH: 120,
  width: 'calc(50% - 6px)',
  flex: 1,
  flexBasis: 'auto',
  rounded: '$4',
  borderWidth: 0.5,
  borderColor: '$color4',

  $gtXs: {
    width: 'auto',
    maxW: 'calc(min(100%, 257px))',
  },
})

export const PromoCards = ({ less }: { less?: boolean }) => {
  return (
    <>
      <Card>
        <PromoCardTheme />
      </Card>
    </>
  )
}

export const PromoCardTheme = () => {
  return (
    <TooltipLabelLarge
      href="/theme"
      icon={<Brush y={-2} size={20} />}
      title="Theme"
      subtitle="Generate themes using a custom AI."
    />
  )
}
