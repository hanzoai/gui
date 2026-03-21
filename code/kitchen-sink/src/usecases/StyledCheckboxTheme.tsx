import { Check } from '@hanzo/gui-lucide-icons-2'
import { Checkbox as TamaguiCheckbox, styled, withStaticProperties } from '@hanzo/gui'

export const Checkbox = withStaticProperties(
  styled(TamaguiCheckbox, {
    theme: 'green',
  }),
  {
    Indicator() {
      return (
        <TamaguiCheckbox.Indicator>
          <Check color="$color12" />
        </TamaguiCheckbox.Indicator>
      )
    },
  }
)

export const StyledCheckboxTheme = () => (
  <Checkbox defaultChecked={true} theme="green">
    <Checkbox.Indicator />
  </Checkbox>
)
