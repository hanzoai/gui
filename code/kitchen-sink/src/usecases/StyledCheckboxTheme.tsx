import { Check } from '@hanzo/gui-lucide-icons-2'
import { Checkbox as GuiCheckbox, styled, withStaticProperties } from '@hanzo/gui'

export const Checkbox = withStaticProperties(
  styled(GuiCheckbox, {
    theme: 'green',
  }),
  {
    Indicator() {
      return (
        <GuiCheckbox.Indicator>
          <Check color="$color12" />
        </GuiCheckbox.Indicator>
      )
    },
  }
)

export const StyledCheckboxTheme = () => (
  <Checkbox defaultChecked={true} theme="green">
    <Checkbox.Indicator />
  </Checkbox>
)
