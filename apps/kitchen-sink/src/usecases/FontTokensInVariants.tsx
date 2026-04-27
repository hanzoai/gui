import { Text as HanzoguiText, styled } from 'hanzogui'

export const FontTokensInVariants = styled(HanzoguiText, {
  borderRadius: 100_000_000,

  variants: {
    type: {
      H1: {
        fontFamily: '$mono',
        fontSize: '$1',
      },
    },
  } as const,
})
