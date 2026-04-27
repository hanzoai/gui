import { Check } from '@hanzogui/lucide-icons-2'
import { Checkbox as HanzoguiCheckbox, styled, withStaticProperties } from 'hanzogui'

export const Checkbox = withStaticProperties(
  styled(HanzoguiCheckbox, {
    theme: 'green',
  }),
  {
    Indicator() {
      return (
        <HanzoguiCheckbox.Indicator>
          <Check color="$color12" />
        </HanzoguiCheckbox.Indicator>
      )
    },
  }
)

export const StyledCheckboxTheme = () => (
  <Checkbox defaultChecked={true} theme="green">
    <Checkbox.Indicator />
  </Checkbox>
)
