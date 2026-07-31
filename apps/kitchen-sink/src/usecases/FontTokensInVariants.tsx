import { Text as GuiText, styled } from 'hanzogui'

export const FontTokensInVariants = styled(GuiText, {
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
