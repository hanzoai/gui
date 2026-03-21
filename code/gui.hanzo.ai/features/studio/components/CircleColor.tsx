import type { CircleProps } from '@hanzo/gui'
import { Circle, useProps } from '@hanzo/gui'
import { YStack } from '@hanzo/gui'

import { Checkerboard } from './Checkerboard'

export const CircleColor = (propsIn: CircleProps) => {
  const { bg, ...props } = useProps(propsIn)
  return (
    <Circle borderWidth={1} borderColor="$borderColor" overflow="hidden" {...props}>
      <Checkerboard />
      <YStack fullscreen bg={bg} />
      <YStack
        z={100}
        fullscreen
        rounded={100}
        style={{
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.05)`,
        }}
      />
    </Circle>
  )
}
