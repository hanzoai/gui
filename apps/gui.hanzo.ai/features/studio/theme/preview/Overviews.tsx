import type { YStackProps } from '@hanzo/gui'
import { H4, Paragraph, XStack, YStack } from '@hanzo/gui'
import { useDemoProps } from '../hooks/useDemoProps'

export const Overview1 = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      p="$0"
      overflow="hidden"
    >
      <YStack flex={1} flexBasis="auto">
        <OverviewCard
          // alternative
          title="ARR"
          value="$204,010"
          badgeText="+40.5%"
          badgeState="success"
        />
      </YStack>
    </YStack>
  )
}
export const Overview2 = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      p="$0"
      overflow="hidden"
    >
      <YStack flex={1} flexBasis="auto">
        <OverviewCard
          title="New Users"
          value="113"
          badgeText="+142.2%"
          badgeState="success"
        />
      </YStack>
    </YStack>
  )
}

export type OverviewCardTypes = {
  title: string
  value: string
  badgeText?: string
  badgeAfter?: string
  badgeState?: 'success' | 'failure' | 'indifferent'
  alternative?: boolean
} & YStackProps

export const OverviewCard = ({
  title,
  value,
  badgeText,
  badgeState,
  badgeAfter,
  alternative,
  ...props
}: OverviewCardTypes) => {
  const demoProps = useDemoProps()

  return (
    <YStack
      position="relative"
      rounded="$true"
      backgroundColor="transparent"
      {...props}
      {...(alternative && {
        bg: '$color8',
        m: -10,
        p: 10,
      })}
    >
      <YStack
        z={10}
        mb="auto"
        p="$true"
        flex={1}
        flexBasis="auto"
        justify="space-between"
        {...demoProps.gapPropsLg}
      >
        <Paragraph
          {...demoProps.headingFontFamilyProps}
          fontWeight="400"
          mb="$-2"
          color="$color12"
          {...(alternative && {
            color: '$accent12',
          })}
        >
          {title}
        </Paragraph>
        <H4
          size="$9"
          {...(alternative && {
            color: '$accent12',
          })}
        >
          {value}
        </H4>
        <XStack>
          {!!badgeText && (
            <Paragraph
              size="$2"
              px="$2"
              {...(alternative && {
                color: '$accent12',
              })}
            >
              {badgeText}
            </Paragraph>
          )}
          {badgeAfter && <Paragraph>{badgeAfter}</Paragraph>}
        </XStack>
      </YStack>
    </YStack>
  )
}
