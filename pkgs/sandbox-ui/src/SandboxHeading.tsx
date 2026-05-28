import { Text, styled } from '@hanzogui/core'

export const SandboxHeading = styled(Text, {
  render: 'h1',
  color: '$color',
  backgroundColor: '$background',

  pressStyle: {
    backgroundColor: 'red',
  },

  variants: {
    size: {
      large: {
        fontSize: 22,
      },
      small: {
        fontSize: 16,
      },
    },
  },
})
