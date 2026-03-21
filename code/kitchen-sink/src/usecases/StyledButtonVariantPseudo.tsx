import { Button, styled } from '@hanzo/gui'

const StyledButton = styled(Button, {
  variants: {
    reddish: {
      true: {
        backgroundColor: 'yellow',

        pressStyle: {
          backgroundColor: 'red',
        },

        hoverStyle: {
          backgroundColor: 'green',
        },
      },
    },
  } as const,
})

export const StyledButtonVariantPseudo = () => (
  <StyledButton id="test" reddish>
    test
  </StyledButton>
)
