import { YStack } from 'hanzogui'
import { HanzoguiIconSvg } from './HanzoguiLogoSvg'
import type { JSX } from 'react/jsx-runtime'

export const LogoIcon = ({
  downscale = 2,
  color,
}: {
  downscale?: number
  color?: string
}): JSX.Element => {
  return (
    <YStack
      render="span"
      className="unselectable"
      alignSelf="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 0.7,
        scaleX: -1,
      }}
    >
      <HanzoguiIconSvg
        className="hanzogui-icon"
        width={450 / 8 / downscale}
        height={420 / 8 / downscale}
        color={color}
      />
    </YStack>
  )
}
